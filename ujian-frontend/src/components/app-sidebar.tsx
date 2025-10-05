import { getAuthFromCookies } from "@/lib/auth";
import { AppSidebarClient } from "./app-sidebar-client";

export async function AppSidebar() {
  const { user } = getAuthFromCookies();
  return <AppSidebarClient user={user} />;
}
