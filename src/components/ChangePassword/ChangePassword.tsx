import { FC, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { updatePassword } from "firebase/auth";
import { useUserAuth, userAuthContext } from "../../context/UserAuthContext";

export const ChangePassword: FC = () => {
  const { user, logIn } = useUserAuth() as userAuthContext;
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurPass, setShowCurPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [errorCur, setErrorCur] = useState("");
  const [success, setSuccess] = useState(false);

  const isFormValid = async () => {
    let isValid = true;
    if (password.length < 6) {
      setError("Should be at least 6 characters");
      if (isValid) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handleShowPassword = () => {
    setShowPass((prev) => !prev);
  };

  const handleShowCurPassword = () => {
    setShowCurPass((prev) => !prev);
  };

  const handleOnChangePass = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length >= 6) {
      setError("");
    }
  };

  const handleMouseDownPassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
  };

  const addNewPassword = () => {
    updatePassword(user, password)
      .then(async () => {
        await logIn(user.email, password);

        setLoading(false);
        setPassword("");
        setCurrentPassword("");
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      })
      .catch((err: any) => {
        setError(err.message);
      });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await isFormValid();

      if (result) {
        try {
          await logIn(user.email, currentPassword);
          addNewPassword();
        } catch (err) {
          setErrorCur("password not correct");
          setLoading(false);
        }
      }
    } catch (err) {}
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <h2>ChangePassword</h2>
      <form
        onSubmit={handleOnSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {success && <Typography>Password updates</Typography>}

        <FormControl
          sx={{ m: "1, 0", width: "100%" }}
          variant="outlined"
          margin="dense"
          error={Boolean(errorCur)}
        >
          <InputLabel htmlFor="password" size="small">
            Current Password
          </InputLabel>

          <OutlinedInput
            type={showCurPass ? "text" : "password"}
            onChange={(e) => setCurrentPassword(e.target.value)}
            size="small"
            id="current-password"
            label="Current-Password"
            value={currentPassword}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowCurPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showCurPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>{errorCur}</FormHelperText>
        </FormControl>

        <FormControl
          sx={{ m: "1, 0", width: "100%" }}
          variant="outlined"
          margin="dense"
          error={Boolean(error)}
        >
          <InputLabel htmlFor="password" size="small">
            New Password
          </InputLabel>

          <OutlinedInput
            type={showPass ? "text" : "password"}
            onChange={handleOnChangePass}
            size="small"
            id="password"
            label="Password"
            value={password}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>{error}</FormHelperText>
        </FormControl>

        <Button variant="contained" type="submit" sx={{ mt: 2, mb: 4 }}>
          {loading ? <CircularProgress color="inherit" size={25} /> : "Save"}
        </Button>
      </form>
    </Box>
  );
};
