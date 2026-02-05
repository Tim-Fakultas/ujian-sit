import { User } from "@/types/Auth";
import { AppSidebarClient } from "./app-sidebar-client";

export function AppSidebar({ user }: { user?: User }) {
  return <AppSidebarClient user={user} />;
}
