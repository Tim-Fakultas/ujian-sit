// src/actions/loginAction.ts
export async function loginAction(formData: FormData) {
  const nip_nim = String(formData.get("nip_nim") || "");
  const password = String(formData.get("password") || "");

  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nip_nim, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || "Login gagal" };
  }

  const normalizedUser = {
    ...data.user,
    roles:
      data.user.roles && data.user.roles.length > 0
        ? data.user.roles
        : data.roles?.map((r: string, index: number) => ({
            id: index + 1,
            name: r,
            guard_name: "web",
          })),
  };

  return {
    success: true,
    user: normalizedUser,
    access_token: data.access_token,
  };
}
