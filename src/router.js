import { createBrowserRouter, redirect } from "react-router-dom";
import { Home } from "./pages/Home";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { PublicRoutes } from "./components/PublicRoutes";

export let router = createBrowserRouter([
  {
    path: "/",
    Component: ProtectedRoutes,
    children: [
      {
        index: true,
        Component() {
          return <Home />;
        },
      },
      {
        path: "profile",
        Component() {
          return <Profile />;
        },
      },
      {
        path: "*",
        Component() {
          return <p>404</p>;
        },
      },
    ],
  },
  {
    path: "/signup",
    Component() {
      return (
        <PublicRoutes>
          <Signup />
        </PublicRoutes>
      );
    },
  },
  {
    path: "/signin",
    Component() {
      return (
        <PublicRoutes>
          <Signin />
        </PublicRoutes>
      );
    },
  },
]);
