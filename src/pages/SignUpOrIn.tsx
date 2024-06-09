import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUserAuth, userAuthContext } from "../context/UserAuthContext";

type Props = {
  signup?: boolean;
  signin?: boolean;
};

export const SignUpOrIn: FC<Props> = ({ signup, signin }) => {
  const navigate = useNavigate();
  const { logIn, signUp, googleSignIn } = useUserAuth() as userAuthContext;
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const emailRe =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const handleClickShowPassword = () => setShowPass((prev) => !prev);

  const handleMouseDownPassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
  };

  const handleOnChangeName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setName(value);
    if (value.length >= 2) {
      setNameErr("");
    }
  };

  const handleOnChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEmail(value);
    if (value.toLowerCase().match(emailRe)) {
      setEmailErr("");
    }
  };

  const handleOnChangePass = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length >= 6) {
      setPassErr("");
    }
  };

  const isFormValid = async () => {
    let isValid = true;

    if (signup && name.length < 2) {
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

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await isFormValid();
      if (result) {
        if (signup) {
          await signUp(email, password, name);
        } else if (signin) {
          await logIn(email, password);
        }
      }
      navigate("/");
    } catch (err: any) {}
  };

  const handleSignupGoogle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    googleSignIn();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography>{signup ? "Sign Up" : "Sign In"}</Typography>

        <form
          onSubmit={handleOnSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {signup && (
            <TextField
              required
              error={Boolean(nameErr)}
              helperText={nameErr}
              id="name"
              label="Name"
              value={name}
              onChange={handleOnChangeName}
              size="small"
              margin="dense"
            />
          )}

          <TextField
            required
            error={Boolean(nameErr)}
            helperText={emailErr}
            id="email"
            label="Email"
            value={email}
            onChange={handleOnChangeEmail}
            size="small"
            margin="dense"
          />

          <FormControl
            sx={{ m: "1, 0", width: "100%" }}
            variant="outlined"
            margin="dense"
            error={Boolean(passErr)}
          >
            <InputLabel htmlFor="password" size="small">
              Password
            </InputLabel>

            <OutlinedInput
              type={showPass ? "text" : "password"}
              onChange={handleOnChangePass}
              size="small"
              id="password"
              label="Password"
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{passErr}</FormHelperText>
          </FormControl>

          <Button variant="contained" type="submit" sx={{ mt: 2, mb: 4 }}>
            {signup && "Sign Up"}
            {signin && "Sign In"}
          </Button>

          {signup && (
            <>
              <Button onClick={handleSignupGoogle} variant="outlined">
                Sign Up with Google
              </Button>

              <Box>
                Already have an account? <Link to="/signin">Sign In</Link>
              </Box>
            </>
          )}

          {signin && (
            <Box>
              If you haven't an account <Link to="/signup">Sign Up</Link>
            </Box>
          )}
        </form>
      </Box>
    </Container>
  );
};
