"use client";

import { useState, useTransition, useEffect } from "react";
import {
    IconLock,
    IconLogout,
    IconUserCircle,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ui/custom-toast";
import { logoutAction } from "@/actions/auth";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ChangePasswordDialog } from "@/components/auth/ChangePasswordDialog";
import { getDisplayName } from "@/lib/utils";
// We use a looser type or import from types/Auth if compatible. 
// For safety, let's accept any object that resembles a user or Import User from types/Auth
import { User } from "@/types/Auth";

interface UserProfileMenuProps {
    user?: User; // Use the standard User type
    trigger?: React.ReactNode;
    align?: "center" | "end" | "start";
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
}

export function UserProfileMenu({ user: propUser, trigger, align = "end", side, sideOffset = 4 }: UserProfileMenuProps) {
    const { user, setUser, initializeFromCookies } = useAuthStore();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    // Sync logic if propUser is provided (from server)
    useEffect(() => {
        if (propUser) {
            setUser(propUser);
        } else {
            initializeFromCookies();
        }
    }, [propUser, setUser, initializeFromCookies]);

    const currentUser = propUser || user;

    if (!currentUser) return null;

    // Handle roles logic. 
    // User type from types/Auth has roles?: Role[] | undefined;
    // Role has name. 
    const userRole =
        currentUser.roles && currentUser.roles.length > 0
            ? currentUser.roles[0].name === "admin prodi"
                ? "admin"
                : currentUser.roles[0].name
            : "user";

    const initials =
        currentUser.nama
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "U";

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
            showToast.success("Berhasil logout");
            router.replace("/login");
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {trigger}
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="min-w-56 rounded-xl shadow-lg border-border/50"
                    align={align}
                    side={side}
                    sideOffset={sideOffset}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-3 px-3 py-3 text-left text-sm bg-muted/30">
                            <Avatar className="h-9 w-9 rounded-full flex-shrink-0">
                                <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-medium">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-xs leading-tight">
                                <span className="truncate font-semibold text-foreground">
                                    {getDisplayName(currentUser.nama)}
                                </span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {currentUser.email}
                                </span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                                        {userRole}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup className="p-1">
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                            <Link
                                href={`/${userRole
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()}/profile`}
                            >
                                <IconUserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                                Profile
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="rounded-lg cursor-pointer"
                            onClick={() => setChangePasswordOpen(true)}
                        >
                            <IconLock className="mr-2 h-4 w-4 text-muted-foreground" />
                            Ganti Password
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <div className="p-1">
                        <DropdownMenuItem
                            onClick={() => setConfirmOpen(true)}
                            className="w-full flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20 dark:focus:text-red-400"
                        >
                            <IconLogout className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <ChangePasswordDialog
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}
            />

            {/* Dialog konfirmasi logout - Premium & Mobile Friendly */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="w-[90vw] max-w-[400px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl gap-0 font-sans">
                    <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 bg-white dark:bg-neutral-900">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6 ring-8 ring-red-50 dark:ring-red-900/10">
                            <IconLogout size={32} stroke={2} />
                        </div>

                        <DialogHeader className="text-center sm:text-center space-y-2">
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                Keluar dari Akun?
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 dark:text-gray-400 text-base max-w-[280px] mx-auto leading-relaxed">
                                Apakah Anda yakin ingin mengakhiri sesi ini? Anda harus login kembali untuk mengakses akun.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <DialogFooter className="grid grid-cols-2 gap-3 p-6 bg-gray-50/50 dark:bg-neutral-800/50 border-t border-gray-100 dark:border-neutral-800">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                            className="w-full h-11 rounded-xl border-gray-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setConfirmOpen(false);
                                handleLogout();
                            }}
                            disabled={isPending}
                            className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isPending ? "Keluar..." : "Ya, Keluar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
