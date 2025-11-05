import { getCurrentUserAction } from "@/actions/loginAction";

export default async function DashboardMahasiswa() {
  const { user } = await getCurrentUserAction();
  return (
    <div className="p-6">
      <h1 className="font-semibold text-neutral-400">Welcome, <br /> {user?.nama} !</h1>
    </div>
  );
}
