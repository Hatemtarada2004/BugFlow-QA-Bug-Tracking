import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toggleLanguage } from "../../i18n";

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [error, setError] = useState("");
  const isArabic = i18n.language === "ar";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch {
      setError(t("auth.invalidCredentials"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-slate-900 p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-900/50">
            🐛
          </div>
          <span className="text-white font-bold text-lg tracking-tight">BugFlow</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Track bugs.<br />Ship faster.<br />Sleep better.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A modern QA platform built for testers, developers, and project managers who care about quality.
          </p>
        </div>

        <div className="flex gap-6 text-slate-500 text-xs">
          <span>🔒 Secure JWT Auth</span>
          <span>👥 Role-Based Access</span>
          <span>🌐 EN / AR</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">

        {/* Language toggle */}
        <div className="w-full max-w-sm flex justify-end mb-6">
          <button
            onClick={toggleLanguage}
            className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white hover:border-slate-300 transition-all"
          >
            🌐 {isArabic ? "English" : "العربية"}
          </button>
        </div>

        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-base">🐛</div>
            <span className="font-bold text-slate-900">BugFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">{t("auth.loginTitle")}</h1>
          <p className="text-slate-500 text-sm mb-8">{t("auth.loginSubtitle")}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t("auth.email")}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label={t("auth.password")}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="lg" isLoading={isSubmitting}>
              {t("auth.login")}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              {t("auth.registerLink")}
            </Link>
          </p>

          <div className="mt-8 p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700 mb-2">{t("auth.demoAccounts")}</p>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">A</span>
              <span>admin@bugflow.com</span>
              <span className="text-slate-300">/</span>
              <span className="font-mono">admin123</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">T</span>
              <span>tester@bugflow.com</span>
              <span className="text-slate-300">/</span>
              <span className="font-mono">tester123</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">D</span>
              <span>dev@bugflow.com</span>
              <span className="text-slate-300">/</span>
              <span className="font-mono">dev123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
