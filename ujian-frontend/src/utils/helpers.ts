export function resolveDosenId(p: any): string {
  if (!p) return "";
  // paling ideal: p.dosenId
  if (p.dosenId != null) return String(p.dosenId);
  // kadang backend return { dosen: { id } }
  if (p.dosen?.id != null) return String(p.dosen.id);
  // fallback terakhir: p.id (HATI-HATI, ini bisa id pivot)
  if (p.id != null) return String(p.id);
  return "";
}