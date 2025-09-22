export const dummyUsers = [
  { username: "mahasiswa1", password: "123", role: "mahasiswa" },
  { username: "dosen1", password: "123", role: "dosen" },
  { username: "admin1", password: "123", role: "admin" },
] as const;

export type UserRole = "mahasiswa" | "dosen" | "admin";
