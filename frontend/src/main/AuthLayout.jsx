import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthLayout = () => {

  return (
    <div className="flex flex-col">
      <Navbar/>
      <div className="flex">
        <Sidebar/>
        <div className="p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
