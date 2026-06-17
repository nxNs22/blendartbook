"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      // Auth durumu hala yükleniyorsa bekle
      if (authLoading) return;

      // Kullanıcı hiç giriş yapmamışsa login sayfasına at
      if (!user) {
        router.replace("/auth");
        return;
      }

      try {
        // Kullanıcının admin olup olmadığını veritabanından çek
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .limit(1);

        if (error) throw error;

        // is_admin true ise içeri al, değilse ana sayfaya at
        if (data && data.length > 0 && data[0].is_admin === true) {
          setIsAuthorized(true);
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        router.replace("/");
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [user, authLoading, router]);

  // Kontrol edilirken ekranda bir yüklenme animasyonu göster
  if (authLoading || checking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#5BCDE9]" size={48} />
      </div>
    );
  }

  // Yetkili değilse hiçbir şey render etme (zaten yönlendiriliyor)
  if (!isAuthorized) return null;

  // Yetkiliyse admin panelini göster
  return <>{children}</>;
}