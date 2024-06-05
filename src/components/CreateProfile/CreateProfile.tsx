import { FC, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { User } from "firebase/auth";

import { CREATE_PROFILE, EDIT_PROFILE } from "../../graphql/mutations";
import { useUserAuth, userAuthContext } from "../../context/UserAuthContext";

type Props = {
  setNewProfile: (arg: User) => void;
  edit?: boolean;
  currentName?: string;
  currentBio?: string;
};

export const CreateProfile: FC<Props> = ({
  setNewProfile,
  edit,
  currentName = "",
  currentBio = "",
}) => {
  const { user } = useUserAuth() as userAuthContext;
  const [secondName, setSecondName] = useState(currentName);
  const [bio, setBio] = useState(currentBio);
  const [createProfile, { data, error, loading }] = useMutation(CREATE_PROFILE);
  const [editProfile, { loading: editing }] = useMutation(EDIT_PROFILE);
  const btnTitle = edit ? "Edit" : "Create profile";

  const handleCreateProfile = async () => {
    try {
      if (!Boolean(edit)) {
        const { data } = await createProfile({
          variables: {
            secondName: secondName,
            bio: bio,
          },
        });

        setNewProfile(data.createProfile);
      } else if (Boolean(edit)) {
        const { data } = await editProfile({
          variables: {
            id: user.uid,
            secondName: secondName,
            bio: bio,
          },
        });

        setNewProfile(data.editProfile);
      }
    } catch (err) {}
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"flex-start"}
      gap={7}
    >
      <FormControl style={{ width: "100%" }}>
        <InputLabel htmlFor="component-outlined">Second name</InputLabel>

        <OutlinedInput
          id="component-outlined"
          label="Second name"
          value={secondName}
          onChange={(e) => setSecondName(e.target.value)}
          style={{ width: "40%", marginBottom: "10px" }}
        />

        <TextField
          label="About Me"
          multiline
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </FormControl>

      <Button
        variant="contained"
        onClick={handleCreateProfile}
        disabled={loading}
      >
        {loading || editing ? (
          <CircularProgress color="inherit" size={25} />
        ) : (
          btnTitle
        )}
      </Button>
    </Box>
  );
};
