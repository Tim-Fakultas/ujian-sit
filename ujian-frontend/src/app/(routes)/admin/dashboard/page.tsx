import { getCurrentUserAction } from "@/actions/loginAction";

export default async function AdminDashboardPage() {
  const { user } = await getCurrentUserAction();
  return (
    <div className=" p-6 flex flex-col min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-2 text-primary">
        Welcome, {user?.nama ? `, ${user.nama}` : ""}!
      </h1>
      <p className="text-gray-600 text-sm ">
        Anda berada di halaman dashboard admin.
      </p>
    </div>
  );
}
