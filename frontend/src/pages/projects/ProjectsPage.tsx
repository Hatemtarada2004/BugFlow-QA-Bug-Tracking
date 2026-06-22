import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import type { Project } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { formatDate } from "../../utils";
import { useAuth } from "../../context/AuthContext";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const projectColors = [
  "bg-indigo-500", "bg-violet-500", "bg-sky-500",
  "bg-emerald-500", "bg-amber-500", "bg-rose-500",
];

export const ProjectsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const load = async () => {
    const res = await api.get<{ projects: Project[] }>("/projects");
    setProjects(res.data.projects);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: FormData) => {
    await api.post("/projects", data);
    reset();
    setShowForm(false);
    await load();
  };

  if (loading) return <Spinner />;

  const canCreate = user?.role === "ADMIN" || user?.role === "TESTER";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("projects.title")}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{projects.length} active projects</p>
        </div>
        {canCreate && (
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "secondary" : "primary"}
          >
            {showForm ? t("projects.cancel") : t("projects.newProject")}
          </Button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-sm">◫</span>
            {t("projects.createProject")}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={`${t("projects.projectName")} *`}
              placeholder={t("projects.projectNamePlaceholder")}
              error={errors.name?.message}
              {...register("name")}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{t("projects.description")}</label>
              <textarea
                rows={2}
                placeholder={t("projects.descriptionPlaceholder")}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-colors resize-none placeholder:text-slate-400"
                {...register("description")}
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button type="submit" isLoading={isSubmitting}>{t("projects.createBtn")}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); reset(); }}>
                {t("projects.cancel")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">◫</p>
          <p className="text-slate-500 font-medium">{t("projects.noProjects")}</p>
          {canCreate && (
            <p className="text-slate-400 text-sm mt-1">Click "New Project" to create your first project.</p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, i) => {
            const color = projectColors[i % projectColors.length];
            const initials = p.name.substring(0, 2).toUpperCase();
            const bugCount = p._count?.bugs ?? 0;
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
              >
                {/* Color bar */}
                <div className={`h-1.5 ${color} opacity-70`} />

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t("projects.createdBy")} {p.createdBy.name}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      bugCount > 0
                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    }`}>
                      {bugCount > 0 ? "🔴" : "✅"} {bugCount} {t("projects.bugsCount")}
                    </div>
                  </div>

                  {p.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
                  )}

                  <p className="text-xs text-slate-400 border-t border-slate-50 pt-3">
                    {formatDate(p.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
