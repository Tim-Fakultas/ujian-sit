// Main breadcrumb components
export { DynamicBreadcrumb } from "../dynamic-breadcrumb";

// Context and hooks
export {
  BreadcrumbProvider,
  useBreadcrumbContext,
  useSetBreadcrumb,
} from "../../contexts/BreadcrumbContext";
export { useBreadcrumb } from "../../hooks/useBreadcrumb";

// Utility components and hooks
export {
  ExampleDetailPage,
  useBreadcrumbForDetail,
  useBreadcrumbForForm,
} from "./BreadcrumbUtils";

// Types
export type { BreadcrumbItem } from "../../hooks/useBreadcrumb";
export type { CustomBreadcrumbItem } from "../../contexts/BreadcrumbContext";
