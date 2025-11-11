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
} from "../shared/Imports";

const AuthRoutes = () => {
  const user = localStorage.getItem("user");
  return user !== null ? <Outlet /> : <Navigate to='/login' />;
};

const PublicRoutes = () => {
  const user = localStorage.getItem("user");
  return user ? <Navigate to='/dashboard' /> : <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route
        path="/"
        element={
          localStorage.getItem("user") ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Public routes wrapped with PublicRoutes */}
      <Route element={<MainLayout />}>
        <Route element={<PublicRoutes />}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Route>
      {/* Protected routes with sidebar */}
      <Route element={<AuthRoutes />}>
        <Route element={<AuthLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
