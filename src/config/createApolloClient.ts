import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import {
  User as FirebaseUser,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { setContext } from "@apollo/client/link/context";
// import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URI,
});

const uploadLink = createUploadLink({ uri: process.env.REACT_APP_GRAPHQL_URL });

const authLink = setContext(async (_, { headers }) => {
  const auth = getAuth();
  const token = await new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then(resolve, reject);
      } else {
        resolve("");
      }
    });
  });
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// loadDevMessages();
// loadErrorMessages();

export const client = new ApolloClient({
  // link: ApolloLink.from([authLink, uploadLink, httpLink]),
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
