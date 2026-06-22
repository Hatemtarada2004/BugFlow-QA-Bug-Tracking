import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BugsListPage } from "./pages/bugs/BugsListPage";
import { BugDetailPage } from "./pages/bugs/BugDetailPage";
import { BugFormPage } from "./pages/bugs/BugFormPage";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { Spinner } from "./components/ui/Spinner";

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bugs" element={<BugsListPage />} />
        <Route path="/bugs/new" element={<BugFormPage />} />
        <Route path="/bugs/:id" element={<BugDetailPage />} />
        <Route path="/bugs/:id/edit" element={<BugFormPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
