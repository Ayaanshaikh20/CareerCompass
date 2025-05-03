import { Routes, Route, Navigate, Outlet } from "react-router";
import MainLayout from "../main/MainLayout";
import Home from "../pages/Home";
import Payment from "../pages/Payment";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../main/AuthLayout";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import AppliedJobs from "../pages/AppliedJobs";

const AuthRoutes = () => {
  const user = localStorage.getItem("user");
  return user !== null ? <Outlet /> : <Navigate to="/" />;
};

const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes with sidebar */}
      <Route element={<AuthRoutes />}>
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
