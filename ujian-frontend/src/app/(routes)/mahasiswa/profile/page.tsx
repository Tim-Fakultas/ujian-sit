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
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-8 text-[#2C5282]">Profile Mahasiswa</h1>

      {/* User Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.nama} />
            <AvatarFallback className="text-xl font-semibold bg-[#2C5282] text-white">
              {user.nama?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{user.nama}</h2>
            <p className="text-lg text-[#2C5282] font-semibold">{user.nip_nim}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
          <div className="w-1 h-6 bg-[#2C5282] rounded-full mr-3"></div>
          <h3 className="text-xl font-bold text-[#2C5282]">Informasi Personal</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#2C5282] uppercase tracking-wide">NIM</p>
            <p className="text-gray-700 font-medium">{user.nip_nim}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#2C5282] uppercase tracking-wide">Nama Lengkap</p>
            <p className="text-gray-700 font-medium">{user.nama}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#2C5282] uppercase tracking-wide">No. Handphone</p>
            <p className="text-gray-700 font-medium">085788141307</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#2C5282] uppercase tracking-wide">Alamat</p>
            <p className="text-gray-700 font-medium">Jln. Raya No. 123</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#2C5282] uppercase tracking-wide">Semester</p>
            <p className="text-gray-700 font-medium">6</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#2C5282] uppercase tracking-wide">Total SKS</p>
            <p className="text-gray-700 font-medium">120</p>
          </div>
          
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold text-[#2C5282] uppercase tracking-wide">IPK</p>
            <p className="text-gray-700 font-medium text-lg">3.75</p>
          </div>
        </div>
      </div>
    </div>
  );
}
