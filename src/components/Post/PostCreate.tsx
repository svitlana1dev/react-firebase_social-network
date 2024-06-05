import { FC, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { CREATE_POST, EDIT_POST } from "../../graphql/mutations";
import { useParams } from "react-router-dom";

type Props = {
  setNewPost: (arg: any) => void;
  edit?: boolean;
  currentTitle?: string;
  currentDescription?: string;
};

export const PostCreate: FC<Props> = ({
  setNewPost,
  edit,
  currentTitle = "",
  currentDescription = "",
}) => {
  const { id } = useParams();
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [createPost, { data, error, loading }] = useMutation(CREATE_POST);
  const [editPost, { data: dataPost, error: errorPost, loading: loadingPost }] =
    useMutation(EDIT_POST);

  const handleCreatePost = async () => {
    try {
      if (edit) {
        const { data } = await editPost({
          variables: {
            id: id,
            title: title,
            description: description,
          },
        });

        setNewPost(data.editPost);
      } else {
        const { data } = await createPost({
          variables: {
            title: title,
            description: description,
          },
        });
        setNewPost(data.createPost);
      }
    } catch (err) {}
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"flex-start"}
      gap={2}
      mt={3}
    >
      <FormControl style={{ width: "100%" }}>
        <TextField
          label="Title"
          multiline
          rows={1}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          style={{ width: "40%", marginBottom: "10px" }}
        />

        <TextField
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </FormControl>

      <Button variant="contained" onClick={handleCreatePost} disabled={loading}>
        {loading ? <CircularProgress color="inherit" size={25} /> : "Save"}
      </Button>
    </Box>
  );
};
