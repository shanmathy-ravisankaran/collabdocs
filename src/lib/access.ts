import type { DocumentRecord, UserId } from "./types";

export function canRead(document: DocumentRecord, userId: UserId) {
  return document.ownerId === userId || document.sharedWith.includes(userId);
}

export function canManage(document: DocumentRecord, userId: UserId) {
  return document.ownerId === userId;
}

export function validateImport(fileName: string, size: number) {
  const validExtension = /\.(txt|md)$/i.test(fileName);
  if (!validExtension) return "Only .txt and .md files can be imported.";
  if (size === 0) return "The selected file is empty.";
  if (size > 500_000) return "Files must be 500 KB or smaller.";
  return null;
}
