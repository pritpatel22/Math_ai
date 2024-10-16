// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBclRShmyRuno7yvWtKFuNf9UtE7gtoNN0",
  authDomain: "kunj167.firebaseapp.com",
  projectId: "kunj167",
  storageBucket: "kunj167.appspot.com",
  messagingSenderId: "480506919558",
  appId: "1:480506919558:web:c4803083878cf5a2776f07",
  measurementId: "G-39PF7JC6S1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };