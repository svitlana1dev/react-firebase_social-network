import { FC } from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { Post } from "../components/Post/Post";
import { GET_POST } from "../graphql/queries";

export const PostPage: FC = () => {
  const { id } = useParams();

  const {
    data: { getPostById: post } = {},
    error,
    loading,
  } = useQuery(GET_POST, {
    variables: {
      id,
    },
  });

  return (
    <Container>
      <Post post={post} errorPost={error} loadingPost={loading} isSingle />
    </Container>
  );
};
