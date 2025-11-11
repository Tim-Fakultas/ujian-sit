import { User } from "@/types/Auth";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileCard({ user }: { user: User | null }) {
  return (
    <Card className="w-full max-w-full mx-auto p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-32 w-32">
            <AvatarFallback className="text-3xl">
              {user?.nama
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        {/* Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-2xl font-bold">{user?.nama}</div>
              <div className="text-muted-foreground text-sm">{user?.nim}</div>
              <div className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded w-fit">
                {user?.peminatan?.nama_peminatan || "-"}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Status:{" "}
                <span className="font-semibold text-primary">
                  {user?.status || "-"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {/* Tombol aksi jika perlu */}
            </div>
          </div>
          {/* Statistik */}
          <div className="flex gap-8 mt-6">
            <div>
              <div className="text-lg font-semibold">{user?.ipk ?? "-"}</div>
              <div className="text-xs text-muted-foreground">IPK</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {user?.semester ?? "-"}
              </div>
              <div className="text-xs text-muted-foreground">Semester</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {user?.angkatan ?? "-"}
              </div>
              <div className="text-xs text-muted-foreground">Angkatan</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {user?.peminatan?.nama_peminatan || "-"}
              </div>
              <div className="text-xs text-muted-foreground">Peminatan</div>
            </div>
          </div>
          {/* Info lain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-6 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                Alamat:{" "}
              </span>
              {user?.alamat || "-"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">No HP: </span>
              {user?.no_hp || "-"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Dosen PA:{" "}
              </span>
              {user?.dosen_pa?.nama || "-"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Pembimbing 1:{" "}
              </span>
              {user?.pembimbing1?.nama || "-"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Pembimbing 2:{" "}
              </span>
              {user?.pembimbing2?.nama || "-"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Status:{" "}
              </span>
              {user?.status || "-"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Angkatan:{" "}
              </span>
              {user?.angkatan || "-"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Peminatan:{" "}
              </span>
              {user?.peminatan?.nama_peminatan || "-"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
