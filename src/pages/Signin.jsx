import { useState } from "react";
import { Container, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export const Signin = () => {
  const navigate = useNavigate();
  const { logIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await logIn(email, password);
      console.log(result);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <p>Sign In</p>
      <form onSubmit={handleOnSubmit}>
        <div>
          <TextField
            label="Email"
            id="outlined-size-small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            margin="dense"
          />
        </div>
        <div>
          <TextField
            label="Password"
            id="outlined-size-small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            margin="dense"
          />
        </div>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Ok
        </Button>
      </form>
    </Container>
  );
};
