import { Link, useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">

        {/* Animated bug icon */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center text-5xl mx-auto shadow-xl shadow-indigo-900/20">
            🐛
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
            ?
          </div>
        </div>

        {/* 404 number */}
        <h1 className="text-8xl font-black text-slate-200 leading-none mb-2 select-none">
          404
        </h1>

        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Page not found
        </h2>

        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Looks like this bug escaped into the void. The page you're looking for
          doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-900/20"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            ← Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-semibold">
            Quick links
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/bugs",     label: "Bug List" },
              { to: "/projects", label: "Projects" },
              { to: "/dashboard", label: "Dashboard" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
