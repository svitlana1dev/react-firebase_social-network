import { FC, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box, Skeleton, Typography } from "@mui/material";
import { Comment } from "../../types/commentType";
import { PostComments } from "./PostComments";
import { PostsSkeleton } from "../Skeleton/PostsSkeleton";
import { GET_COMMENTS } from "../../graphql/queries";
import { ADD_COMMENT } from "../../graphql/mutations";
import { TextArea } from "../TextArea/TextArea";
import { PostContent } from "./PostContent";

type Props = {
  post: any;
  errorPost: any;
  loadingPost: any;
  isSingle?: boolean;
};

type getComments = {
  getComments: Comment[];
};

export const Post: FC<Props> = ({ post, errorPost, loadingPost }) => {
  const [newAnswer, setNewAnswer] = useState<Comment | null>(null);
  const { loading, data } = useQuery<getComments>(GET_COMMENTS, {
    variables: {
      id: post?.id,
    },
  });

  const [addComment, { loading: addingNewComment, data: newComment }] =
    useMutation(ADD_COMMENT);

  const comments = data?.getComments || [];
  const addedComment = newComment?.addComment || {};

  const handleAddComment = (value: string) => {
    addComment({ variables: { postId: post.id, content: value } });
  };

  const getNewAnswer = (answer: Comment) => {
    setNewAnswer(answer);
  };

  return (
    <>
      {loadingPost && <PostsSkeleton />}
      <Card sx={{ maxWidth: "100%", m: "auto" }}>
        {post && (
          <>
            <PostContent post={post} isSingle />

            <CardContent>
              <TextArea onSubmit={handleAddComment} />

              {(loading || addingNewComment) && (
                <>
                  <Skeleton
                    animation="wave"
                    height={30}
                    style={{ marginBottom: 10 }}
                  />

                  <Skeleton
                    animation="wave"
                    height={20}
                    style={{ marginBottom: 10 }}
                  />
                </>
              )}

              {Object.keys(addedComment).length > 0 && (
                <PostComments
                  key={addedComment.id}
                  comment={addedComment}
                  postId={post.id}
                  isAnswer
                />
              )}

              {comments &&
                comments.length > 0 &&
                comments.map((comment: Comment) => {
                  const { allAnswers } = comment;
                  return (
                    <Box sx={{ marginBottom: "20px" }} key={comment.id}>
                      <PostComments
                        comment={comment}
                        postId={post.id}
                        setNewAnswer={getNewAnswer}
                      />

                      {newAnswer && newAnswer.commentId === comment.id && (
                        <Box sx={{ marginLeft: "40px" }}>
                          <PostComments
                            postId={newAnswer.id}
                            key={newAnswer.id}
                            comment={newAnswer}
                            isAnswer
                          />
                        </Box>
                      )}
                      {allAnswers &&
                        allAnswers?.length > 0 &&
                        allAnswers.map((answer: Comment) => {
                          return (
                            <Box sx={{ marginLeft: "40px" }} key={answer.id}>
                              <PostComments
                                postId={post.id}
                                comment={answer}
                                isAnswer
                              />
                            </Box>
                          );
                        })}
                    </Box>
                  );
                })}
            </CardContent>
          </>
        )}

        {errorPost && <Typography>Post not found</Typography>}
      </Card>
    </>
  );
};
