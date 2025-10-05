import { cookies } from "next/headers";

// Fungsi utama membaca cookie auth (real backend + dummy fallback)
export function getAuthFromCookies() {
  const cookieStore = cookies();

  // Cookie dari backend Laravel (token + user JSON)
  const token = cookieStore.get("token")?.value || null;
  const userCookie = cookieStore.get("user")?.value;

  // Cookie dummy untuk testing offline
  const dummyUser = cookieStore.get("auth_user")?.value;
  const dummyRole = cookieStore.get("auth_role")?.value;

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (error) {
      console.error("Invalid user cookie", error);
    }
  } else if (dummyUser && dummyRole) {
    // Fallback dummy user
    user = {
      id: 999,
      nip_nim: "000000",
      nama: dummyUser,
      email: `${dummyUser}@example.com`,
      roles: [{ id: 1, name: dummyRole, guard_name: "web", created_at: "", updated_at: "" }],
    };
  }

  return { token, user };
}
