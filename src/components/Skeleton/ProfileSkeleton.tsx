import { FC } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Box, Grid } from "@mui/material";
import { PostSkeleton } from "./PostSkeleton";

export const ProfileSkeleton: FC = () => {
  return (
    <>
      <Box>
        <Box sx={{ width: 56, height: 56 }}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={56}
            height={56}
          />
        </Box>

        <Skeleton
          animation="wave"
          height={10}
          width="40%"
          style={{ marginTop: 3 }}
        />

        <Skeleton animation="wave" height={10} style={{ marginBottom: 2 }} />
      </Box>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={4}>
          <PostSkeleton />
        </Grid>
      </Grid>
    </>
  );
};
