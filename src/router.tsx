import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignUpOrIn } from "./pages/SignUpOrIn";
import { Profile } from "./pages/Profile";
import { PostPage } from "./pages/PostPage";
import { ProtectedRoutes } from "./components/Routes/ProtectedRoutes";
import { PublicRoutes } from "./components/Routes/PublicRoutes";
import { PageNotFound } from "./pages/PageNotFound";

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
        path: "profile/:id",
        Component() {
          return <Profile />;
        },
      },
      {
        path: "post/:id",
        Component() {
          return <PostPage />;
        },
      },
      {
        path: "*",
        Component() {
          return <PageNotFound />;
        },
      },
    ],
  },
  {
    path: "/signup",
    Component() {
      return (
        <PublicRoutes>
          <SignUpOrIn signup />
        </PublicRoutes>
      );
    },
  },
  {
    path: "/signin",
    Component() {
      return (
        <PublicRoutes>
          <SignUpOrIn signin />
        </PublicRoutes>
      );
    },
  },
]);
