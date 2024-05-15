import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, TextField, Button } from "@mui/material";
import { useUserAuth } from "../context/UserAuthContext";

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useUserAuth();
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRe =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const handleOnChangeName = (e) => {
    const { value } = e.target;
    setName(value);
    if (value.length >= 2) {
      setNameErr("");
    }
  };

  const handleOnChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (value.toLowerCase().match(emailRe)) {
      setEmailErr("");
    }
  };

  const handleOnChangePass = (e) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length >= 6) {
      setPassErr("");
    }
  };

  const isFormValid = async () => {
    let isValid = true;

    if (name.length < 2) {
      setNameErr("Must be more than 2 characters");
      if (isValid) {
        isValid = false;
      }
    }

    if (!email.toLowerCase().match(emailRe)) {
      setEmailErr("Enter valid email");
      if (isValid) {
        isValid = false;
      }
    }

    if (password.length < 6) {
      setPassErr("Should be at least 6 characters");
      if (isValid) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await isFormValid();
      if (result) {
        await signUp(email, password, name);
        navigate("/profile");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <p>Sign Up</p>
      <form onSubmit={handleOnSubmit}>
        <div>
          <TextField
            required
            error={nameErr}
            helperText={nameErr}
            label="Name"
            id="outlined-size-small"
            value={name}
            onChange={handleOnChangeName}
            size="small"
            margin="dense"
          />
        </div>
        <div>
          <TextField
            required
            error={emailErr}
            helperText={emailErr}
            label="Email"
            id="outlined-size-small"
            value={email}
            onChange={handleOnChangeEmail}
            size="small"
            margin="dense"
          />
        </div>
        <div>
          <TextField
            required
            error={passErr}
            helperText={passErr}
            label="Password"
            id="outlined-size-small"
            value={password}
            onChange={handleOnChangePass}
            size="small"
            margin="dense"
          />
        </div>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Sign Up
        </Button>
        <div className="p-4 box mt-3 text-center">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </form>
    </Container>
  );
};
