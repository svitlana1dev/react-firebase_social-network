import { FC } from "react";
import { Container } from "@mui/material";
import { ChangePassword } from "../components/ChangePassword/ChangePassword";

export const UserSettings: FC = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
      }}
    >
      <ChangePassword />
    </Container>
  );
};
