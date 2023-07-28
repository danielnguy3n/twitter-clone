// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9Qcsg7HNK8VLeA6XqdR9XJf0R5eAXnj8",
  authDomain: "twitter-clone-f6156.firebaseapp.com",
  projectId: "twitter-clone-f6156",
  storageBucket: "twitter-clone-f6156.appspot.com",
  messagingSenderId: "359725236630",
  appId: "1:359725236630:web:b79ee95c7c8e41230addb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)