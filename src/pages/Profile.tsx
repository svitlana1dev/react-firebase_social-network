import { FC, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { User, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../firebase";
import { AuthorActions } from "../components/Buttons/AuthorActions";
import { PostContent } from "../components/Post/PostContent";
import { ProfileSkeleton } from "../components/Skeleton/ProfileSkeleton";
import { CreateProfile } from "../components/CreateProfile/CreateProfile";
import { GET_PROFILE } from "../graphql/queries";
import { DELETE_USER } from "../graphql/mutations";
import { useUserAuth, userAuthContext } from "../context/UserAuthContext";
import { PostCreate } from "../components/Post/PostCreate";

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const Profile: FC = () => {
  const { id } = useParams();
  const { user } = useUserAuth() as userAuthContext;
  const [profile, setProfile] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [newPost, setNewPost] = useState<any>(null);
  const [showCreating, setShowCreating] = useState(false);
  const [getProfile, { error, loading }] = useLazyQuery(GET_PROFILE);
  const [deleteUser, {}] = useMutation(DELETE_USER);

  const getNewProfile = (profile: User) => {
    setProfile(profile);

    showEdit && setShowEdit(false);
  };

  useEffect(() => {
    getProfile({
      variables: {
        id,
      },
    }).then(({ data }) => {
      if (data?.getProfile) {
        setProfile(data.getProfile);
        setProfilePhoto(data.getProfile.photoURL);
      }
    });
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

  const handleChangePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const { name, type } = file;

      const storageRef = ref(storage, name);

      try {
        const base64 = await toBase64(file);

        if (typeof base64 === "string") {
          const metadata = {
            contentType: type,
          };

          const strImage = base64.replace(/^data:image\/[a-z]+;base64,/, "");
          const snapshot = await uploadString(
            storageRef,
            strImage,
            "base64",
            metadata
          );

          let newUrl: string;
          await getDownloadURL(snapshot.ref).then((url) => {
            newUrl = url;
            updateProfile(user, {
              photoURL: url,
            })
              .then(() => {
                setProfilePhoto(newUrl);
              })
              .catch(() => {});
          });
        }
      } catch (err) {}
    }
  };
  console.log(user);
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
              <Box display={"flex"} sx={{ width: 56, height: 56 }}>
                {profilePhoto ? (
                  <Avatar
                    alt={profile.firstName}
                    src={profilePhoto}
                    sx={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <AccountCircle sx={{ width: "100%", height: "100%" }} />
                )}
                {user.uid === profile.id && (
                  <Button
                    style={{
                      background: "transparent",
                      color: "#000",
                      boxShadow: "none",
                      minWidth: "20px",
                      height: "30px",
                    }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                  >
                    {loading ? (
                      <CircularProgress color="inherit" size={25} />
                    ) : (
                      <AddAPhotoIcon />
                    )}
                    <input
                      style={{ height: "1", width: "1" }}
                      type="file"
                      onChange={handleChangePhoto}
                    />
                  </Button>
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
