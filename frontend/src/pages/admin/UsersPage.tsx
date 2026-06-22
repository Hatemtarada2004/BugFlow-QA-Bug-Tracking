import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import type { User } from "../../types";
import { Spinner } from "../../components/ui/Spinner";
import { formatDate } from "../../utils";
import { useAuth } from "../../context/AuthContext";

const roleBadge: Record<string, { bg: string; text: string; dot: string }> = {
  ADMIN:     { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500"    },
  TESTER:    { bg: "bg-sky-50",     text: "text-sky-700",     dot: "bg-sky-500"     },
  DEVELOPER: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const avatarColor: Record<string, string> = {
  ADMIN:     "bg-rose-100 text-rose-700",
  TESTER:    "bg-sky-100 text-sky-700",
  DEVELOPER: "bg-emerald-100 text-emerald-700",
};

type UserRow = User & { _count: { createdBugs: number; assignedBugs: number } };

export const UsersPage = () => {
  const { user: me } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers]   = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get<{ users: UserRow[] }>("/users");
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    await api.patch(`/users/${userId}/role`, { role });
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("users.title")}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{users.length} registered users</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {[
                t("users.colUser"),
                t("users.colRole"),
                t("users.colCreated"),
                t("users.colAssigned"),
                t("users.colJoined"),
                t("users.colActions"),
              ].map((h) => (
                <th
                  key={h}
                  className="text-start px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider first:px-6"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => {
              const isMe = u.id === me?.id;
              const badge = roleBadge[u.role];
              return (
                <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${isMe ? "bg-indigo-50/30" : ""}`}>

                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColor[u.role]}`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{u.name}</p>
                          {isMe && (
                            <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                              {t("users.you")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role badge */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badge.bg} ${badge.text} border-transparent`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {u.role}
                    </span>
                  </td>

                  {/* Bugs created */}
                  <td className="px-4 py-4">
                    <span className="text-slate-700 font-medium">{u._count.createdBugs}</span>
                  </td>

                  {/* Bugs assigned */}
                  <td className="px-4 py-4">
                    <span className="text-slate-700 font-medium">{u._count.assignedBugs}</span>
                  </td>

                  {/* Joined date */}
                  <td className="px-4 py-4 text-slate-400 text-xs">{formatDate(u.createdAt)}</td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    {!isMe ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-colors cursor-pointer"
                      >
                        <option value="TESTER">Tester</option>
                        <option value="DEVELOPER">Developer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    ) : (
                      <span className="text-xs text-slate-400 italic">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
