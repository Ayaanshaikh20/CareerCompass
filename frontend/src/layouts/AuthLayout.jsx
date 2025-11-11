import { Outlet, Sidebar, Navbar } from "../shared/Imports";

const AuthLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='w-full overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
