import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toggleLanguage } from "../../i18n";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      await api.post("/auth/register", data);
      navigate("/login");
    } catch {
      setError(t("auth.registerFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-slate-900 p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-900/50">
            🐛
          </div>
          <span className="text-white font-bold text-lg tracking-tight">BugFlow</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Join the team.<br />Start tracking.<br />Ship quality.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create your account and start reporting, tracking, and resolving bugs in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: "🔵", title: "Report Bugs", desc: "Log defects with full context" },
            { icon: "🟣", title: "Track Progress", desc: "Follow status from open to closed" },
            { icon: "🟢", title: "Collaborate", desc: "Comment, assign, and resolve" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 text-sm">
              <span className="text-lg">{icon}</span>
              <div>
                <p className="text-white font-medium">{title}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">

        <div className="w-full max-w-sm flex justify-end mb-6">
          <button
            onClick={toggleLanguage}
            className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white hover:border-slate-300 transition-all"
          >
            🌐 {isArabic ? "English" : "العربية"}
          </button>
        </div>

        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-base">🐛</div>
            <span className="font-bold text-slate-900">BugFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">{t("auth.registerTitle")}</h1>
          <p className="text-slate-500 text-sm mb-8">{t("auth.registerSubtitle")}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t("auth.name")}
              placeholder="Ahmed Al-Rashid"
              error={errors.name?.message}
              {...register("name")}
            />
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
              placeholder="At least 6 characters"
              error={errors.password?.message}
              {...register("password")}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="lg" isLoading={isSubmitting}>
              {t("auth.register")}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              {t("auth.loginLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
