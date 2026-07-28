"use client";

import { useEffect } from "react";

export default function AuthRecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.slice(1));
    if (params.get("type") !== "recovery") return;
    if (window.location.pathname === "/auth/update-password") return;

    window.location.replace(`/auth/update-password${hash}`);
  }, []);

  return null;
}
