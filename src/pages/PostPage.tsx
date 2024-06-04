import { FC, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { NavLink, useParams } from "react-router-dom";
import { Container } from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useUserAuth, userAuthContext } from "../context/UserAuthContext";
import { Post } from "../components/Post/Post";

const GET_POST = gql`
  query GetPost($id: String!) {
    getPostById(postId: $id) {
      id
      authorUid
      authorName
      authorPhoto
      title
      description
      createdAt
      updatedAt
      photoURL
      like
      dislike
      commentsCount
    }
  }
`;

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
