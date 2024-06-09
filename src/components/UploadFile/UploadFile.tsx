import { FC } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, CircularProgress, styled } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type Props = {
  onHandleUpload: (file: any, fileName: string, type: string) => void;
  loading: boolean;
};

export const UploadFile: FC<Props> = ({ onHandleUpload, loading }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onHandleUpload(
        e.target.files[0],
        e.target.files[0].name,
        e.target.files[0].type
      );
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={!loading && <CloudUploadIcon />}
    >
      {loading ? <CircularProgress color="inherit" size={25} /> : "Upload file"}
      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
    </Button>
  );
};
