"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import { Loader2, User, BookOpen, GraduationCap, MapPin, Phone } from "lucide-react";

interface StudentDetailModalProps {
    mahasiswaId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

// Define specific type based on expected API response or use any if uncertain
interface MahasiswaDetail {
    id: number;
    nama: string;
    nim: string;
    prodi: {
        nama: string;
    };
    semester: number;
    angkatan: string;
    ipk: number;
    noHp: string;
    alamat: string;
    status: string;
    dosenPa?: {
        nama: string;
    };
}

export default function StudentDetailModal({
    mahasiswaId,
    isOpen,
    onClose,
}: StudentDetailModalProps) {
    const [data, setData] = useState<MahasiswaDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && mahasiswaId) {
            setLoading(true);
            getMahasiswaById(mahasiswaId)
                .then((res: any) => {
                    // API returns { data: ... } or just the object? 
                    // Based on getAllMahasiswa it returns data.data. 
                    // getMahasiswaById returns res.json(). 
                    // Let's assume standard response wrapper or direct object.
                    // Usually it's response.data if formatted consistently.
                    // Checking getMahasiswaById in previous turn, it returns `await response.json()`.
                    // If the backend returns { data: ... }, then we need res.data.
                    // I'll assume res.data based on typical pattern here.
                    setData(res.data || res);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setData(null);
        }
    }, [isOpen, mahasiswaId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detail Mahasiswa</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : data ? (
                    <div className="space-y-6 py-2">

                        {/* Header / Avatar Section */}
                        <div className="flex flex-col items-center gap-3 text-center pb-4 border-b">
                            <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <User size={40} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{data.nama}</h3>
                                <p className="text-sm text-gray-500 font-mono">{data.nim}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase border ${data.status === 'Aktif' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}>
                                {data.status || 'Status Tidak Diketahui'}
                            </span>
                        </div>

                        {/* Grid Details */}
                        <div className="grid gap-4">

                            <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                <GraduationCap size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Program Studi</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.prodi?.nama || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                <User size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Dosen Pembimbing Akademik</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.dosenPa?.nama || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <BookOpen size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Semester</p>
                                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.semester || "-"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Angkatan</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.angkatan || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">IPK</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.ipk || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                <Phone size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">No. Handphone</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.noHp || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                <MapPin size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Alamat</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.alamat || "-"}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                        Data tidak ditemukan
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
