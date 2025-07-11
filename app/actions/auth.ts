import { account, ID } from "../lib/appwrite";
import { OAuthProvider } from "appwrite";

// ✅ Sign Up with Email & Password
export const signUp = async (email: string, password: string, name: string) => {
  try {
    return await account.create(ID.unique(), email, password, name);
  } catch (error) {
    throw error;
  }
};


export const signIn = async (email: string, password: string) => {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
};

// ✅ Sign Out
export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw error;
  }
};



export const signInWithOAuth = async (provider: OAuthProvider) => {
  try {
    await account.createOAuth2Session(
      provider,
      "http://localhost:3000/",
      "http://localhost:3000/signin"
    );
  } catch (error) {
    console.error("OAuth Sign-in Error:", error);
    throw error;
  }
};
export const sendOTP = async (phone: string) => {
  try {
    return await account.createSession("phone", phone);
  } catch (error) {
    throw error;
  }
};


export const verifyOTP = async (userId: string, otp: string) => {
  try {
    return await account.updateSession(userId, otp);
  } catch (error) {
    throw error;
  }
};
