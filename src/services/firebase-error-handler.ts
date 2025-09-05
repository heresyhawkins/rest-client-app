import { FirebaseError } from "firebase/app";
import { INVALID_CREDENTIALS, NETWORK_ERROR } from "../data/error-messages.ts";

export const handleFirebaseError = (error: unknown) => {
  if (error instanceof FirebaseError) {
    const message = error.message;
    if (message.includes('invalid-credential') || message.includes('email-already-in-use')) {
      throw new Error(INVALID_CREDENTIALS);
    }
    if (message.includes('network-request-failed')) {
      throw new Error(NETWORK_ERROR);
    }
  }
  throw error;
}
