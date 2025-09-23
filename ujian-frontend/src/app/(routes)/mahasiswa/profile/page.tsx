import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cookies } from "next/headers";

export default function ProfilePage() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;

  if (!user) {
    return <p>Belum login</p>;
  }

  return (
    <div className="p-6 max-w-full">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {/* Avatar & Info */}
      <div className="flex items-center mb-6 space-x-4 border p-4 rounded-lg">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.nama} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="text-sm font-medium">{user.nama}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="border p-4 rounded-lg font-medium space-y-6">
        <h2 className="text-lg font-semibold">Personal Information</h2>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-1 text-neutral-400">NIM</p>
            <p className="text-neutral-600">{user.nip_nim}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1 text-neutral-400">Email</p>
            <p className="text-neutral-600">{user.email}</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-1 text-neutral-400">
              No. Handphone
            </p>
            <p className="text-neutral-600">085788141307</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1 text-neutral-400">Alamat</p>
            <p className="text-neutral-600">Jln. Raya No. 123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
