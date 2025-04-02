// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOfmeqDjxzcbU7LFAyCwppJMMK2QNLPww",
  authDomain: "murx-d06de.firebaseapp.com",
  projectId: "murx-d06de",
  storageBucket: "murx-d06de.firebasestorage.app",
  messagingSenderId: "465577441885",
  appId: "1:465577441885:web:02ed27d87527ca557d6bb4",
  measurementId: "G-ZNP2FMXC89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 

export { app, analytics };
export default app;
export {auth};