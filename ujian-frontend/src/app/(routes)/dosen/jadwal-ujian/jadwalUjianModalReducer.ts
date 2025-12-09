import { Ujian } from "@/types/Ujian";

export type ModalState = {
  openDetail: boolean;
  openRekapitulasi: boolean;
  openDaftarHadir: boolean;
  openCatatan: boolean;
  openPenilaian: boolean;
  openKeputusan: boolean;
  selected: Ujian | null;
  keputusanChoice: number | null;
};

export type ModalAction =
  | { type: "OPEN_DETAIL"; ujian: Ujian }
  | { type: "CLOSE_DETAIL" }
  | { type: "OPEN_REKAP"; ujian: Ujian }
  | { type: "CLOSE_REKAP" }
  | { type: "OPEN_DAFTAR_HADIR"; ujian: Ujian }
  | { type: "CLOSE_DAFTAR_HADIR" }
  | { type: "OPEN_CATATAN"; ujian: Ujian }
  | { type: "CLOSE_CATATAN" }
  | { type: "OPEN_PENILAIAN"; ujian: Ujian }
  | { type: "CLOSE_PENILAIAN" }
  | { type: "OPEN_KEPUTUSAN"; ujian: Ujian; keputusanChoice: number | null }
  | { type: "CLOSE_KEPUTUSAN" }
  | { type: "SET_KEPUTUSAN_CHOICE"; keputusanChoice: number | null }
  | { type: "RESET" };

export const initialModalState: ModalState = {
  openDetail: false,
  openRekapitulasi: false,
  openDaftarHadir: false,
  openCatatan: false,
  openPenilaian: false,
  openKeputusan: false,
  selected: null,
  keputusanChoice: null,
};

export function modalReducer(
  state: ModalState,
  action: ModalAction
): ModalState {
  switch (action.type) {
    case "OPEN_DETAIL":
      return { ...initialModalState, openDetail: true, selected: action.ujian };
    case "CLOSE_DETAIL":
      return { ...state, openDetail: false, selected: null };
    case "OPEN_REKAP":
      return {
        ...initialModalState,
        openRekapitulasi: true,
        selected: action.ujian,
      };
    case "CLOSE_REKAP":
      return { ...state, openRekapitulasi: false, selected: null };
    case "OPEN_DAFTAR_HADIR":
      return {
        ...initialModalState,
        openDaftarHadir: true,
        selected: action.ujian,
      };
    case "CLOSE_DAFTAR_HADIR":
      return { ...state, openDaftarHadir: false, selected: null };
    case "OPEN_CATATAN":
      return {
        ...initialModalState,
        openCatatan: true,
        selected: action.ujian,
      };
    case "CLOSE_CATATAN":
      return { ...state, openCatatan: false, selected: null };
    case "OPEN_PENILAIAN":
      return {
        ...initialModalState,
        openPenilaian: true,
        selected: action.ujian,
      };
    case "CLOSE_PENILAIAN":
      return { ...state, openPenilaian: false, selected: null };
    case "OPEN_KEPUTUSAN":
      return {
        ...initialModalState,
        openKeputusan: true,
        selected: action.ujian,
        keputusanChoice: action.keputusanChoice,
      };
    case "CLOSE_KEPUTUSAN":
      return {
        ...state,
        openKeputusan: false,
        keputusanChoice: null,
        selected: null,
      };
    case "SET_KEPUTUSAN_CHOICE":
      return { ...state, keputusanChoice: action.keputusanChoice };
    case "RESET":
      return initialModalState;
    default:
      return state;
  }
}
