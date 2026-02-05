"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordAction } from "@/actions/auth";
import { showToast } from "@/components/ui/custom-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

// Form Schema
const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, "Password saat ini wajib diisi"),
        new_password: z.string().min(8, "Password baru minimal 8 karakter"),
        confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "Password tidak cocok",
        path: ["confirm_password"],
    });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({
    open,
    onOpenChange,
}: ChangePasswordDialogProps) {
    const { user, setUser } = useAuthStore();
    const [isPending, startTransition] = useTransition();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const onSubmit = (values: ChangePasswordFormValues) => {
        startTransition(async () => {
            try {
                const result = await changePasswordAction(values);

                if (result.success) {
                    showToast.success("Password berhasil diubah");

                    // Update Auth Store locally so the warning disappears immediately
                    if (user) {
                        setUser({ ...user, is_default_password: false });
                    }

                    onOpenChange(false);
                    form.reset();
                    // Reset visibility states
                    setShowCurrent(false);
                    setShowNew(false);
                    setShowConfirm(false);
                } else {
                    showToast.error(result.message || "Gagal mengubah password");
                }
            } catch (error) {
                showToast.error("Terjadi kesalahan sistem");
                console.error(error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-w-[90%] rounded-xl">
                <DialogHeader>
                    <DialogTitle>Ganti Password</DialogTitle>
                    <DialogDescription>
                        Buat password baru yang aman untuk akun Anda.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="current_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Saat Ini</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showCurrent ? "text" : "password"}
                                                placeholder="Masukkan password saat ini"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                                tabIndex={-1}
                                            >
                                                {showCurrent ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="new_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Baru</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showNew ? "text" : "password"}
                                                placeholder="Minimal 8 karakter"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowNew(!showNew)}
                                                tabIndex={-1}
                                            >
                                                {showNew ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Konfirmasi Password Baru</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirm ? "text" : "password"}
                                                placeholder="Ulangi password baru"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                tabIndex={-1}
                                            >
                                                {showConfirm ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Password
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
