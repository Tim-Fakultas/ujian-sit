"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  GraduationCap,
  Edit,
  Save,
  X,
  Crown,
} from "lucide-react";

interface KaprodiProfile {
  id: number;
  nip: string;
  nama: string;
  noHp: string;
  alamat: string;
  prodi: {
    id: number;
    nama: string;
  };
  fakultas?: string;
  jabatan: string;
}

export default function KaprodiProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<KaprodiProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<KaprodiProfile>>({});

  useEffect(() => {
    // Initialize from auth store
    if (user) {
      // Mock data based on user info from auth store
      const mockProfile: KaprodiProfile = {
        id: user.id,
        nip: user.nip_nim, // Assuming nip_nim contains NIP for kaprodi
        nama: user.nama,
        noHp: "081234567890", // This would come from API
        alamat: "Jl. Contoh Alamat No. 123, Kota Malang", // This would come from API
        prodi: {
          id: 1,
          nama: "Teknik Informatika", // This would come from API
        },
        fakultas: "Fakultas Teknologi Informasi", // This would come from API
        jabatan: "Kepala Program Studi",
      };
      setProfile(mockProfile);
      setEditData(mockProfile);
    }
    setLoading(false);
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile || {});
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      // Here you would make an API call to update the profile
      // await updateKaprodiProfile(editData);

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setProfile({ ...profile, ...editData });
      setIsEditing(false);

      // You could also show a success toast here
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      // You could show an error toast here
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof KaprodiProfile, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Failed to load profile data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Kaprodi
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola informasi personal dan akademik Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={handleEdit} className="rounded">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded"
                >
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{profile.nama}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>NIP: {profile.nip}</span>
                  <Badge variant="default" className="rounded bg-purple-600">
                    {profile.jabatan}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    NIP
                  </label>
                  <Input
                    value={isEditing ? editData.nip || "" : profile.nip}
                    onChange={(e) => handleInputChange("nip", e.target.value)}
                    readOnly={!isEditing}
                    className="mt-1 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </label>
                  <Input
                    value={isEditing ? editData.nama || "" : profile.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    readOnly={!isEditing}
                    className="mt-1 rounded"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informasi Kontak
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nomor HP
                  </label>
                  <Input
                    value={isEditing ? editData.noHp || "" : profile.noHp}
                    onChange={(e) => handleInputChange("noHp", e.target.value)}
                    readOnly={!isEditing}
                    className="mt-1 rounded"
                    placeholder="Nomor HP"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Alamat
                  </label>
                  <Textarea
                    value={isEditing ? editData.alamat || "" : profile.alamat}
                    onChange={(e) =>
                      handleInputChange("alamat", e.target.value)
                    }
                    readOnly={!isEditing}
                    className="mt-1 rounded"
                    rows={3}
                    placeholder="Alamat lengkap"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Informasi Akademik
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Program Studi
                  </label>
                  <Input
                    value={profile.prodi.nama}
                    readOnly
                    className="mt-1 rounded bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Fakultas
                  </label>
                  <Input
                    value={profile.fakultas || "Fakultas Teknologi Informasi"}
                    readOnly
                    className="mt-1 rounded bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Jabatan
                  </label>
                  <Input
                    value={profile.jabatan}
                    readOnly
                    className="mt-1 rounded bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Role Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Peran Aktif</h3>
              <div className="flex flex-wrap gap-2">
                {user?.roles.map((role) => (
                  <Badge key={role.id} variant="secondary" className="rounded">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Pendidikan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>S3 - Ilmu Komputer (2018)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>S2 - Teknik Informatika (2015)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>S1 - Teknik Informatika (2013)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sertifikasi & Keahlian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Sertifikat Dosen Profesional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Project Management Professional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Machine Learning Specialist</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Certified Academic Leader</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
