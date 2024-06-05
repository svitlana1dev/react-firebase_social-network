import { FC, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_POSTS } from "../graphql/queries";
import { Box, Button, Card, Grid } from "@mui/material";
import { PostContent } from "../components/Post/PostContent";
import { SelectField } from "../components/SelectField/SelectField";
import { PostSkeleton } from "../components/Skeleton/PostSkeleton";
import { Search } from "../components/Search/Search";

export const Home: FC = () => {
  const [limit, setLimit] = useState(1);
  const [offset, setOffset] = useState(0);
  const [allData, setAllData] = useState<any[]>([]);
  const [getAllPosts, { loading }] = useLazyQuery(GET_ALL_POSTS);

  const limits = [
    { value: "1", title: "1" },
    { value: "3", title: "3" },
    { value: "0", title: "All" },
  ];

  const handleGetAllPosts = async (
    querySearch: string,
    limit: number,
    offset: number
  ) => {
    try {
      const { data } = await getAllPosts({
        variables: {
          querySearch,
          limit,
          offset,
        },
        fetchPolicy: "network-only",
      });

      const { posts } = data.getAllPosts || [];

      if (querySearch.length > 1) {
        setAllData(posts);
        return;
      }

      if (posts.length > 0) {
        setAllData((prev) => [...prev, ...posts]);
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleGetAllPosts("", limit, offset);
  }, []);

  const handleGetLimit = (newLimit: string) => {
    handleGetAllPosts("", +newLimit, offset);
    setLimit(+newLimit);
  };

  const handleShowMore = () => {
    handleGetAllPosts("", limit, offset + limit);
    setOffset((prev) => prev + limit);
  };

  const handleSearch = (searchQuery: string) => {
    handleGetAllPosts(searchQuery, limit, offset);
  };

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box sx={{ maxWidth: 100 }}>
          <SelectField getValue={handleGetLimit} values={limits} />
        </Box>

        <Search onSearch={handleSearch} />
      </Box>

      <Grid container spacing={2} mt={3}>
        {allData.length > 0 &&
          allData.map((post: any) => {
            return (
              <Grid item xs={4} key={post.id}>
                <Card>
                  <PostContent post={post} />
                </Card>
              </Grid>
            );
          })}
      </Grid>

      {loading && (
        <Grid container spacing={2} mt={3}>
          <Grid item xs={4}>
            <PostSkeleton />
          </Grid>
        </Grid>
      )}

      {limit > 0 && (
        <Button variant="text" onClick={handleShowMore}>
          Show more
        </Button>
      )}
    </>
  );
};
