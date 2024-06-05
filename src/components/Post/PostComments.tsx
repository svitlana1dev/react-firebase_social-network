import { FC, useState } from "react";
import { Avatar, Button, Grid } from "@mui/material";
import moment from "moment";
import { AccountCircle } from "@mui/icons-material";
import { Comment } from "../../types/commentType";
import { NavLink } from "react-router-dom";
import { TextArea } from "../TextArea/TextArea";
import {
  DELETE_COMMENT,
  EDIT_COMMENT,
  REPLY_TO_COMMENT,
} from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { AuthorActions } from "../Buttons/AuthorActions";
import { useUserAuth, userAuthContext } from "../../context/UserAuthContext";

type Props = {
  comment: Comment;
  postId?: string;
  isAnswer?: boolean;
  setNewAnswer?: (args: Comment) => void;
};

export const PostComments: FC<Props> = ({
  comment,
  postId,
  isAnswer,
  setNewAnswer,
}) => {
  const { user } = useUserAuth() as userAuthContext;
  const { id, authorPhoto, content } = comment;
  const [showAddAnswer, setShowAddAnswer] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [replyToComment, { loading }] = useMutation(REPLY_TO_COMMENT);
  const [deleteComment, {}] = useMutation(DELETE_COMMENT);
  const [editComment, { loading: editing }] = useMutation(EDIT_COMMENT);

  const handleAddAnswer = async (value: string) => {
    try {
      const { data } = await replyToComment({
        variables: { postId, content: value, commentId: id },
      });

      setNewAnswer && setNewAnswer(data.replyToComment);
      setShowAddAnswer(false);
    } catch (err) {}
  };

  const handleDelete = () => {
    deleteComment({
      variables: { commentId: id },
    });
  };

  const handleEdit = async (value: string) => {
    try {
      await editComment({
        variables: { commentId: id, content: value },
      });

      setTimeout(() => {
        setShowEdit(false);
      });
    } catch (err) {}
  };

  return (
    <>
      <Grid
        container
        wrap="nowrap"
        style={{ gap: "16px", alignItems: "flex-start" }}
      >
        {authorPhoto ? (
          <Avatar alt={authorPhoto} src={authorPhoto} />
        ) : (
          <AccountCircle />
        )}
        <Grid justifyContent="left" item xs zeroMinWidth>
          <NavLink to={`/profile/${comment.authorUid}`}>
            <h4 style={{ margin: 0, textAlign: "left", fontSize: "12px" }}>
              {comment.authorName}
            </h4>
          </NavLink>
          {showEdit && (
            <TextArea
              onSubmit={handleEdit}
              defaultValue={content}
              label={"Edit comment"}
              isDisabled={editing}
            />
          )}
          {!showEdit && (
            <p style={{ textAlign: "left", fontSize: "12px" }}>{content}</p>
          )}
          <p style={{ textAlign: "left", color: "gray", fontSize: "8px" }}>
            {comment.updatedAt
              ? `Edited ${moment(comment.updatedAt).format("LLL")}`
              : moment(comment.createdAt).format("LLL")}
          </p>
        </Grid>

        {user.uid === comment.authorUid && (
          <AuthorActions
            callbackDelete={handleDelete}
            callbackEdit={() => setShowEdit(true)}
          />
        )}
      </Grid>
      {!isAnswer && (
        <>
          {showAddAnswer ? (
            <TextArea
              onSubmit={handleAddAnswer}
              isDisabled={loading}
              label={"Add comment"}
            />
          ) : (
            <Button
              onClick={() => setShowAddAnswer(true)}
              size="small"
              sx={{ fontSize: "10px", marginLeft: "35px" }}
              disabled={loading}
            >
              add answer
            </Button>
          )}
        </>
      )}
    </>
  );
};
