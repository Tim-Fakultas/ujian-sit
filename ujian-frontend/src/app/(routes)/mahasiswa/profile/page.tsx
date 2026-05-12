import { getCurrentUserAction } from "@/actions/auth";
import ProfileCard from "./ProfileCard";
import { Suspense } from "react";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user } = await getCurrentUserAction();
  
  return (
    <main className="p-4 sm:p-6 max-w-full">
      <Suspense fallback={<Loading />}>
        <ProfileCard user={user} />
      </Suspense>
    </main>
  );
}
