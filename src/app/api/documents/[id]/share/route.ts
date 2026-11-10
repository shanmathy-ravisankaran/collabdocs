import { canManage } from "@/lib/access";
import { currentUserId } from "@/lib/auth";
import { getDocument, updateDocument } from "@/lib/store";
import { DEMO_USERS, type UserId } from "@/lib/types";

export async function POST(request: Request, context: RouteContext<"/api/documents/[id]/share">) {
  const document = await getDocument((await context.params).id); const userId = await currentUserId();
  if (!document || !canManage(document, userId)) return Response.json({ error: "Only the owner can share this document." }, { status: 403 });
  const { userId: recipient } = await request.json().catch(() => ({}));
  if (!DEMO_USERS.some((user) => user.id === recipient) || recipient === userId) return Response.json({ error: "Select the other demo user." }, { status: 400 });
  if (!document.sharedWith.includes(recipient)) document.sharedWith.push(recipient as UserId);
  return Response.json(await updateDocument(document));
}
export async function DELETE(request: Request, context: RouteContext<"/api/documents/[id]/share">) {
  const document = await getDocument((await context.params).id); const userId = await currentUserId();
  if (!document || !canManage(document, userId)) return Response.json({ error: "Only the owner can revoke sharing." }, { status: 403 });
  const { userId: recipient } = await request.json().catch(() => ({}));
  document.sharedWith = document.sharedWith.filter((id) => id !== recipient);
  return Response.json(await updateDocument(document));
}
