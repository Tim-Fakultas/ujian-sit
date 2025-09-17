import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

export default function ProfileViewPage() {
  return (
    <div className="container mx-auto py-8 px-6 ">
      <h1 className="text-2xl font-bold mb-6">Profile Mahasiswa</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="/placeholder-avatar.jpg"
                alt="Profile picture"
              />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Nama Mahasiswa</h2>
              <p className="text-sm text-muted-foreground">NIM: 123456789</p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Program Studi</Label>
                <p className="text-sm">Teknik Informatika</p>
              </div>

              <div className="space-y-2">
                <Label>Fakultas</Label>
                <p className="text-sm">Fakultas Teknik</p>
              </div>

              <div className="space-y-2">
                <Label>Angkatan</Label>
                <p className="text-sm">2020</p>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm">mahasiswa@example.com</p>
              </div>

              <div className="space-y-2">
                <Label>Alamat</Label>
                <p className="text-sm">Jl. Contoh No. 123, Kota, Provinsi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Info Card */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Informasi Akademik</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>IPK</Label>
                <p className="text-sm">3.75</p>
              </div>

              <div className="space-y-2">
                <Label>Total SKS</Label>
                <p className="text-sm">110</p>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <p className="text-sm">6</p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <p className="text-sm">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
