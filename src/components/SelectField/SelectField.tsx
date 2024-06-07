import { FC, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

type Props = {
  getValue: (arg: string) => void;
  values: {
    value: string;
    title: string | number;
  }[];
};

export const SelectField: FC<Props> = ({ getValue, values }) => {
  const [value, setValue] = useState(values[0].value);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setValue(e.target.value);
    getValue(e.target.value);
  };

  return (
    <FormControl sx={{ boxShadow: 1, borderRadius: "4px" }} fullWidth>
      <Select
        sx={{
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { border: 0 },
        }}
        size={"small"}
        value={value}
        onChange={handleChange}
      >
        {values.map(({ value, title }) => {
          return (
            <MenuItem key={value} value={value}>
              {title}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
