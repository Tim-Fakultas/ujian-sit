import { cookies } from "next/headers";
import { dummyUsers } from "./dummyUsers";

const COOKIE_USER = "auth_user";
const COOKIE_ROLE = "auth_role";

export function authenticate(username: string, password: string) {
  return (
    dummyUsers.find(
      (u) => u.username === username && u.password === password
    ) || null
  );
}

export function createSession(username: string, role: string) {
  const store = cookies();
  store.set(COOKIE_USER, username, { path: "/" });
  store.set(COOKIE_ROLE, role, { path: "/" });
}

export function getSession() {
  const store = cookies();
  const username = store.get(COOKIE_USER)?.value;
  const role = store.get(COOKIE_ROLE)?.value;
  if (!username || !role) return null;
  return { username, role };
}

export function destroySession() {
  const store = cookies();
  store.set(COOKIE_USER, "", { expires: new Date(0) });
  store.set(COOKIE_ROLE, "", { expires: new Date(0) });
}
