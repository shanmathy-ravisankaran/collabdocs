import { cookies } from "next/headers";
import { DEMO_USERS, type UserId } from "./types";

export const SESSION_COOKIE = "collabdocs_demo_user";

export async function currentUserId(): Promise<UserId> {
  const candidate = (await cookies()).get(SESSION_COOKIE)?.value;
  return DEMO_USERS.some((user) => user.id === candidate) ? (candidate as UserId) : "alex";
}
