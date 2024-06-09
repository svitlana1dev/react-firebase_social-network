import { FC, useState } from "react";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import DeleteIcon from "@mui/icons-material/Delete";
import { CREATE_POST, EDIT_POST } from "../../graphql/mutations";
import { UploadFile } from "../UploadFile/UploadFile";
import { storage } from "../../firebase";

type Props = {
  setNewPost: (arg: any) => void;
  edit?: boolean;
  currentImg?: string;
  currentTitle?: string;
  currentDescription?: string;
};

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const PostCreate: FC<Props> = ({
  setNewPost,
  edit,
  currentImg = null,
  currentTitle = "",
  currentDescription = "",
}) => {
  const { id } = useParams();
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImg);
  const [imageLoading, setImageUrlLoading] = useState(false);
  const [createPost, { loading }] = useMutation(CREATE_POST);

  const [editPost, {}] = useMutation(EDIT_POST);

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
            photoURL: imageUrl,
          },
        });

        (await !loading) && setNewPost(data.createPost);
      }
    } catch (err) {}
  };

  const handleUpload = async (file: any, fileName: string, type: string) => {
    setImageUrlLoading(true);
    const storageRef = ref(storage, fileName);
    try {
      const base64 = await toBase64(file);

      if (typeof base64 === "string") {
        const metadata = {
          contentType: type,
        };

        const strImage = base64.replace(/^data:image\/[a-z]+;base64,/, "");
        const snapshot = await uploadString(
          storageRef,
          strImage,
          "base64",
          metadata
        );
        getDownloadURL(snapshot.ref).then((url) => {
          setImageUrl(url);
          setImageUrlLoading(false);
        });
      }
    } catch (err) {}
  };

  const handleDeleteFile = () => {
    if (imageUrl) {
      const httpsReference = ref(storage, imageUrl);

      deleteObject(httpsReference)
        .then(() => {
          setTimeout(() => {
            setImageUrl(null);
          }, 0);
        })
        .catch(() => {});

      setImageUrl("");
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"flex-start"}
      gap={2}
      mt={3}
    >
      {!imageUrl ? (
        <UploadFile onHandleUpload={handleUpload} loading={imageLoading} />
      ) : (
        <Button
          onClick={handleDeleteFile}
          variant="outlined"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      )}

      {imageUrl && (
        <CardMedia
          component="img"
          height="auto"
          image={imageUrl}
          alt={"uploaded image"}
        />
      )}

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

      <Button
        variant="contained"
        onClick={handleCreatePost}
        disabled={loading || imageLoading}
      >
        {loading ? <CircularProgress color="inherit" size={25} /> : "Save"}
      </Button>
    </Box>
  );
};
