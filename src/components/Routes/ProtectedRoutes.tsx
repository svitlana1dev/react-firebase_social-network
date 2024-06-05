import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth, userAuthContext } from "../../context/UserAuthContext";
import { Header } from "../Header";

export const ProtectedRoutes: FC = () => {
  const { user } = useUserAuth() as userAuthContext;

  return (
    <>
      {user && Object.keys(user).length > 0 && (
        <>
          <Header />
        </>
      )}
      {!user && <Navigate to="/signup" />}
    </>
  );
};
