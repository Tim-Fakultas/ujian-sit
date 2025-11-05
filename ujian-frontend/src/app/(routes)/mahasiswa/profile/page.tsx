import { getCurrentUserAction } from "@/actions/loginAction";
import ProfileCard from "./ProfileCard";

export default async function ProfilePage() {
  const { user } = await getCurrentUserAction();
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Profil Mahasiswa
        </h1>
      </header>

      <ProfileCard user={user} />
    </main>
  );
}
