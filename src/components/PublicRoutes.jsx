import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export const PublicRoutes = ({ children }) => {
  const { user, logOut } = useUserAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return <>{!user ? children : <Navigate to="/" />}</>;
};
