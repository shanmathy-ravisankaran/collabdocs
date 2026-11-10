import assert from "node:assert/strict";
import test from "node:test";
import { canManage, canRead, validateImport } from "../src/lib/access";
import type { DocumentRecord } from "../src/lib/types";

const document: DocumentRecord = { id: "doc-1", title: "Plan", content: { type: "doc", content: [] }, ownerId: "alex", sharedWith: ["jordan"], createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
test("owners can read and manage their documents", () => { assert.equal(canRead(document, "alex"), true); assert.equal(canManage(document, "alex"), true); });
test("shared users can read but cannot manage documents", () => { assert.equal(canRead(document, "jordan"), true); assert.equal(canManage(document, "jordan"), false); });
test("unshared users cannot read documents", () => { assert.equal(canRead({ ...document, sharedWith: [] }, "jordan"), false); });
test("file import validation permits safe text files and rejects invalid input", () => { assert.equal(validateImport("notes.md", 42), null); assert.match(validateImport("resume.pdf", 42) ?? "", /Only/); assert.match(validateImport("large.txt", 500_001) ?? "", /500 KB/); assert.match(validateImport("empty.txt", 0) ?? "", /empty/); });
