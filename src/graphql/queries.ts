import { gql } from "@apollo/client";

export const GET_POST = gql`
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

export const GET_PROFILE = gql`
  query GetProfile($id: String!) {
    getProfile(id: $id) {
      id
      firstName
      secondName
      bio
      photoURL
      posts {
        id
        authorUid
        authorName
        authorPhoto
        title
        description
        photoURL
        like
        dislike
        createdAt
        updatedAt
        commentsCount
      }
    }
  }
`;

export const GET_FILE = gql`
  query GetFile($fileName: String!) {
    getFile(fileName: $fileName)
  }
`;

export const GET_ALL_POSTS = gql`
  query GetAllPosts($querySearch: String!, $limit: Float!, $offset: Float!) {
    getAllPosts(
      input: { querySearch: $querySearch, limit: $limit, offset: $offset }
    ) {
      posts {
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
  }
`;

export const GET_COMMENTS = gql`
  query GetComments($id: String!) {
    getComments(postId: $id) {
      answersCount
      allAnswers {
        id
        authorUid
        authorName
        authorPhoto
        content
        createdAt
        updatedAt
      }
      id
      authorUid
      authorName
      authorPhoto
      content
      createdAt
      updatedAt
    }
  }
`;
