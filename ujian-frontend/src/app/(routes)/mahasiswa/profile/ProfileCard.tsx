import { User } from "@/types/Auth";

export default function ProfileCard({ user }: { user: User | null }) {
  return (
    <div>
      <p>NIM: {user?.nim}</p>
      <p>Nama: {user?.nama}</p>
      <p>IPK: {user?.ipk}</p>
      <p>Semester: {user?.semester}</p>
      <p>Alamat: {user?.alamat || "-"}</p>
      <p>Angkatan: {user?.angkatan}</p>
      <p>Peminatan: {user?.peminatan?.nama_peminatan || "-"}</p>
      <p>No HP: {user?.no_hp || "-"}</p>
    </div>
  );
}
