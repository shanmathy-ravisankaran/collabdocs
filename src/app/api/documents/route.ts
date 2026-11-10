import { currentUserId } from "@/lib/auth";
import { createDocument, listDocuments } from "@/lib/store";

export async function GET() { return Response.json(await listDocuments(await currentUserId())); }

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "Untitled document";
  if (!title) return Response.json({ error: "A document title is required." }, { status: 400 });
  const document = await createDocument(await currentUserId(), title, body.content && typeof body.content === "object" ? body.content : undefined);
  return Response.json(document, { status: 201 });
}
