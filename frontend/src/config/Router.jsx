import {
  Outlet,
  Navigate,
  Routes,
  Route,
  MainLayout,
  Home,
  Register,
  Login,
  AuthLayout,
  Dashboard,
  AppliedJobs,
  Settings,
  Profile,
} from "../shared/imports";

const AuthRoutes = () => {
  const user = localStorage.getItem("user");
  return user !== null ? <Outlet /> : <Navigate to='/' />;
};

const PublicRoutes = () => {
  const user = localStorage.getItem("user");
  return user ? <Navigate to='/dashboard' /> : <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      {/* Public routes wrapped with PublicRoutes */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route element={<PublicRoutes />}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Route>

      {/* Protected routes with sidebar */}
      <Route element={<AuthRoutes />}>
        <Route element={<AuthLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/applied-jobs' element={<AppliedJobs />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
