import { refreshUserAction } from "@/actions/auth";
import ProfileCard from "./ProfileCard";
import { Suspense } from "react";
import Loading from "./loading";

export default async function ProfilePage() {
  const user = await refreshUserAction();
  return (
    <main className="p-6 max-w-full">
      <Suspense fallback={<Loading />}>
        <ProfileCard user={user} />
      </Suspense>
    </main>
  );
}
