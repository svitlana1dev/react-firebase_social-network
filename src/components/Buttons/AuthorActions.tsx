import { FC, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

type Props = {
  callbackDelete: () => void;
  callbackEdit: () => void;
};

export const AuthorActions: FC<Props> = ({ callbackDelete, callbackEdit }) => {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleShowModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    callbackEdit();
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const result = await callbackDelete();
      setDeleted(Boolean(result));
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (err) {
      setOpen(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleEdit} aria-label="settings">
        <EditIcon />
      </IconButton>
      <IconButton onClick={handleShowModal} aria-label="settings">
        <DeleteOutlineIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={handleShowModal}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          {!deleted ? (
            <>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
              >
                Are you sure to delete this item?
              </Typography>
              <ButtonGroup>
                <Button
                  onClick={handleDelete}
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                >
                  Delete
                </Button>

                <Button onClick={handleShowModal} variant="contained">
                  Cancel
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              Item deleted
            </Alert>
          )}
        </Box>
      </Modal>
    </>
  );
};
