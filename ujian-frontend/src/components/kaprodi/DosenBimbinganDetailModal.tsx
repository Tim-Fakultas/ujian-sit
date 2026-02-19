import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  BookOpen,
  AlertCircle,
  Filter,
  X,
  Check,
  FileText,
  Phone,
  MapPin,
  Mail,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AngkatanFilter from "@/components/common/AngkatanFilter";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import DetailModal from "@/components/common/DetailModal";

interface StudentBimbingan {
  id: number;
  nama: string;
  nim: string;
  status: string;
  prodi: string;
  judul: string;
  angkatan: string;
}

interface DosenBimbinganDetail {
  dosen: {
    id: number;
    nama: string;
    nip: string;
  };
  pembimbing1: StudentBimbingan[];
  pembimbing2: StudentBimbingan[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: DosenBimbinganDetail | null;
  loading: boolean;
}

export default function DosenBimbinganDetailModal({
  isOpen,
  onClose,
  data,
  loading,
}: Props) {
  const [selectedAngkatan, setSelectedAngkatan] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "lulus" | "belum">(
    "all",
  );

  // Student Detail Modal State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isStudentDetailLoading, setIsStudentDetailLoading] = useState(false);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);

  // Filter logic
  const filterStudents = (students: StudentBimbingan[]) => {
    return students.filter((s) => {
      const matchesAngkatan =
        selectedAngkatan.length === 0 || selectedAngkatan.includes(s.angkatan);

      let matchesStatus = true;
      if (filterStatus === "lulus") {
        matchesStatus = ["lulus", "selesai", "wisuda"].includes(
          s.status.toLowerCase(),
        );
      } else if (filterStatus === "belum") {
        matchesStatus = !["lulus", "selesai", "wisuda"].includes(
          s.status.toLowerCase(),
        );
      }

      return matchesAngkatan && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-700 border-gray-200";
    const s = status.toLowerCase();
    if (s === "lulus" || s === "selesai" || s === "wisuda")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "aktif" || s === "sedang bimbingan")
      return "bg-primary/5 text-primary border-primary/20";
    if (s === "tidak aktif" || s === "cuti")
      return "bg-gray-100 text-gray-700 border-gray-200";
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const handleStudentClick = async (studentId: number) => {
    setIsStudentDetailLoading(true);
    setIsStudentDetailOpen(true);
    try {
      const res = await getMahasiswaById(studentId);
      if (res && res.data) {
        setSelectedStudent(res.data);
      } else {
        // Fallback if fetch fails or no data, use basic info if possible or show error
        // For now, assume fetch works or handle gracefully
        console.error("No data found for student");
      }
    } catch (error) {
      console.error("Error fetching student detail:", error);
    } finally {
      setIsStudentDetailLoading(false);
    }
  };

  const closeStudentDetail = () => {
    setIsStudentDetailOpen(false);
    setSelectedStudent(null);
  };

  const StudentList = ({ students }: { students: StudentBimbingan[] }) => {
    const filtered = filterStudents(students);

    if (!filtered || filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-gray-50/50 rounded-lg border border-dashed">
          <BookOpen className="h-10 w-10 mb-2 opacity-20" />
          <p className="text-sm">
            {selectedAngkatan.length > 0 || filterStatus !== "all"
              ? "Tidak ada data mahasiswa dengan filter yang dipilih"
              : "Tidak ada mahasiswa bimbingan"}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {filtered.map((student) => (
          <div
            key={student.id}
            className="group p-4 border rounded-xl hover:shadow-md transition-all bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/5 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <span className="font-bold text-sm">
                    {student.nama.charAt(0)}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handleStudentClick(student.id)}
                    className="text-left font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors hover:underline focus:outline-none"
                  >
                    {student.nama}
                  </button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                      {student.nim}
                    </span>
                    {student.angkatan && (
                      <span className="bg-gray-50 border px-1.5 py-0.5 rounded text-[10px]">
                        Angkatan {student.angkatan}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    <span className="font-medium text-gray-500 mr-1">
                      Judul:
                    </span>
                    {student.judul}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 ${getStatusColor(student.status)}`}
              >
                {student.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
        <div
          className="bg-white dark:bg-neutral-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border dark:border-neutral-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 pb-2 border-b">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
                  {data?.dosen.nama.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight leading-tight">
                    {data?.dosen.nama}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="font-mono bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded tracking-wider">
                      NIP. {data?.dosen.nip || "-"}
                    </span>
                    <span className="text-gray-300 dark:text-neutral-700">
                      |
                    </span>
                    <span className="font-medium text-primary">
                      Dosen Pembimbing
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 gap-2 bg-white dark:bg-neutral-800",
                        filterStatus !== "all" &&
                          "bg-primary/5 text-primary border-primary/20",
                      )}
                    >
                      <Filter size={14} />
                      <span className="text-xs font-medium">
                        {filterStatus === "all"
                          ? "Status"
                          : filterStatus === "lulus"
                            ? "Lulus"
                            : "Belum Lulus"}
                      </span>
                      {filterStatus !== "all" && (
                        <div
                          className="ml-1 rounded-full p-0.5 hover:bg-primary/10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterStatus("all");
                          }}
                        >
                          <X size={12} />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("all")}
                      className="justify-between"
                    >
                      Semua
                      {filterStatus === "all" && <Check size={14} />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("lulus")}
                      className="justify-between"
                    >
                      Lulus
                      {filterStatus === "lulus" && <Check size={14} />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("belum")}
                      className="justify-between"
                    >
                      Belum Lulus
                      {filterStatus === "belum" && <Check size={14} />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Angkatan Filter */}
                <AngkatanFilter
                  selectedYears={selectedAngkatan}
                  onYearChange={setSelectedAngkatan}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-9 w-9 rounded-full"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex-1 overflow-hidden bg-gray-50/50 dark:bg-neutral-950">
              <Tabs defaultValue="p1" className="h-full flex flex-col">
                <div className="px-6 pt-4 pb-0 bg-background border-b z-10 w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="p1" className="relative">
                      Pembimbing 1
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-primary/10 text-primary hover:bg-primary/10 px-1.5 h-5 min-w-5 flex justify-center"
                      >
                        {data?.pembimbing1.length || 0}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="p2">
                      Pembimbing 2
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-100 px-1.5 h-5 min-w-5 flex justify-center"
                      >
                        {data?.pembimbing2.length || 0}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                  <TabsContent value="p1" className="mt-0 h-full">
                    <StudentList students={data?.pembimbing1 || []} />
                  </TabsContent>
                  <TabsContent value="p2" className="mt-0 h-full">
                    <div className="mb-4 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <AlertCircle size={16} />
                      <p>
                        Sebagai <strong>Pembimbing Pendamping</strong>, membantu
                        mengarahkan teknis dan penulisan.
                      </p>
                    </div>
                    <StudentList students={data?.pembimbing2 || []} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={isStudentDetailOpen}
        onClose={closeStudentDetail}
        title="Detail Mahasiswa"
        loading={isStudentDetailLoading}
        headerData={
          selectedStudent
            ? {
                name: selectedStudent.nama,
                subText: selectedStudent.nim,
                status: selectedStudent.status,
                statusColor: getStatusColor(selectedStudent.status),
                initials: selectedStudent.nama?.charAt(0),
                avatarColor: "bg-primary/10 text-primary border-primary/20",
              }
            : undefined
        }
        items={
          selectedStudent
            ? [
                {
                  label: "Program Studi",
                  value: selectedStudent.prodi?.nama,
                  icon: GraduationCap,
                },
                {
                  label: "Angkatan",
                  value: selectedStudent.angkatan,
                  icon: BookOpen,
                },
                {
                  label: "Semester",
                  value: selectedStudent.semester,
                  icon: BookOpen,
                },
                { label: "No. HP", value: selectedStudent.no_hp, icon: Phone },
                {
                  label: "Alamat",
                  value: selectedStudent.alamat,
                  icon: MapPin,
                  colSpan: 2,
                },
              ]
            : []
        }
      />
    </>
  );
}
