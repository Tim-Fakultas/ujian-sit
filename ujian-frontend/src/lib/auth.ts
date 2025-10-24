import { cookies } from "next/headers";

export async function getAuthFromCookies() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const tokenCookie = cookieStore.get("token")?.value;

  if (!userCookie || !tokenCookie) {
    return { user: null, token: null };
  }

  try {
    const user = JSON.parse(userCookie);
    return { user, token: tokenCookie };
  } catch {
    return { user: null, token: null };
  }
}
