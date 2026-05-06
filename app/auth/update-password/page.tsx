"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, getErrorMessage } from "../../lib/supabaseClient";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      setError(null);
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!cancelled) {
          setReady(Boolean(data.session));
        }
      } catch (err: unknown) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setReady(Boolean(session));
      }
      if (event === "SIGNED_OUT") {
        setReady(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (trimmedPassword !== confirmPassword.trim()) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: trimmedPassword });
      if (updateError) throw updateError;
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-teal-50/50 px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-teal-100 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#F14D5D]" />

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group mb-6">
            <span className="text-[#1A2E35] font-black text-3xl tracking-tighter leading-none italic group-hover:text-[#F14D5D] transition-colors">
              blendartbook
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A2E35]">Set a new password</h1>
          <p className="text-sm text-gray-500 mt-2">Enter a new password for your account.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 flex items-start gap-2">
            <span className="font-bold shrink-0">Error:</span> {error}
          </div>
        )}

        {checking ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : !ready ? (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 text-sm">
            This reset link is missing or expired. Please go back and request a new password reset email.
            <div className="mt-4">
              <Link href="/auth" className="text-sm font-bold text-[#2CB391] hover:underline">
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="bg-teal-50 text-teal-800 p-6 rounded-xl border border-teal-100 text-center">
            <CheckCircle2 size={48} className="text-teal-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Password updated</h3>
            <p className="text-sm opacity-90">You can now sign in with your new password.</p>
            <Link
              href="/auth"
              className="mt-6 inline-block bg-[#1A2E35] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
            >
              Continue to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#F14D5D] focus:ring-1 focus:ring-[#F14D5D] transition-colors bg-gray-50 focus:bg-white"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#F14D5D] focus:ring-1 focus:ring-[#F14D5D] transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed bg-[#F14D5D] hover:bg-[#d43f4d]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
