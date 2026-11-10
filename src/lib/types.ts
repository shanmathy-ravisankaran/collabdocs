export const DEMO_USERS = [
  { id: "alex", name: "Alex Morgan", email: "alex@collabdocs.demo", initials: "AM" },
  { id: "jordan", name: "Jordan Lee", email: "jordan@collabdocs.demo", initials: "JL" },
] as const;

export type UserId = (typeof DEMO_USERS)[number]["id"];

export type DocumentRecord = {
  id: string;
  title: string;
  content: Record<string, unknown>;
  ownerId: UserId;
  sharedWith: UserId[];
  createdAt: string;
  updatedAt: string;
};

export type DocumentSummary = Pick<DocumentRecord, "id" | "title" | "ownerId" | "updatedAt"> & {
  access: "owner" | "shared";
};
