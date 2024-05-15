import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { useUserAuth } from "../context/UserAuthContext";

export const Header = () => {
  const { logOut } = useUserAuth();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/signin">Signin</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              onClick={() => logOut()}
            >
              Log out
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
