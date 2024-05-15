import { RouterProvider } from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { router } from "./router";
import "./App.css";

function App() {
  return (
    <UserAuthContextProvider>
      <RouterProvider
        router={router}
        fallbackElement={<p>Loading...</p>}
        context={{ isAuth: false }}
      />
    </UserAuthContextProvider>
  );
}

export default App;
