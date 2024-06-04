import { FC, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
    <FormControl fullWidth>
      <Select value={value} onChange={handleChange}>
        {values.map(({ value, title }) => {
          return (
            <MenuItem key={value} value={value}>
              {title}
            </MenuItem>
          );
        })}
        {/* <MenuItem value={1}>1</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={0}>All</MenuItem> */}
      </Select>
    </FormControl>
  );
};
