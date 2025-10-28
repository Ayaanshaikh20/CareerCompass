import { Outlet, Navbar } from "../shared/imports";

const MainLayout = () => {
  return (
    <main className=" d-flex flex-col">
      <Navbar />
      <Outlet />
    </main>
  );
};

export default MainLayout;
