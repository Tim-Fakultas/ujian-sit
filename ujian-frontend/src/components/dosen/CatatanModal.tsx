"use client";
import { Ujian } from "@/types/Ujian";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function CatatanModal({
  open,
  onClose,
  ujian,
}: {
  open: boolean;
  onClose: () => void;
  ujian: Ujian;
}) {
  if (!open || !ujian) return null;
  return (
    <Sheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambahkan Catatan</SheetTitle>
          <SheetDescription>
            Tambahkan catatan tambahan untuk ujian ini jika diperlukan.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-2 px-4 ">
          <div className="grid gap-3">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea id="catatan">
              {ujian.catatan ?? "Tidak ada catatan."}
            </Textarea>
          </div>
        </div>
      </SheetContent>
      <SheetFooter>
        <Button variant="ghost">Save</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </Sheet>
  );
}

//   <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg p-6 relative w-full max-w-2xl max-h-[85vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute top-2 right-2"
//           onClick={onClose}
//         >
//           <X size={16} />
//         </Button>

//         <h2 className="text-lg font-bold mb-3 text-left">
//           Form Penilaian Ujian
//         </h2>

//         {/* Identitas */}
//         <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
//           <div>
//             <Label className="mb-2">Nama Mahasiswa</Label>
//             <Input value={ujian.mahasiswa?.nama ?? ""} readOnly />
//           </div>
//           <div>
//             <Label className="mb-2">NIM</Label>
//             <Input value={ujian.mahasiswa?.nim ?? ""} readOnly />
//           </div>
//           <div>
//             <Label className="mb-2">Prodi</Label>
//             <Input value={ujian.mahasiswa?.prodi?.namaProdi ?? ""} readOnly />
//           </div>
//           <div>
//             <Label className="mb-2">Peran Penguji</Label>
//             <Input value={formatPeran(pengujiInfo?.peran)} readOnly />
//           </div>
//         </div>

//         {/* Tabel Penilaian */}
//         <form action={formAction}>
//           <div className="border rounded-md overflow-hidden">
//             <Table className="w-full text-sm ">
//               <TableHeader className="border-b">
//                 <TableRow>
//                   <TableHead>Kriteria</TableHead>
//                   <TableHead>Bobot</TableHead>
//                   <TableHead>Skor</TableHead>
//                   <TableHead>Bobot × Skor</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {komponen.map((k) => (
//                   <TableRow key={k.id}>
//                     <TableCell>{k.namaKomponen}</TableCell>
//                     <TableCell>{k.bobot}</TableCell>
//                     <TableCell>
//                       <Input
//                         type="number"
//                         min={0}
//                         max={100}
//                         // tampilkan empty string jika null (belum diisi)
//                         value={nilai[k.id] ?? ""}
//                         onChange={(e) =>
//                           handleNilaiChange(k.id, e.target.value)
//                         }
//                         className="w-16 text-center"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       {getBobotSkor(k.id, k.bobot).toFixed(2)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <div className="px-4 py-2 border-t text-right text-sm font-semibold bg-gray-50 dark:bg-[#171717]">
//               Total Skor: {totalSkor.toFixed(2)}
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className={`w-full mt-4 bg-blue-500 text-white ${
//               isSudahNilai ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isSudahNilai || !isAllFilled}
//             aria-disabled={isSudahNilai || !isAllFilled}
//             title={
//               isSudahNilai ? "Anda sudah memberikan penilaian." : undefined
//             }
//           >
//             Simpan Penilaian
//           </Button>

//           {isSudahNilai && (
//             <p className="text-xs text-red-600 mt-2 text-center">
//               Anda sudah memberikan penilaian.
//             </p>
//           )}

//           {!isAllFilled && (
//             <p className="text-xs text-orange-600 mt-2 text-center">
//               Harap isi semua skor sebelum menyimpan.
//             </p>
//           )}

//           {state.error && (
//             <p className="text-red-600 text-sm mt-2 text-center">
//               {state.error}
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
