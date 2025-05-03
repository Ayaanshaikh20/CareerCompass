import React, { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthLayout = () => {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <Navbar/>
      {/* Sidebar and main content */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar/>
        {/* Main content */}
        <div className="p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
