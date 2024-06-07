import { FC, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Avatar, Box, Button, Card, Grid, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { User } from "firebase/auth";
import { AuthorActions } from "../components/Buttons/AuthorActions";
import { PostContent } from "../components/Post/PostContent";
import { ProfileSkeleton } from "../components/Skeleton/ProfileSkeleton";
import { CreateProfile } from "../components/CreateProfile/CreateProfile";
import { GET_PROFILE } from "../graphql/queries";
import { DELETE_USER } from "../graphql/mutations";
import { useUserAuth, userAuthContext } from "../context/UserAuthContext";
import { PostCreate } from "../components/Post/PostCreate";

export const Profile: FC = () => {
  const { id } = useParams();
  const { user } = useUserAuth() as userAuthContext;
  const [profile, setProfile] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [newPost, setNewPost] = useState<any>(null);
  const [showCreating, setShowCreating] = useState(false);
  const [getProfile, { error, loading }] = useLazyQuery(GET_PROFILE);
  const [deleteUser, {}] = useMutation(DELETE_USER);

  const getNewProfile = (profile: User) => {
    setProfile(profile);

    showEdit && setShowEdit(false);
  };
  console.log(user);
  useEffect(() => {
    getProfile({
      variables: {
        id,
      },
    }).then(({ data }) => data?.getProfile && setProfile(data.getProfile));
  }, []);

  const handleDeleteUser = async () => {
    try {
      await deleteUser();

      window.location.reload();
    } catch (err) {}
  };

  const getNewPost = (post: any) => {
    setNewPost(post);
    setShowCreating(false);
  };

  return (
    <>
      {loading && <ProfileSkeleton />}
      {!loading && profile && !showEdit && (
        <>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            mb={5}
          >
            <Box>
              <Box sx={{ width: 56, height: 56 }}>
                {profile.photoURL ? (
                  <Avatar
                    alt={profile.firstName}
                    src={profile.photoURL}
                    sx={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <AccountCircle sx={{ width: "100%", height: "100%" }} />
                )}
              </Box>

              <Box display={"flex"}>
                <Typography>{profile.firstName}</Typography>
                {profile.secondName && (
                  <Typography style={{ marginLeft: "5px" }}>
                    {profile.secondName}
                  </Typography>
                )}
              </Box>

              <Typography>{profile.bio}</Typography>
            </Box>

            <Box>
              {user.uid === profile.id && (
                <AuthorActions
                  callbackDelete={handleDeleteUser}
                  callbackEdit={() => setShowEdit(true)}
                />
              )}
            </Box>
          </Box>

          {user.uid === profile.id && (
            <Button
              onClick={() => setShowCreating(true)}
              variant="contained"
              sx={{ mb: 4 }}
            >
              Add post
            </Button>
          )}
          {showCreating && <PostCreate setNewPost={getNewPost} />}

          {newPost && (
            <Grid item xs={4} key={newPost.id}>
              <Card>
                <PostContent post={newPost} onProfile />
              </Card>
            </Grid>
          )}

          <Grid container spacing={2} mt={3}>
            {profile.posts &&
              profile.posts.map((post: any) => {
                return (
                  <Grid item xs={4} key={post.id}>
                    <Card>
                      <PostContent post={post} onProfile />
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}

      {error && !profile && <CreateProfile setNewProfile={getNewProfile} />}
      {showEdit && (
        <CreateProfile
          edit
          setNewProfile={getNewProfile}
          currentName={profile.secondName}
          currentBio={profile.bio}
        />
      )}
    </>
  );
};
