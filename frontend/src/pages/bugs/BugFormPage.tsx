import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import type { Project, User, Bug } from "../../types";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";

const schema = z.object({
  title:           z.string().min(3),
  description:     z.string().min(10),
  projectId:       z.string().min(1),
  priority:        z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  severity:        z.enum(["TRIVIAL", "MINOR", "MAJOR", "CRITICAL", "BLOCKER"]),
  status:          z.enum(["OPEN", "IN_PROGRESS", "FIXED", "CLOSED"]).optional(),
  assignedToId:    z.string().optional(),
  stepsToReproduce: z.string().optional(),
  expectedResult:  z.string().optional(),
  actualResult:    z.string().optional(),
  environment:     z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const textareaClass = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-150
   focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
   placeholder:text-slate-400 resize-none
   ${hasError
     ? "border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-500"
     : "border-slate-200 bg-white hover:border-slate-300"}`;

const SectionLabel = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
    <span className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-sm">{icon}</span>
    <h2 className="font-semibold text-slate-800 text-sm">{label}</h2>
  </div>
);

export const BugFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEdit = Boolean(id);
  const [projects, setProjects]   = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<User[]>([]);
  const [loading, setLoading]     = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "MEDIUM", severity: "MAJOR" },
  });

  useEffect(() => {
    const load = async () => {
      const [projRes, devRes] = await Promise.all([
        api.get<{ projects: Project[] }>("/projects"),
        api.get<{ developers: User[] }>("/users/developers"),
      ]);
      setProjects(projRes.data.projects);
      setDevelopers(devRes.data.developers);
      if (isEdit) {
        const bugRes = await api.get<{ bug: Bug }>(`/bugs/${id}`);
        const b = bugRes.data.bug;
        reset({
          title:            b.title,
          description:      b.description,
          projectId:        b.project.id,
          priority:         b.priority,
          severity:         b.severity,
          status:           b.status,
          assignedToId:     b.assignedTo?.id ?? "",
          stepsToReproduce: b.stepsToReproduce ?? "",
          expectedResult:   b.expectedResult ?? "",
          actualResult:     b.actualResult ?? "",
          environment:      b.environment ?? "",
        });
      }
      setLoading(false);
    };
    load();
  }, [id, isEdit, reset]);

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, assignedToId: data.assignedToId || undefined };
    if (isEdit) {
      await api.put(`/bugs/${id}`, payload);
      navigate(`/bugs/${id}`);
    } else {
      const res = await api.post<{ bug: Bug }>("/bugs", payload);
      navigate(`/bugs/${res.data.bug.id}`);
    }
  };

  if (loading) return <Spinner />;

  const projectOptions = [
    { value: "", label: t("bugs.selectProject") },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];
  const devOptions = [
    { value: "", label: t("bugs.unassigned") },
    ...developers.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? t("bugs.editBug") : t("bugs.reportNewBug")}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isEdit ? "Update the bug details below." : "Fill in the details to report a new bug."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <SectionLabel icon="📝" label="Basic Information" />

          <Input
            label={`${t("bugs.titleField")} *`}
            placeholder="Brief description of the bug"
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t("bugs.description")} *</label>
            <textarea
              rows={4}
              placeholder="Detailed description of the bug..."
              className={textareaClass(!!errors.description)}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-600 flex items-center gap-1">⚠ {errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Classification */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <SectionLabel icon="🏷️" label="Classification" />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label={`${t("bugs.project")} *`}
              options={projectOptions}
              error={errors.projectId?.message}
              {...register("projectId")}
            />
            <Select label={t("bugs.assignedTo")} options={devOptions} {...register("assignedToId")} />
            <Select
              label={`${t("bugs.priority")} *`}
              options={[
                { value: "LOW",      label: t("bugs.priorityLow")    },
                { value: "MEDIUM",   label: t("bugs.priorityMedium") },
                { value: "HIGH",     label: t("bugs.priorityHigh")   },
                { value: "CRITICAL", label: t("bugs.priorityCritical") },
              ]}
              {...register("priority")}
            />
            <Select
              label={`${t("bugs.severity")} *`}
              options={[
                { value: "TRIVIAL",  label: t("bugs.severityTrivial")  },
                { value: "MINOR",    label: t("bugs.severityMinor")    },
                { value: "MAJOR",    label: t("bugs.severityMajor")    },
                { value: "CRITICAL", label: t("bugs.severityCritical") },
                { value: "BLOCKER",  label: t("bugs.severityBlocker")  },
              ]}
              {...register("severity")}
            />
            {isEdit && (
              <Select
                label={t("bugs.status")}
                options={[
                  { value: "OPEN",        label: t("bugs.statusOpen")       },
                  { value: "IN_PROGRESS", label: t("bugs.statusInProgress") },
                  { value: "FIXED",       label: t("bugs.statusFixed")      },
                  { value: "CLOSED",      label: t("bugs.statusClosed")     },
                ]}
                {...register("status")}
              />
            )}
            <Input
              label={t("bugs.environment")}
              placeholder="e.g. Chrome 120 / Windows 11"
              {...register("environment")}
            />
          </div>
        </div>

        {/* QA Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <SectionLabel icon="🧪" label={t("bugs.qaDetails")} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t("bugs.stepsToReproduce")}</label>
            <textarea
              rows={4}
              placeholder={"1. Open the app\n2. Navigate to...\n3. Click on...\n4. Observe the error"}
              className={textareaClass()}
              {...register("stepsToReproduce")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("bugs.expectedResult")}
              placeholder="What should happen"
              {...register("expectedResult")}
            />
            <Input
              label={t("bugs.actualResult")}
              placeholder="What actually happened"
              {...register("actualResult")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" isLoading={isSubmitting} size="lg">
            {isEdit ? t("bugs.updateBug") : t("bugs.reportNewBug")}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
            {t("bugs.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
};
