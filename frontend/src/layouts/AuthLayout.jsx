import { Outlet, Sidebar, Navbar } from "../shared/imports";

const AuthLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className='flex'>
        {/* <Sidebar /> */}
        <div className='w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
