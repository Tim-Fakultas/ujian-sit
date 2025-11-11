import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BeritaUjian } from "@/types/BeritaUjian";

export function BeritaAcaraModal({
  open,
  onClose,
  ujian,
  jenisUjian, // "proposal" | "hasil" | "skripsi"
}: {
  open: boolean;
  onClose: () => void;
  ujian: BeritaUjian;
  jenisUjian: "ujian proposal" | "ujian hasil" | "ujian skripsi";
}) {
  if (!open) return null;

  // Helper untuk judul dan keputusan
  const getHeaderText = () => {
    if (jenisUjian === "ujian proposal") {
      return (
        <>
          Pada hari ini,{" "}
          <span className="underline">{ujian.hariUjian ?? "-"}</span>, tanggal{" "}
          <span className="underline">{ujian.jadwalUjian ?? "-"}</span> telah
          dilaksanakan ujian seminar proposal skripsi:
        </>
      );
    }
    if (jenisUjian === "ujian hasil") {
      return (
        <>
          Pada hari ini,{" "}
          <span className="underline">{ujian.hariUjian ?? "-"}</span>, tanggal{" "}
          <span className="underline">{ujian.jadwalUjian ?? "-"}</span> telah
          dilaksanakan ujian hasil skripsi:
        </>
      );
    }
    // skripsi
    return (
      <>
        Pada hari ini,{" "}
        <span className="underline">{ujian.hariUjian ?? "-"}</span>, tanggal{" "}
        <span className="underline">{ujian.jadwalUjian ?? "-"}</span> telah
        dilaksanakan ujian skripsi:
      </>
    );
  };

  const getJudulLabel = () => {
    if (jenisUjian === "ujian proposal") return "Judul";
    return "Judul Skripsi";
  };

  const getKeputusan = () => {
    if (jenisUjian === "ujian proposal") {
      return (
        <div className="mt-6 font-semibold">
          MEMUTUSKAN: Proposal saudara dinyatakan DITERIMA / DITOLAK dengan
          catatan terlampir.
        </div>
      );
    }
    // hasil & skripsi
    return (
      <>
        <div className="mt-6 font-semibold">
          MEMUTUSKAN: Skripsi yang bersangkutan:
        </div>
        <div className="mt-2 space-y-1">
          <div>
            <input
              type="checkbox"
              checked={ujian.hasil === "tanpa_perbaikan"}
              readOnly
              className="mr-2"
            />
            Dapat diterima tanpa perbaikan
          </div>
          <div>
            <input
              type="checkbox"
              checked={ujian.hasil === "perbaikan_kecil"}
              readOnly
              className="mr-2"
            />
            Dapat diterima dengan perbaikan kecil
          </div>
          <div>
            <input
              type="checkbox"
              checked={ujian.hasil === "perbaikan_besar"}
              readOnly
              className="mr-2"
            />
            Dapat diterima dengan perbaikan besar
          </div>
          <div>
            <input
              type="checkbox"
              checked={ujian.hasil === "belum_diterima"}
              readOnly
              className="mr-2"
            />
            Belum dapat diterima
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow-lg p-8 max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          &times;
        </Button>
        <div className="mb-4">
          <div>{getHeaderText()}</div>
          <div className="grid grid-cols-3 gap-y-1 mt-4">
            <div>Nama</div>
            <div>:</div>
            <div>{ujian.mahasiswa?.nama ?? "-"}</div>
            <div>NIM</div>
            <div>:</div>
            <div>{ujian.mahasiswa?.nim ?? "-"}</div>
            <div>Program Studi</div>
            <div>:</div>
            <div>{ujian.mahasiswa?.prodi?.namaProdi ?? "-"}</div>
            <div>{getJudulLabel()}</div>
            <div>:</div>
            <div className="break-words">{ujian.judulPenelitian ?? "-"}</div>
            {jenisUjian === "ujian proposal" && (
              <>
                <div>Proposal</div>
                <div></div>
                <div></div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 mb-2 font-semibold">Tim Penguji:</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Tanda Tangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1.</TableCell>
              <TableCell>{ujian.ketuaPenguji?.nama ?? "-"}</TableCell>
              <TableCell>Ketua Penguji</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2.</TableCell>
              <TableCell>{ujian.sekretarisPenguji?.nama ?? "-"}</TableCell>
              <TableCell>Sekretaris Penguji</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3.</TableCell>
              <TableCell>{ujian.penguji1?.nama ?? "-"}</TableCell>
              <TableCell>Penguji I</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4.</TableCell>
              <TableCell>{ujian.penguji2?.nama ?? "-"}</TableCell>
              <TableCell>Penguji II</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {getKeputusan()}
      </div>
    </div>
  );
}
