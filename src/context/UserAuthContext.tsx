import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase";

export type userAuthContext = {
  // user: FirebaseUser | {};
  user: any;
  logIn: (email: string, password: string) => any;
  signUp: (email: string, password: string, displayName: string) => any;
  logOut: () => any;
  googleSignIn: () => any;
};

const userAuthContext = createContext<userAuthContext | null>(null);

type Props = {
  children: ReactNode;
};

export const UserAuthContextProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | {}>({});

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(userCred.user, {
        displayName,
      });
    } catch (err) {}
  };
  const logOut = () => {
    return signOut(auth);
  };
  const googleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(() => currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(userAuthContext);
};
