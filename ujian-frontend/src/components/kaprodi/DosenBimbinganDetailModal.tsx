import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, BookOpen, AlertCircle, Filter, X, Check, FileText, Phone, MapPin, Mail, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";

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
        nim: string;
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

export default function DosenBimbinganDetailModal({ isOpen, onClose, data, loading }: Props) {
    const [filterAngkatan, setFilterAngkatan] = useState<string>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<"all" | "lulus" | "belum">("all");

    // Student Detail Modal State
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [isStudentDetailLoading, setIsStudentDetailLoading] = useState(false);
    const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);

    // Extract unique 'angkatan' values and min/max for slider
    const { minYear, maxYear, hasData } = useMemo(() => {
        if (!data) return { minYear: 0, maxYear: 0, hasData: false };
        const allStudents = [...(data.pembimbing1 || []), ...(data.pembimbing2 || [])];
        const years = allStudents.map(s => parseInt(s.angkatan)).filter(n => !isNaN(n));

        const currentYear = new Date().getFullYear();

        if (years.length === 0) return { minYear: currentYear - 5, maxYear: currentYear, hasData: false };

        const dataMin = Math.min(...years);
        const dataMax = Math.max(...years);

        // Ensure reasonable range so slider is movable
        // e.g. min is at least 5 years ago, max is at least current year
        const minYear = Math.min(dataMin, currentYear - 5);
        const maxYear = Math.max(dataMax, currentYear);

        return {
            minYear,
            maxYear,
            hasData: true
        };
    }, [data]);

    // Filter logic
    const filterStudents = (students: StudentBimbingan[]) => {
        return students.filter(s => {
            const matchesAngkatan = filterAngkatan === "all" || s.angkatan === filterAngkatan;

            let matchesStatus = true;
            if (filterStatus === 'lulus') {
                matchesStatus = ['lulus', 'selesai', 'wisuda'].includes(s.status.toLowerCase());
            } else if (filterStatus === 'belum') {
                matchesStatus = !['lulus', 'selesai', 'wisuda'].includes(s.status.toLowerCase());
            }

            return matchesAngkatan && matchesStatus;
        });
    };

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-gray-100 text-gray-700 border-gray-200';
        const s = status.toLowerCase();
        if (s === 'lulus' || s === 'selesai' || s === 'wisuda') return 'bg-green-100 text-green-700 border-green-200';
        if (s === 'aktif' || s === 'sedang bimbingan') return 'bg-blue-50 text-blue-700 border-blue-200';
        if (s === 'tidak aktif' || s === 'cuti') return 'bg-gray-100 text-gray-700 border-gray-200';
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
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
                        {filterAngkatan !== "all" || filterStatus !== "all"
                            ? "Tidak ada data mahasiswa dengan filter yang dipilih"
                            : "Tidak ada mahasiswa bimbingan"}
                    </p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                {filtered.map((student) => (
                    <div key={student.id} className="group p-4 border rounded-xl hover:shadow-md transition-all bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-sm">{student.nama.charAt(0)}</span>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleStudentClick(student.id)}
                                        className="text-left font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors hover:underline focus:outline-none"
                                    >
                                        {student.nama}
                                    </button>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{student.nim}</span>
                                        {student.angkatan && (
                                            <span className="bg-gray-50 border px-1.5 py-0.5 rounded text-[10px]">
                                                Angkatan {student.angkatan}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                                        <span className="font-medium text-gray-500 mr-1">Judul:</span>
                                        {student.judul}
                                    </div>
                                </div>
                            </div>
                            <Badge variant="outline" className={`shrink-0 ${getStatusColor(student.status)}`}>
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
                            <div>
                                <div className="flex items-center gap-2 text-xl font-semibold">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <h3>Detail Mahasiswa Bimbingan</h3>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Daftar mahasiswa yang dibimbing oleh <span className="font-medium text-foreground">{data?.dosen.nama}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Status Filter */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className={cn("h-8 gap-2", filterStatus !== "all" && "bg-blue-50 text-blue-600 border-blue-200")}>
                                            <Filter size={14} />
                                            <span>
                                                {filterStatus === "all" ? "Status" : filterStatus === "lulus" ? "Lulus" : "Belum Lulus"}
                                            </span>
                                            {filterStatus !== "all" && (
                                                <div
                                                    className="ml-1 rounded-full p-0.5 hover:bg-blue-100 cursor-pointer"
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
                                        <DropdownMenuItem onClick={() => setFilterStatus("all")} className="justify-between">
                                            Semua
                                            {filterStatus === "all" && <Check size={14} />}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterStatus("lulus")} className="justify-between">
                                            Lulus
                                            {filterStatus === "lulus" && <Check size={14} />}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterStatus("belum")} className="justify-between">
                                            Belum Lulus
                                            {filterStatus === "belum" && <Check size={14} />}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Angkatan Filter (Popover Slider) */}
                                {!loading && hasData && (
                                    <div className="">
                                        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className={cn("h-8 gap-2", filterAngkatan !== "all" && "bg-blue-50 text-blue-600 border-blue-200")}>
                                                    <Filter size={14} />
                                                    <span>
                                                        {filterAngkatan === "all" ? "Angkatan" : `Angkatan: ${filterAngkatan}`}
                                                    </span>
                                                    {filterAngkatan !== "all" && (
                                                        <div
                                                            className="ml-1 rounded-full p-0.5 hover:bg-blue-100 cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFilterAngkatan("all");
                                                            }}
                                                        >
                                                            <X size={12} />
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-4" align="end">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-sm">Filter Tahun Angkatan</h4>
                                                        {filterAngkatan !== "all" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-auto p-0 text-xs text-blue-600"
                                                                onClick={() => setFilterAngkatan("all")}
                                                            >
                                                                Reset
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="pt-2 px-2">
                                                        <Slider
                                                            min={minYear}
                                                            max={maxYear}
                                                            step={1}
                                                            value={[filterAngkatan === "all" ? maxYear : parseInt(filterAngkatan)]}
                                                            onValueChange={(vals) => setFilterAngkatan(vals[0].toString())}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                                                        <span>{minYear}</span>
                                                        <span className="font-bold text-foreground">{filterAngkatan === "all" ? "Semua" : filterAngkatan}</span>
                                                        <span>{maxYear}</span>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="h-8 w-8 rounded-full"
                                >
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden bg-gray-50/50 dark:bg-neutral-950">
                            <Tabs defaultValue="p1" className="h-full flex flex-col">
                                <div className="px-6 pt-4 pb-0 bg-background border-b z-10 w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="p1" className="relative">
                                            Pembimbing 1
                                            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 h-5 min-w-5 flex justify-center">{data?.pembimbing1.length || 0}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="p2">
                                            Pembimbing 2
                                            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-100 px-1.5 h-5 min-w-5 flex justify-center">{data?.pembimbing2.length || 0}</Badge>
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
                                            <p>Sebagai <strong>Pembimbing Pendamping</strong>, membantu mengarahkan teknis dan penulisan.</p>
                                        </div>
                                        <StudentList students={data?.pembimbing2 || []} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    )}
                </div>
            </div>

            {/* Student Detail Modal */}
            {isStudentDetailOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                    <div
                        className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border dark:border-neutral-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Detail Mahasiswa
                            </h3>
                            <Button variant="ghost" size="icon" onClick={closeStudentDetail} className="h-8 w-8 rounded-full">
                                <X size={18} />
                            </Button>
                        </div>

                        <div className="p-0 overflow-y-auto max-h-[80vh]">
                            {isStudentDetailLoading ? (
                                <div className="p-10 flex justify-center">
                                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                                </div>
                            ) : selectedStudent ? (
                                <div>
                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 flex flex-col items-center justify-center gap-3 border-b">
                                        <div className="h-20 w-20 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-2xl font-bold text-blue-600 border-2 border-blue-100">
                                            {selectedStudent.nama?.charAt(0)}
                                        </div>
                                        <div className="text-center">
                                            <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">{selectedStudent.nama}</h2>
                                            <p className="text-gray-500 text-sm font-mono mt-1">{selectedStudent.nim}</p>
                                        </div>
                                        <Badge className={`${getStatusColor(selectedStudent.status)} px-3 py-1 text-xs`}>
                                            {selectedStudent.status}
                                        </Badge>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="space-y-1">
                                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Informasi Akademik</div>
                                            <div className="grid gap-3">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                        <GraduationCap size={16} className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-500 text-xs">Program Studi</div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.prodi?.nama || '-'}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                        <BookOpen size={16} className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-500 text-xs">Angkatan / Semester</div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.angkatan || '-'} / {selectedStudent.semester || '-'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t">
                                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kontak</div>
                                            <div className="grid gap-3">
                                                {selectedStudent.no_hp && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                            <Phone size={16} className="text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 text-xs">No. HP</div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.no_hp}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedStudent.alamat && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                            <MapPin size={16} className="text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 text-xs">Alamat</div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.alamat}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    Data mahasiswa tidak ditemukan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
