"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export function PasswordWarning() {
    const { user } = useAuthStore();
    const [show, setShow] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (!user) return;

        const key = `password_warning_dismissed_${user.id}`;
        const isDismissed =
            typeof window !== "undefined" && sessionStorage.getItem(key) === "true";

        if (isDismissed) {
            setShow(false);
            return;
        }

        if (user.is_default_password) {
            setShow(true);
        }
    }, [user]);

    const handleDismiss = () => {
        setShow(false);
        if (user?.id) {
            sessionStorage.setItem(`password_warning_dismissed_${user.id}`, "true");
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 sticky top-16 z-20 m-4 shadow-sm rounded-r-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                            Anda masih menggunakan password default. Demi keamanan akun Anda,
                            disarankan untuk{" "}
                            <button
                                onClick={() => setOpenDialog(true)}
                                className="font-medium underline hover:text-yellow-600 dark:hover:text-yellow-100"
                            >
                                ganti password sekarang
                            </button>
                            .
                        </p>
                    </div>
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
                                onClick={handleDismiss}
                            >
                                <span className="sr-only">Dismiss</span>
                                <X className="h-5 w-5" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordDialog open={openDialog} onOpenChange={setOpenDialog} />
        </>
    );
}
