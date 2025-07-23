import { Outlet, Sidebar, Navbar } from "../shared/imports";

const AuthLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='p-4 w-full overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
