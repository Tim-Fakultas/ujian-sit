import { User } from "@/types/Auth";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileCard({ user }: { user: User | null }) {
  return (
    <Card className="w-full max-w-2xl p-6 border border-blue-500/10 rounded-xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm text-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar className="h-24 w-24 shadow">
          <AvatarFallback className="text-2xl">
            {user?.nama
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="w-full mt-2">
          <div className="text-xl font-semibold text-primary leading-tight">
            {user?.nama}
          </div>
          <div className="text-muted-foreground text-sm">{user?.nim}</div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="text-sm bg-muted px-2 py-1 rounded">
              Angkatan: {user?.angkatan ?? "-"}
            </span>
            <span className="text-sm bg-muted px-2 py-1 rounded">
              Semester: {user?.semester ?? "-"}
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Status:{" "}
            <span className="font-semibold text-primary">
              {user?.status || "-"}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <div className="text-base font-semibold text-primary">
                {user?.ipk ?? "-"}
              </div>
              <div className="text-xs text-muted-foreground">IPK</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-base font-semibold">
                {user?.semester ?? "-"}
              </div>
              <div className="text-xs text-muted-foreground">Semester</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-base font-semibold">
                {user?.angkatan ?? "-"}
              </div>
              <div className="text-xs text-muted-foreground">Angkatan</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-base font-semibold">
                {user?.peminatan?.nama_peminatan || "Sistem Informasi"}
              </div>
              <div className="text-xs text-muted-foreground">Peminatan</div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-muted my-5" />
      <div>
        <div className="font-semibold text-lg mb-3 text-primary">Details</div>
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
            <div className="text-muted-foreground font-medium">Alamat</div>
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
    </Card>
  );
}
