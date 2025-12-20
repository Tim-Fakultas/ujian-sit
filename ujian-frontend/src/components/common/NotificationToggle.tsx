"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import { getPendaftaranUjianByProdi } from "@/actions/pendaftaranUjian";
import { getJadwalUjianByMahasiswaId } from "@/actions/jadwalUjian";
import { showToast } from "@/components/ui/custom-toast";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "success" | "info" | "warning";
}

export function NotificationToggle() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  // Helper to check roles
  const { isMahasiswa, isSekprodi } = React.useMemo(() => {
    if (!user) return { isMahasiswa: false, isSekprodi: false };
    const role = user.role?.toLowerCase();
    const roles = user.roles?.map(r => r.name.toLowerCase());
    
    return {
        isMahasiswa: role === "mahasiswa" || roles?.includes("mahasiswa"),
        isSekprodi: role === "sekprodi" || roles?.includes("sekprodi")
    };
  }, [user]);

  React.useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
  }, []);

  // Track mount status to prevent state updates/errors on unmount (e.g. logout)
  const isMounted = React.useRef(true);
  
  React.useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const knownIdsRef = new Set<string>();
    
    const fetchNotifications = async (isPolling = false) => {
      // Double check user and mount status
      if (!user || !isMounted.current) return;

      try {
        let newNotifications: NotificationItem[] = [];

        if (isMahasiswa) {
             const ranpels = await getPengajuanRanpelByMahasiswaId(user.id).catch(() => []);
             if (!isMounted.current) return;

             ranpels.forEach((ranpel) => {
               if (ranpel.status === "diterima") {
                  newNotifications.push({
                     id: `ranpel-${ranpel.id}`,
                     title: "Pengajuan Ranpel Diterima",
                     message: `Pengajuan judul "${ranpel.ranpel.judulPenelitian}" Anda telah disetujui oleh Kaprodi.`,
                     date: ranpel.tanggalDiterima || ranpel.updatedAt || new Date().toISOString(),
                     read: false,
                     type: "success"
                  });
               }
             });

             const jadwalUjians = await getJadwalUjianByMahasiswaId(user.id).catch(() => []);
             if (!isMounted.current) return;

             jadwalUjians.forEach((ujian) => {
                if (ujian.pendaftaranUjian?.status === "dijadwalkan") {
                   const tanggal = ujian.jadwalUjian 
                      ? new Date(ujian.jadwalUjian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      : "Tentukan Tanggal";

                   newNotifications.push({
                      id: `jadwal-${ujian.id}`,
                      title: "Jadwal Ujian Keluar",
                      message: `Ujian ${ujian.jenisUjian?.namaJenis} Anda telah dijadwalkan pada tanggal ${tanggal}. Silakan cek detail jadwal.`,
                      date: ujian.jadwalUjian || new Date().toISOString(),
                      read: false,
                      type: "info"
                   });
                }
             });
        }
        
        if (isSekprodi && user.prodi?.id) {
             const pendaftarans = await getPendaftaranUjianByProdi(user.prodi.id).catch(() => []);
             if (!isMounted.current) return;

             pendaftarans.forEach((pendaftaran) => {
                // Assuming getPendaftaranUjianByProdi returns "menunggu" by default as seen in the action file
                newNotifications.push({
                   id: `pendaftaran-${pendaftaran.id}`,
                   title: "Pendaftaran Ujian Baru",
                   message: `Mahasiswa ${pendaftaran.mahasiswa?.nama} telah mendaftar ujian ${pendaftaran.jenisUjian?.namaJenis}.`,
                   date: pendaftaran.createdAt || new Date().toISOString(),
                   read: false,
                   type: "info"
                });
             });
        }
        
        const readIds = JSON.parse(localStorage.getItem("read_notifications") || "[]");
        const processedNotifications = newNotifications.map(n => ({
            ...n,
            read: readIds.includes(n.id)
        }));

        setNotifications(processedNotifications);
        
        // Auto-open logic
        const currentIds = new Set(processedNotifications.map(n => n.id));
        const hasUnread = processedNotifications.some(n => !n.read);
        
        // Check for new IDs that were not in our local ref
        // We only care about NEW IDs for the "New Notification" trigger
        let newlyAdded: NotificationItem[] = [];
        for (const notif of processedNotifications) {
            if (!knownIdsRef.has(notif.id)) {
                newlyAdded.push(notif);
                knownIdsRef.add(notif.id);
            }
        }

        if (hasUnread) {
            const sessionKey = `notif_popup_shown_${user.id}`;
            const alreadyShown = sessionStorage.getItem(sessionKey);

            if (!isPolling) {
                // Initial Load - Pop up if not shown in this session yet
                if (!alreadyShown) {
                    setIsOpen(true);
                    sessionStorage.setItem(sessionKey, "true");
                }
            } else {
                // Polling Update - Show Toast for REALLY new items
                if (newlyAdded.length > 0) {
                    newlyAdded.forEach(n => {
                        // 1. In-App Toast
                        if (n.type === "success") {
                            showToast.success(n.title, n.message);
                        } else {
                            showToast.info(n.title, n.message);
                        }
                        
                        // 2. Browser System Notification
                        if ("Notification" in window && Notification.permission === "granted") {
                           new Notification(n.title, {
                             body: n.message,
                             icon: "/icon.png", 
                           });
                        }
                    });
                }
            }
        } 

      } catch (error) {
        // Suppress errors during polling/logout
      }
    };

    fetchNotifications();
    
    // Poll every 5 seconds for "real-time" feel
    intervalId = setInterval(() => {
        fetchNotifications(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user, isMahasiswa, isSekprodi]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = () => {
     const ids = notifications.map(n => n.id);
     localStorage.setItem("read_notifications", JSON.stringify(ids));
     setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isMahasiswa && !isSekprodi) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative border-none text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          aria-label="Notifications"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-950" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold text-sm">Notifikasi</h4>
          {unreadCount > 0 && (
            <span 
              className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors" 
              onClick={handleMarkAsRead}
            >
              Tandai sudah dibaca
            </span>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto p-4">
           {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                  <div key={notification.id} className={`flex gap-3 items-start ${notification.read ? 'opacity-50' : ''}`}>
                     <div className={`h-2 w-2 mt-1.5 rounded-full shrink-0 ${notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                     <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-3">{notification.message}</p>
                        <p className="text-[10px] text-neutral-400">
                          {new Date(notification.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                     </div>
                  </div>
              ))}
            </div>
           ) : (
            <div className="text-center py-8 text-neutral-500">
               <p className="text-sm">Tidak ada notifikasi baru</p>
            </div>
           )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
