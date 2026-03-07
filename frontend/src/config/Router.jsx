import {
  Outlet,
  Navigate,
  Routes,
  Route,
  MainLayout,
  Register,
  Login,
  AuthLayout,
  Dashboard,
  Settings,
  Profile,
  NotFound,
  ForgotPassword,
  ResetPassword,
  Applications,
  Companies,
} from "../shared/Imports";

const AuthRoutes = () => {
  const user = localStorage.getItem("uid");
  return user !== null ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRoutes = () => {
  const user = localStorage.getItem("uid");
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={localStorage.getItem("uid") ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      {/* Public routes wrapped with PublicRoutes */}
      <Route element={<MainLayout />}>
        <Route element={<PublicRoutes />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>
      {/* Protected routes with sidebar */}
      <Route element={<AuthRoutes />}>
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
