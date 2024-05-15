import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { Header } from "./Header";

export const ProtectedRoutes = () => {
  const { user, logOut } = useUserAuth();

  useEffect(() => {
    // logOut();
    if (user && Object.keys(user).length === 0) {
      setTimeout(() => {
        console.log(user);
      }, 500);
    }
  }, []);

  return (
    <>
      {user && Object.keys(user).length === 0 && <p>Loading...</p>}
      {user && Object.keys(user).length > 0 && (
        <>
          <Header />
          <Outlet />
        </>
      )}
      {!user && <Navigate to="/signup" />}
    </>
  );
};
