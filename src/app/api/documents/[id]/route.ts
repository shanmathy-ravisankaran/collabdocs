import { canManage, canRead } from "@/lib/access";
import { currentUserId } from "@/lib/auth";
import { deleteDocument, getDocument, updateDocument } from "@/lib/store";

async function load(id: string) { return getDocument(id); }
export async function GET(_request: Request, context: RouteContext<"/api/documents/[id]">) {
  const document = await load((await context.params).id); const userId = await currentUserId();
  if (!document || !canRead(document, userId)) return Response.json({ error: "Document not found." }, { status: 404 });
  return Response.json({ ...document, access: document.ownerId === userId ? "owner" : "shared" });
}
export async function PATCH(request: Request, context: RouteContext<"/api/documents/[id]">) {
  const document = await load((await context.params).id); const userId = await currentUserId();
  if (!document || !canManage(document, userId)) return Response.json({ error: "Only the owner can edit this document." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.title === "string") { const title = body.title.trim().slice(0, 120); if (!title) return Response.json({ error: "A title is required." }, { status: 400 }); document.title = title; }
  if (body.content && typeof body.content === "object") document.content = body.content;
  return Response.json(await updateDocument(document));
}
export async function DELETE(_request: Request, context: RouteContext<"/api/documents/[id]">) {
  const document = await load((await context.params).id); const userId = await currentUserId();
  if (!document || !canManage(document, userId)) return Response.json({ error: "Only the owner can delete this document." }, { status: 403 });
  await deleteDocument(document.id); return new Response(null, { status: 204 });
}
