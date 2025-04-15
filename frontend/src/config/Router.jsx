import { Routes, Route, Navigate, Outlet } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';

const router = () => {
  // Authenticate Routes
  const AuthRoutes = () => {
    // get session data
    const userId = localStorage.getItem('userId');
    return userId !== null ? <Outlet /> : <Navigate to={'/'} />;
  };

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      {/* <Route element={<MainLayout />}>
        <Route exact element={<AuthRoutes />}>
        </Route>
      </Route> */}
    </Routes>
  );
};

export default router;