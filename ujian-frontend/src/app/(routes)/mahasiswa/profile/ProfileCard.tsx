import { User } from "@/types/Auth";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileCard({ user }: { user: User | null }) {
  return (
    <div className="w-full flex flex-col items-center">
      <Card className="w-full max-w-4xl p-8 border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col items-center md:items-start gap-4 min-w-[180px]">
            <Avatar className="h-28 w-28 shadow-lg border-4 border-gray-200 dark:border-neutral-700">
              <AvatarFallback className="text-3xl bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                {user?.nama
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-black dark:text-white leading-tight">
                {user?.nama}
              </div>
              <div className="text-muted-foreground text-base">{user?.nim}</div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <span className="text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded">
                  Angkatan: {user?.angkatan ?? "-"}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded">
                  Semester: {user?.semester ?? "-"}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Status:{" "}
                <span className="font-semibold text-black dark:text-white">
                  {user?.status || "-"}
                </span>
              </div>
            </div>
          </div>
          {/* Divider for desktop */}
          <div className="hidden md:block w-px bg-gray-200 dark:bg-neutral-700 h-40 mx-4" />
          {/* Info Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-black dark:text-white">
                  {user?.ipk ?? "-"}
                </div>
                <div className="text-xs text-muted-foreground">IPK</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-black dark:text-white">
                  {user?.semester ?? "-"}
                </div>
                <div className="text-xs text-muted-foreground">Semester</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-black dark:text-white">
                  {user?.angkatan ?? "-"}
                </div>
                <div className="text-xs text-muted-foreground">Angkatan</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-sm font-bold text-black dark:text-white">
                  {user?.peminatan?.nama_peminatan || "Sistem Informasi"}
                </div>
                <div className="text-xs text-muted-foreground">Peminatan</div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-neutral-700 my-6" />
            <div>
              <div className="font-semibold text-lg mb-3 text-black dark:text-white">
                Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm leading-relaxed">
                <div>
                  <div className="text-muted-foreground font-medium">
                    Pembimbing Akademik
                  </div>
                  <div>{user?.dosen_pa?.nama || "-"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-medium">
                    Pembimbing 1
                  </div>
                  <div>{user?.pembimbing1?.nama || "-"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-medium">
                    Pembimbing 2
                  </div>
                  <div>{user?.pembimbing2?.nama || "-"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-medium">
                    Alamat
                  </div>
                  <div>
                    {user?.alamat ||
                      "Jln. Cempaka Dalam No. 15, Bukit Kecil, 26 Ilir, Palembang"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground font-medium">No HP</div>
                  <div>{user?.no_hp || "0857-8814-1307"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
