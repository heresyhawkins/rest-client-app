import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { handleFirebaseError } from "./firebase-error-handler.ts";

const firebaseConfig = {
  apiKey: import.meta.env['VITE_API_KEY'],
  authDomain: import.meta.env['VITE_AUTH_DOMAIN'],
  projectId: import.meta.env['VITE_PROJECT_ID'],
  storageBucket: import.meta.env['VITE_STORAGE_BUCKET'],
  messagingSenderId: import.meta.env['VITE_MESSAGE_SENDER_ID'],
  appId: import.meta.env['VITE_APP_ID']
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response.user;
  } catch (error) {
    handleFirebaseError(error);
  }
}

export const registerUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const user = response.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email,
      authProvider: 'local'
    });
    return user;
  } catch (error) {
    handleFirebaseError(error);
  }
}

export const logout = async () =>{
  try {
    await signOut(auth);
  } catch (error) {
    handleFirebaseError(error);
  }
}