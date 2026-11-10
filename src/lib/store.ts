import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Pool } from "pg";
import { randomUUID } from "crypto";
import type { DocumentRecord, DocumentSummary, UserId } from "./types";

const localFile = path.join(process.cwd(), ".data", "documents.json");
let pool: Pool | undefined;

function database() {
  if (!process.env.DATABASE_URL) return undefined;
  // Neon requires TLS in both local verification and deployed environments.
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

async function ensureSchema() {
  const db = database();
  if (!db) return undefined;
  await db.query(`CREATE TABLE IF NOT EXISTS documents (
    id text PRIMARY KEY, title text NOT NULL, content jsonb NOT NULL,
    owner_id text NOT NULL, shared_with jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL
  )`);
  // Early local versions could serialize an empty JavaScript array as a JSON object.
  await db.query("UPDATE documents SET shared_with = '[]'::jsonb WHERE jsonb_typeof(shared_with) <> 'array'");
  return db;
}

async function localDocuments(): Promise<DocumentRecord[]> {
  try { return JSON.parse(await readFile(localFile, "utf8")) as DocumentRecord[]; }
  catch { return []; }
}

async function saveLocal(documents: DocumentRecord[]) {
  await mkdir(path.dirname(localFile), { recursive: true });
  await writeFile(localFile, JSON.stringify(documents, null, 2), "utf8");
}

function toRecord(row: Record<string, unknown>): DocumentRecord {
  return { id: row.id as string, title: row.title as string, content: row.content as Record<string, unknown>, ownerId: row.owner_id as UserId, sharedWith: Array.isArray(row.shared_with) ? row.shared_with as UserId[] : [], createdAt: new Date(row.created_at as string).toISOString(), updatedAt: new Date(row.updated_at as string).toISOString() };
}

export async function listDocuments(userId: UserId): Promise<DocumentSummary[]> {
  const db = await ensureSchema();
  const documents = db
    ? (await db.query("SELECT * FROM documents WHERE owner_id = $1 OR shared_with ? $2 ORDER BY updated_at DESC", [userId, userId])).rows.map(toRecord)
    : (await localDocuments()).filter((doc) => doc.ownerId === userId || doc.sharedWith.includes(userId));
  return documents.map(({ id, title, ownerId, updatedAt }) => ({ id, title, ownerId, updatedAt, access: ownerId === userId ? "owner" : "shared" }));
}

export async function getDocument(id: string): Promise<DocumentRecord | null> {
  const db = await ensureSchema();
  if (db) { const result = await db.query("SELECT * FROM documents WHERE id = $1", [id]); return result.rows[0] ? toRecord(result.rows[0]) : null; }
  return (await localDocuments()).find((doc) => doc.id === id) ?? null;
}

export async function createDocument(ownerId: UserId, title = "Untitled document", content: Record<string, unknown> = emptyContent()) {
  const now = new Date().toISOString();
  const document: DocumentRecord = { id: randomUUID(), title, content, ownerId, sharedWith: [], createdAt: now, updatedAt: now };
  const db = await ensureSchema();
  if (db) await db.query("INSERT INTO documents (id,title,content,owner_id,shared_with,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7)", [document.id, document.title, document.content, document.ownerId, JSON.stringify(document.sharedWith), document.createdAt, document.updatedAt]);
  else { const documents = await localDocuments(); documents.push(document); await saveLocal(documents); }
  return document;
}

export async function updateDocument(document: DocumentRecord) {
  document.updatedAt = new Date().toISOString();
  const db = await ensureSchema();
  if (db) await db.query("UPDATE documents SET title=$2,content=$3,shared_with=$4,updated_at=$5 WHERE id=$1", [document.id, document.title, document.content, JSON.stringify(document.sharedWith), document.updatedAt]);
  else { const documents = await localDocuments(); const index = documents.findIndex((item) => item.id === document.id); if (index >= 0) { documents[index] = document; await saveLocal(documents); } }
  return document;
}

export async function deleteDocument(id: string) {
  const db = await ensureSchema();
  if (db) await db.query("DELETE FROM documents WHERE id=$1", [id]);
  else await saveLocal((await localDocuments()).filter((document) => document.id !== id));
}

export function emptyContent(): Record<string, unknown> {
  return { type: "doc", content: [{ type: "paragraph" }] };
}
