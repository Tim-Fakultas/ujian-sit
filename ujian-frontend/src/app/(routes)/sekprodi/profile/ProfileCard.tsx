import { User } from "@/types/Auth";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileCard({ user }: { user: User | null }) {
  return (
    <Card className="w-full p-8 border-none rounded-lg text-sm">
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
          <div className="text-muted-foreground text-sm mb-2">
            NIP/NIM: {user?.nip_nim}
          </div>
          <div className="text-muted-foreground text-sm mb-2">
            Email: {user?.email}
          </div>
          <div className="text-muted-foreground text-sm">
            Program Studi: {user?.prodi?.nama_prodi}
          </div>
        </div>
      </div>
    </Card>
  );
}
