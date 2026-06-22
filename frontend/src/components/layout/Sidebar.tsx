import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { toggleLanguage } from "../../i18n";
import { useDarkMode } from "../../hooks/useDarkMode";

const roleColors: Record<string, string> = {
  ADMIN:     "bg-rose-500/20 text-rose-300",
  TESTER:    "bg-sky-500/20 text-sky-300",
  DEVELOPER: "bg-emerald-500/20 text-emerald-300",
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const isArabic = i18n.language === "ar";

  const links = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: "⊞" },
    { to: "/bugs",      label: t("nav.bugs"),      icon: "⬡" },
    { to: "/projects",  label: t("nav.projects"),  icon: "◫" },
  ];

  const adminLinks = [
    { to: "/admin/users", label: t("nav.users"), icon: "⊙" },
  ];

  return (
    <aside className="w-64 flex flex-col h-screen fixed top-0 start-0 bg-slate-900 border-e border-slate-800/60">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-base shadow-lg shadow-indigo-900/40">
            🐛
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">BugFlow</h1>
            <p className="text-xs text-slate-500">QA Bug Tracking</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2">
          {t("nav.dashboard")}
        </p>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            <span className="text-base opacity-80">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {user?.role === "ADMIN" && (
          <>
            <div className="pt-5 pb-2 px-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                {t("nav.admin")}
              </p>
            </div>
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <span className="text-base opacity-80">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-slate-800/60 space-y-1">

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 group"
        >
          <span className="flex items-center gap-3">
            <span className="text-base opacity-70">{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </span>
          <span className="text-xs bg-slate-800 group-hover:bg-slate-700 px-1.5 py-0.5 rounded transition-colors">
            {isDark ? "ON" : "OFF"}
          </span>
        </button>

        {/* Language switcher */}
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 group"
        >
          <span className="flex items-center gap-3">
            <span className="text-base opacity-70">🌐</span>
            <span>{isArabic ? "Switch to English" : "التبديل للعربية"}</span>
          </span>
          <span className="text-xs bg-slate-800 group-hover:bg-slate-700 px-1.5 py-0.5 rounded font-mono transition-colors">
            {isArabic ? "EN" : "AR"}
          </span>
        </button>

        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800/50 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/80 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleColors[user?.role ?? "TESTER"]}`}>
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            title={t("nav.logout")}
            className="text-slate-500 hover:text-rose-400 transition-colors text-lg leading-none"
          >
            →
          </button>
        </div>
      </div>
    </aside>
  );
};
