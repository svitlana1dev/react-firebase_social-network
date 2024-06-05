import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import {
  User as FirebaseUser,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URI,
});

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

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
