"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, getErrorMessage } from "../lib/supabaseClient";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, UserPlus, User, Phone, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function AuthPage() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRecoveryReset, setIsRecoveryReset] = useState(false);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Yeni
  const [phone, setPhone] = useState("");       // Yeni
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const openRecoveryResetMode = () => {
      setIsLogin(false);
      setIsForgotPassword(false);
      setIsRecoveryReset(true);
      setError(null);
      setSuccess(false);
    };

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hashParams.get("type") === "recovery") {
      queueMicrotask(openRecoveryResetMode);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        openRecoveryResetMode();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRecoveryReset) {
        const trimmedPassword = password.trim();
        if (trimmedPassword.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        if (trimmedPassword !== confirmPassword.trim()) {
          throw new Error("Passwords do not match.");
        }

        const { error: updateError } = await supabase.auth.updateUser({ password: trimmedPassword });
        if (updateError) throw updateError;
        setSuccess(true);
        setIsRecoveryReset(false);
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        return;
      }

      if (isForgotPassword) {
        const trimmedEmail = email.trim();
        const redirectTo =
          typeof window === "undefined" ? undefined : `${window.location.origin}/auth/update-password`;
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo,
        });
        if (resetError) throw resetError;
        setResetEmailSent(true);
        return;
      }

      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.push("/");
        router.refresh(); 
      } else {
        // --- SIGNUP LOGIC ---
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName, // Supabase'e ekstra verileri gönderiyoruz
              phone: phone,
            }
          }
        });
        if (authError) throw authError;
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Reset form when switching modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setIsRecoveryReset(false);
    setResetEmailSent(false);
    setError(null);
    setSuccess(false);
    setPassword("");
    setConfirmPassword("");
    setFullName(""); // Mod değiştiğinde temizle
    setPhone("");    // Mod değiştiğinde temizle
  };

  const openForgotPassword = () => {
    setIsForgotPassword(true);
    setIsRecoveryReset(false);
    setResetEmailSent(false);
    setError(null);
    setSuccess(false);
    setPassword("");
    setConfirmPassword("");
  };

  const returnToLogin = () => {
    setIsForgotPassword(false);
    setIsRecoveryReset(false);
    setResetEmailSent(false);
    setError(null);
    setSuccess(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-teal-50/50 px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-teal-100 max-w-md w-full relative overflow-hidden transition-all duration-300">
        
        {/* Dynamic Top Accent Color */}
        <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${isLogin && !isForgotPassword ? 'bg-[#2CB391]' : 'bg-[#F14D5D]'}`} />

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group mb-6">
            <span className="text-[#1A2E35] font-black text-3xl tracking-tighter leading-none italic group-hover:text-[#F14D5D] transition-colors">blendartbook</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A2E35]">
            {isRecoveryReset
              ? t("set_new_password")
              : isForgotPassword
                ? t("reset_your_password")
                : isLogin
                  ? t("welcome_back")
                  : t("create_an_account")}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isRecoveryReset
              ? t("choose_secure_password")
              : isForgotPassword
              ? t("email_reset_link")
              : isLogin
                ? t("enter_details_access")
                : t("join_track_orders")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 flex items-start gap-2 animate-in fade-in">
            <span className="font-bold shrink-0">{t("error_label")}</span> {error}
          </div>
        )}

        {resetEmailSent && isForgotPassword ? (
          <div className="bg-teal-50 text-teal-800 p-6 rounded-xl border border-teal-100 text-center animate-in zoom-in-95">
            <CheckCircle2 size={48} className="text-teal-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">{t("check_your_email")}</h3>
            <p className="text-sm opacity-90">
              {t("if_account_exists")} <strong>{email.trim()}</strong>, you&apos;ll receive a reset link shortly.
            </p>
            <button
              onClick={returnToLogin}
              className="mt-6 inline-flex items-center justify-center gap-2 bg-[#1A2E35] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
              type="button"
            >
              <ArrowLeft size={16} />
              {t("return_to_login")}
            </button>
          </div>
        ) : success && !isLogin ? (
          <div className="bg-teal-50 text-teal-800 p-6 rounded-xl border border-teal-100 text-center animate-in zoom-in-95">
            <CheckCircle2 size={48} className="text-teal-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">{t("check_your_email")}</h3>
            <p className="text-sm opacity-90">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>. {t("click_verify_account")}
            </p>
            <button 
              onClick={() => { setSuccess(false); setIsLogin(true); }}
              className="mt-6 inline-block bg-[#1A2E35] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
            >
              {t("return_to_login")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* --- SADECE KAYIT EKRANINDA GÖRÜNECEK ALANLAR --- */}
            {!isLogin && !isForgotPassword && !isRecoveryReset && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{t("full_name")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#F14D5D] focus:ring-1 focus:ring-[#F14D5D] transition-colors bg-gray-50 focus:bg-white"
                      placeholder={t("john_doe")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{t("phone_number")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#F14D5D] focus:ring-1 focus:ring-[#F14D5D] transition-colors bg-gray-50 focus:bg-white"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </>
            )}
            {/* ---------------------------------------------- */}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{t("email_address")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="email"
                  className={`w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white ${isLogin ? 'focus:border-[#2CB391] focus:ring-[#2CB391]' : 'focus:border-[#F14D5D] focus:ring-[#F14D5D]'}`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {!isForgotPassword && !isRecoveryReset && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">{t("password_label")}</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={openForgotPassword}
                      className="text-xs text-[#2CB391] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={isLogin ? 1 : 6}
                    className={`w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white ${isLogin ? 'focus:border-[#2CB391] focus:ring-[#2CB391]' : 'focus:border-[#F14D5D] focus:ring-[#F14D5D]'}`}
                    placeholder={isLogin ? "••••••••" : "At least 6 characters"}
                  />
                </div>
              </div>
            )}

            {isRecoveryReset && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{t("new_password")}</label>
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
                    className="w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white focus:border-[#F14D5D] focus:ring-[#F14D5D]"
                    placeholder={t("at_least_6_chars")}
                  />
                </div>
              </div>
            )}

            {isRecoveryReset && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{t("confirm_password")}</label>
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
                    className="w-full h-12 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white focus:border-[#F14D5D] focus:ring-[#F14D5D]"
                    placeholder={t("repeat_new_password")}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                isLogin && !isForgotPassword ? 'bg-[#2CB391] hover:bg-[#249278]' : 'bg-[#F14D5D] hover:bg-[#d43f4d]'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isRecoveryReset ? (
                <>{t("update_password")} <ArrowRight size={18} /></>
              ) : isForgotPassword ? (
                <>{t("send_reset_link")} <ArrowRight size={18} /></>
              ) : isLogin ? (
                <>{t("log_in")} <ArrowRight size={18} /></>
              ) : (
                <>{t("create_account_btn")} <UserPlus size={18} /></>
              )}
            </button>

            {(isForgotPassword || isRecoveryReset) && (
              <button
                type="button"
                onClick={returnToLogin}
                className="w-full h-12 rounded-lg font-bold flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} /> {t("back_to_login")}
              </button>
            )}
          </form>
        )}

        {/* The Toggle Footer */}
        {!success && !isForgotPassword && (
          <div className="mt-8 text-center text-sm text-gray-600 border-t pt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleMode}
              type="button"
              className={`font-bold hover:underline transition-colors ${isLogin ? 'text-[#F14D5D]' : 'text-[#2CB391]'}`}
            >
              {isLogin ? t("sign_up_free") : t("log_in_here")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
