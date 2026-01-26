"use client";

import { useEffect, useState } from "react";
import { getAllSyarat } from "@/actions/syarat";
import { Syarat } from "@/types/Syarat";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function SyaratUjianTable() {
    const [syaratList, setSyaratList] = useState<Syarat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSyarat();
                setSyaratList(data);
            } catch (error) {
                console.error("Failed to fetch syarat", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to filter by Exam Type
    // Note: Backend names are 'Ujian Proposal', 'Ujian Hasil', 'Ujian Skripsi'
    // Map to Tabs: 'proposal', 'hasil', 'skripsi'
    const getSyaratByJenis = (keyword: string) => {
        return syaratList.filter(s =>
            s.jenisUjian.namaJenis.toLowerCase().includes(keyword.toLowerCase())
        );
    };

    const renderTable = (items: Syarat[]) => {
        if (items.length === 0) {
            return <div className="p-8 text-center text-muted-foreground">Tidak ada data persyaratan.</div>;
        }

        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No</TableHead>
                            <TableHead>Persyaratan</TableHead>
                            <TableHead className="w-[150px]">Kategori</TableHead>
                            <TableHead className="w-[100px] text-center">Wajib</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 mt-1 text-blue-500 shrink-0" />
                                        <span>{item.namaSyarat}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {item.kategori}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.wajib ? (
                                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-yellow-500 mx-auto" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    if (loading) {
        return <div className="p-8 text-center">Memuat persyaratan...</div>;
    }

    const proposalItems = getSyaratByJenis('proposal');
    const hasilItems = getSyaratByJenis('hasil');
    const skripsiItems = getSyaratByJenis('skripsi');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Persyaratan Ujian</CardTitle>
                <CardDescription>Daftar kelengkapan berkas dan persyaratan untuk setiap tahapan ujian.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="proposal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="proposal">Seminar Proposal</TabsTrigger>
                        <TabsTrigger value="hasil">Ujian Hasil</TabsTrigger>
                        <TabsTrigger value="skripsi">Ujian Skripsi</TabsTrigger>
                    </TabsList>

                    <TabsContent value="proposal" className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                            <AlertCircle className="h-4 w-4" />
                            <p>Pastikan semua berkas persyaratan proposal telah lengkap sebelum mendaftar.</p>
                        </div>
                        {renderTable(proposalItems)}
                    </TabsContent>

                    <TabsContent value="hasil" className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 text-orange-700 rounded-lg text-sm border border-orange-100">
                            <AlertCircle className="h-4 w-4" />
                            <p>Ujian hasil dapat didaftarkan setelah menyelesaikan seminar proposal dan revisi.</p>
                        </div>
                        {renderTable(hasilItems)}
                    </TabsContent>

                    <TabsContent value="skripsi" className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
                            <AlertCircle className="h-4 w-4" />
                            <p>Tahap akhir sidang skripsi / munaqosyah. Pastikan jurnal sudah submit.</p>
                        </div>
                        {renderTable(skripsiItems)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
