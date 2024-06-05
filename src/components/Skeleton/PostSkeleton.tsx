import { FC } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/material";

export const PostSkeleton: FC = () => {
  return (
    <>
      <Skeleton variant="rectangular" width="100%" height={118} />

      <Box sx={{ pt: 0.5 }}>
        <Skeleton />
        <Skeleton width="70%" />
      </Box>
    </>
  );
};
