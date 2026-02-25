import { DateRange } from "react-day-picker";

export interface FilterState {
  search: string;
  status: string;
  angkatan: string;
  dateRange: DateRange | undefined;
}
