import { cookies } from "next/headers";
import { dummyUsers } from "./dummyUsers";

export function authenticate(username: string, password: string) {
  return (
    dummyUsers.find(
      (u) => u.username === username && u.password === password
    ) || null
  );
}

export async function createSession(username: string, role: string) {
  const store = cookies();
  (await store).set("auth_user", username, { path: "/" });
  (await store).set("auth_role", role, { path: "/" });
}

export async function getSession() {
  const store = cookies();
  const username = (await store).get("auth_user")?.value;
  const role = (await store).get("auth_role")?.value;
  if (!username || !role) return null;
  return { username, role };
}

export async function destroySession() {
  const store = cookies();
  (await store).set("auth_user", "", { expires: new Date(0) });
  (await store).set("auth_role", "", { expires: new Date(0) });
}
