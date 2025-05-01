import React from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const AuthLayout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default AuthLayout;
