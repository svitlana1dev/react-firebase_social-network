import { ReactNode, FC } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth, userAuthContext } from "../../context/UserAuthContext";

type Props = {
  children: ReactNode;
};

export const PublicRoutes: FC<Props> = ({ children }) => {
  const { user, logOut } = useUserAuth() as userAuthContext;

  return <>{!user ? children : <Navigate to="/" />}</>;
};
