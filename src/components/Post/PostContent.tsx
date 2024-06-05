import { FC, ReactNode, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { NavLink } from "react-router-dom";
import moment from "moment";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { AccountCircle } from "@mui/icons-material";
import { Box, FormControl, IconButton, TextField } from "@mui/material";
import { useUserAuth, userAuthContext } from "../../context/UserAuthContext";
import { DELETE_POST, DISLIKE_POST, LIKE_POST } from "../../graphql/mutations";
import { AuthorActions } from "../Buttons/AuthorActions";
import { PostCreate } from "./PostCreate";

type Props = {
  post: any;
  onProfile?: boolean;
  isSingle?: boolean;
};

type PostNavLinkProps = {
  to: string;
  disabled?: boolean;
  children: ReactNode;
};

const PostNavLink: FC<PostNavLinkProps> = ({ to, disabled, children }) => {
  return (
    <>
      {disabled ? (
        <span className="navlink-disabled">{children}</span>
      ) : (
        <NavLink to={to}>{children}</NavLink>
      )}
    </>
  );
};

export const PostContent: FC<Props> = ({ post, onProfile, isSingle }) => {
  const { user } = useUserAuth() as userAuthContext;
  const [amIAuthor, setAmIAuthor] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [unfavorite, setUnfavorite] = useState(false);
  const [unfavoriteCount, setUnfavoriteCount] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  const [likedPost, { loading: loadingLikeData }] = useMutation(LIKE_POST);
  const [dislikedPost, { loading: loadingDislikeData }] =
    useMutation(DISLIKE_POST);

  const [deletePost, { loading: deletingPost }] = useMutation(DELETE_POST);

  useEffect(() => {
    if (post) {
      setAmIAuthor(post.authorUid === user.uid);
      if (post.like && post.like.includes(user.uid)) {
        setFavorite(true);
      }

      if (post?.dislike && post?.dislike.includes(user.uid)) {
        setUnfavorite(true);
      }

      setFavoriteCount(post.like?.length || 0);
      setUnfavoriteCount(post.dislike?.length || 0);
    }
  }, [post]);

  const handleFavorite = async () => {
    setFavorite((prev) => !prev);
    if (unfavorite) {
      setUnfavoriteCount((prev) => prev - 1);
      setUnfavorite(false);
    }
    setFavoriteCount((prev) => (favorite ? prev - 1 : prev + 1));
    try {
      await likedPost({ variables: { id: post.id } });
    } catch (err) {
      setFavorite((prev) => !prev);
    }
  };

  const handleUnfavorite = async () => {
    setUnfavorite((prev) => !prev);
    if (favorite) {
      setFavoriteCount((prev) => prev - 1);
      setFavorite(false);
    }
    setUnfavoriteCount((prev) => (unfavorite ? prev - 1 : prev + 1));

    try {
      await dislikedPost({ variables: { id: post.id } });
    } catch (err) {
      setUnfavorite((prev) => !prev);
    }
  };

  const handleDeletePost = async () => {
    return await deletePost({ variables: { id: post.id } });
  };

  const handleEditPost = () => {
    setShowEdit(true);
  };

  const getNewPost = (value: any) => {
    setShowEdit(false);
  };

  return (
    <>
      <PostNavLink
        to={`/profile/${post.authorUid}`}
        disabled={Boolean(onProfile)}
      >
        <CardHeader
          avatar={
            <Box sx={{ width: 56, height: 56 }}>
              {post.authorPhoto ? (
                <Avatar
                  alt={post.authorPhoto}
                  src={post.authorPhoto}
                  sx={{ width: "100%", height: "100%" }}
                />
              ) : (
                <AccountCircle sx={{ width: "100%", height: "100%" }} />
              )}
            </Box>
          }
          action={
            isSingle &&
            amIAuthor && (
              <AuthorActions
                callbackDelete={handleDeletePost}
                callbackEdit={handleEditPost}
              />
            )
          }
          title={post.authorName}
          subheader={
            post.updatedAt
              ? `Edited ${moment(post.updatedAt).format("LLL")}`
              : moment(post.createdAt).format("LLL")
          }
        />
      </PostNavLink>

      <PostNavLink to={`/post/${post.id}`}>
        {post.photoUrl && (
          <CardMedia
            component="img"
            height="auto"
            image={post.photoUrl}
            alt={post.title}
          />
        )}

        {showEdit ? (
          <PostCreate
            edit
            currentTitle={post.title}
            currentDescription={post.description}
            setNewPost={getNewPost}
          />
        ) : (
          <CardContent>
            <Typography variant="subtitle1" component="h3">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.description}
            </Typography>
          </CardContent>
        )}
      </PostNavLink>

      <CardActions style={{ justifyContent: "space-between" }} disableSpacing>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center">
            <IconButton
              aria-label="add to favorites"
              onClick={handleFavorite}
              disabled={loadingLikeData || loadingDislikeData}
            >
              {favorite ? (
                <FavoriteIcon sx={{ color: "#f50057" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant="subtitle2" color="text.secondary">
              {favoriteCount}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <IconButton
              aria-label="add to unfavorites"
              onClick={handleUnfavorite}
              disabled={loadingLikeData || loadingDislikeData}
            >
              {unfavorite ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
            </IconButton>
            <Typography variant="subtitle2" color="text.secondary">
              {unfavoriteCount}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <div
              style={{
                padding: "8px",
                display: "flex",
                color: "#757575",
              }}
            >
              <ChatBubbleOutlineIcon />
            </div>

            <Typography variant="subtitle2" color="text.secondary">
              {post.commentsCount}
            </Typography>
          </Box>
        </Box>
      </CardActions>
    </>
  );
};
