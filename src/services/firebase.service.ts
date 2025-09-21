'use server';

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { handleFirebaseError } from './firebase-error-handler';
import { RequestData } from '@types';

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGE_SENDER_ID,
  appId: process.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response.user;
  } catch (error) {
    handleFirebaseError(error);
  }
};

export const registerUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = response.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email,
      authProvider: 'local',
    });
    return user;
  } catch (error) {
    handleFirebaseError(error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    handleFirebaseError(error);
  }
};

export const saveRequestData = async (
  userId: string,
  requestData: RequestData
) => {
  try {
    await addDoc(collection(db, 'requests'), {
      userId,
      latency: requestData.latency,
      status: requestData.status,
      timestamp: requestData.timestamp,
      method: requestData.method,
      requestSize: requestData.requestSize,
      responseSize: requestData.responseSize,
      errorType: requestData.errorType ?? null,
      url: requestData.url,
      headers: requestData.headers,
      body: requestData.body,
    });
  } catch (error) {
    handleFirebaseError(error);
  }
};

export const loadRequestData = async (userId: string) => {
  try {
    const q = query(collection(db, 'requests'), where('userId', '==', userId));

    const data = await getDocs(q);

    return data.docs.map((doc) => {
      const requestData = doc.data();
      delete requestData.userId;
      return requestData;
    });
  } catch (error) {
    handleFirebaseError(error);
  }
};
