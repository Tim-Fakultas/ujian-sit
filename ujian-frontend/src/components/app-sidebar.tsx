import { getAuthFromCookies } from "@/lib/auth";
import { AppSidebarClient } from "./app-sidebar-client";

export async function AppSidebar() {
  // ambil data user
  const { user } = getAuthFromCookies();
  return <AppSidebarClient user={user} />;
}
