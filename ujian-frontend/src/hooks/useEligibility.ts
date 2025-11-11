import { Ujian } from "@/types/Ujian";
import { User } from "@/types/Auth";

export function useEligibility(user: User | null, ujian: Ujian[]) {
  const ipk = user?.ipk ?? 0;
  const semester = user?.semester ?? 0;

  const ujianProposal = ujian.find(
    (u) =>
      u.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") &&
      u.mahasiswa?.id === user?.id
  );
  const ujianHasil = ujian.find(
    (u) =>
      u.jenisUjian?.namaJenis?.toLowerCase().includes("hasil") &&
      u.mahasiswa?.id === user?.id
  );

  const lulusProposal = ujianProposal?.hasil === "lulus";
  const lulusHasil = ujianHasil?.hasil === "lulus";

  function canDaftarProposal() {
    return ipk >= 2 && semester >= 6;
  }

  function canDaftarHasil() {
    return canDaftarProposal() && lulusProposal;
  }

  function canDaftarSkripsi() {
    return canDaftarHasil() && lulusHasil;
  }

  return {
    ipk,
    semester,
    lulusProposal,
    lulusHasil,
    canDaftarProposal,
    canDaftarHasil,
    canDaftarSkripsi,
  };
}
