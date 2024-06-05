import { FC, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

type Props = {
  label?: string;
  onSubmit: (arg: string) => void;
  isDisabled?: boolean;
  defaultValue?: string;
};

export const TextArea: FC<Props> = ({
  label,
  onSubmit,
  isDisabled,
  defaultValue = "",
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      <TextField
        label={label}
        multiline
        rows={2}
        value={value}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        disabled={isDisabled}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isDisabled}
      >
        Add
      </Button>
    </Box>
  );
};
