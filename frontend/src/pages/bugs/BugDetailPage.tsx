import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import type { Bug, ActivityLog, Attachment } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { priorityColor, statusColor, severityColor, formatDate } from "../../utils";
import { useAuth } from "../../context/AuthContext";

const formatActivityLog = (log: ActivityLog): { icon: string; text: string } => {
  const d = log.detail;
  switch (log.action) {
    case "BUG_CREATED":      return { icon: "✨", text: "created this bug" };
    case "STATUS_CHANGED":   return { icon: "🔄", text: `changed status: ${d}` };
    case "PRIORITY_CHANGED": return { icon: "🚦", text: `changed priority: ${d}` };
    case "SEVERITY_CHANGED": return { icon: "⚠️", text: `changed severity: ${d}` };
    case "ASSIGNED":         return { icon: "👤", text: `assigned this bug` };
    case "UNASSIGNED":       return { icon: "👤", text: `removed assignment` };
    case "COMMENT_ADDED":    return { icon: "💬", text: "added a comment" };
    default:                 return { icon: "📝", text: log.action.toLowerCase().replace(/_/g, " ") };
  }
};

export const BugDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bug, setBug]               = useState<Bug | null>(null);
  const [logs, setLogs]             = useState<ActivityLog[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [comment, setComment]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);

  const load = async () => {
    const [bugRes, logsRes, attRes] = await Promise.all([
      api.get<{ bug: Bug }>(`/bugs/${id}`),
      api.get<{ logs: ActivityLog[] }>(`/bugs/${id}/activity`),
      api.get<{ attachments: Attachment[] }>(`/attachments/${id}`),
    ]);
    setBug(bugRes.data.bug);
    setLogs(logsRes.data.logs);
    setAttachments(attRes.data.attachments);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    if (!confirm(t("bugs.confirmDelete"))) return;
    await api.delete(`/bugs/${id}`);
    navigate("/bugs");
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    await api.post(`/comments/${id}`, { content: comment });
    setComment("");
    await load();
    setSubmitting(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    await api.post(`/attachments/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
    e.target.value = "";
    await load();
    setUploading(false);
  };

  const handleDeleteAttachment = async (attId: string) => {
    await api.delete(`/attachments/${attId}`);
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  if (loading) return <Spinner />;
  if (!bug) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🔍</p>
      <p className="text-slate-500 font-medium">{t("common.bugNotFound")}</p>
    </div>
  );

  const canEdit   = user?.role === "ADMIN" || user?.role === "TESTER" || bug.createdBy.id === user?.id;
  const canDelete = user?.role === "ADMIN" || bug.createdBy.id === user?.id;

  return (
    <div className="max-w-4xl space-y-6">

      {/* Breadcrumb + Header */}
      <div>
        <Link
          to="/bugs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-3"
        >
          ← {t("bugs.backToBugs")}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 leading-snug">{bug.title}</h1>
            <p className="text-sm text-slate-400 mt-1.5">
              {t("bugs.reportedBy")}{" "}
              <span className="text-slate-600 font-medium">{bug.createdBy.name}</span>
              {" · "}
              {formatDate(bug.createdAt)}
            </p>
          </div>

          {(canEdit || canDelete) && (
            <div className="flex gap-2 flex-shrink-0">
              {canEdit && (
                <Link to={`/bugs/${id}/edit`}>
                  <Button variant="secondary" size="sm">{t("bugs.edit")}</Button>
                </Link>
              )}
              {canDelete && (
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  {t("bugs.delete")}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: t("bugs.detailStatus"),      node: <Badge label={bug.status.replace("_"," ")} className={statusColor[bug.status]} /> },
          { label: t("bugs.detailPriority"),    node: <Badge label={bug.priority} className={priorityColor[bug.priority]} /> },
          { label: t("bugs.detailSeverity"),    node: <Badge label={bug.severity} className={severityColor[bug.severity]} /> },
          { label: t("bugs.detailProject"),     node: <span className="text-sm font-medium text-slate-700">{bug.project.name}</span> },
          { label: t("bugs.detailAssigned"),    node: <span className="text-sm text-slate-700">{bug.assignedTo?.name ?? <span className="text-slate-400 italic">{t("bugs.unassigned")}</span>}</span> },
          { label: t("bugs.detailEnvironment"), node: <span className="text-sm text-slate-700">{bug.environment ?? <span className="text-slate-400">—</span>}</span> },
        ].map(({ label, node }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
            {node}
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs">📄</span>
          {t("bugs.description")}
        </h2>
        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{bug.description}</p>

        {bug.stepsToReproduce && (
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {t("bugs.stepsToReproduce")}
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-lg p-3">
              {bug.stepsToReproduce}
            </p>
          </div>
        )}

        {(bug.expectedResult || bug.actualResult) && (
          <div className="grid md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            {bug.expectedResult && (
              <div>
                <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                  ✓ {t("bugs.expectedResult")}
                </h3>
                <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  {bug.expectedResult}
                </p>
              </div>
            )}
            {bug.actualResult && (
              <div>
                <h3 className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">
                  ✗ {t("bugs.actualResult")}
                </h3>
                <p className="text-sm text-rose-800 bg-rose-50 border border-rose-100 rounded-lg p-3">
                  {bug.actualResult}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs">📎</span>
            Attachments
            {attachments.length > 0 && (
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                {attachments.length}
              </span>
            )}
          </h2>
          <label className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${uploading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"}`}>
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,.pdf,.txt,.csv,.mp4" />
            {uploading ? "⏳ Uploading…" : "⬆️ Upload File"}
          </label>
        </div>

        {attachments.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-2xl mb-1">📎</p>
            <p className="text-sm text-slate-400">No attachments yet</p>
            <p className="text-xs text-slate-300 mt-0.5">Images, PDFs, CSVs up to 10 MB</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attachments.map((att) => {
              const isImage = att.mimeType.startsWith("image/");
              const icon = isImage ? "🖼️" : att.mimeType === "application/pdf" ? "📄" : "📁";
              const sizeStr = att.size > 1024 * 1024
                ? `${(att.size / 1024 / 1024).toFixed(1)} MB`
                : `${(att.size / 1024).toFixed(0)} KB`;
              return (
                <div key={att.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={`http://localhost:5000/uploads/${att.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-slate-800 hover:text-indigo-600 transition-colors truncate block"
                    >
                      {att.originalName}
                    </a>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {sizeStr} · {att.uploadedBy.name} · {formatDate(att.createdAt)}
                    </p>
                  </div>
                  {(user?.role === "ADMIN" || att.uploadedBy.id === user?.id) && (
                    <button
                      onClick={() => handleDeleteAttachment(att.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 text-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      {logs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs">📋</span>
            Activity
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">{logs.length}</span>
          </h2>
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-100" />
            <div className="space-y-4">
              {logs.map((log) => {
                const { icon, text } = formatActivityLog(log);
                return (
                  <div key={log.id} className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs flex-shrink-0 z-10">
                      {icon}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">{log.user.name}</span>{" "}
                        {text}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(log.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs">💬</span>
          {t("bugs.comments")}
          {(bug.comments?.length ?? 0) > 0 && (
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
              {bug.comments!.length}
            </span>
          )}
        </h2>

        <div className="space-y-4 mb-6">
          {(bug.comments ?? []).length === 0 && (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm text-slate-400">{t("bugs.noComments")}</p>
            </div>
          )}
          {(bug.comments ?? []).map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0 mt-0.5">
                {c.author.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-slate-900">{c.author.name}</span>
                  <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleComment} className="flex gap-3">
          <input
            type="text"
            placeholder={t("bugs.addComment")}
            className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-colors placeholder:text-slate-400"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit" isLoading={submitting} disabled={!comment.trim()}>
            {t("bugs.post")}
          </Button>
        </form>
      </div>
    </div>
  );
};
