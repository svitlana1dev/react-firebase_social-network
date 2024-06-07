import { gql } from "@apollo/client";

export const CREATE_PROFILE = gql`
  mutation CreateProfile($secondName: String, $bio: String) {
    createProfile(input: { secondName: $secondName, bio: $bio }) {
      id
      firstName
      secondName
      bio
      photoURL
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation EditProfile($id: ID, $secondName: String, $bio: String) {
    editProfile(input: { id: $id, secondName: $secondName, bio: $bio }) {
      id
      firstName
      secondName
      bio
      photoURL
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser
  }
`;
// type FileMetadata {
//   lastModified: Int
//   lastModifiedDate: String
//   name: String
//   size: Int
//   type: String
//   webkitRelativePath: String
// }
export const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $description: String!
    $photoURL: String
  ) {
    createPost(
      input: { title: $title, description: $description, photoURL: $photoURL }
    ) {
      id
      authorUid
      authorName
      title
      description
      createdAt
      authorPhoto
      photoURL
    }
  }
`;

export const EDIT_POST = gql`
  mutation EditPost($id: ID!, $title: String!, $description: String!) {
    editPost(input: { id: $id, title: $title, description: $description }) {
      id
      authorUid
      authorName
      title
      description
      updatedAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikedPost($id: String!) {
    likedPost(postId: $id)
  }
`;

export const DISLIKE_POST = gql`
  mutation DislikedPost($id: String!) {
    dislikedPost(postId: $id)
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: String!) {
    deletePost(postId: $id) {
      id
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: String!, $content: String!) {
    addComment(input: { postId: $postId, content: $content }) {
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

export const REPLY_TO_COMMENT = gql`
  mutation ReplyToComment(
    $postId: String!
    $content: String!
    $commentId: String!
  ) {
    replyToComment(
      postInput: { postId: $postId, content: $content, commentId: $commentId }
    ) {
      id
      authorUid
      authorName
      authorPhoto
      commentId
      content
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`;

export const EDIT_COMMENT = gql`
  mutation EditComment($content: String!, $commentId: String) {
    editComment(postInput: { content: $content, commentId: $commentId })
  }
`;

export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: { file: $file })
    # id
    # url
    # }
  }
`;
