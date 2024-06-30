// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCfL508xfsuAo1d1dscYabPUjgRGa_RFBo",
  authDomain: "recipe-space.firebaseapp.com",
  projectId: "recipe-space",
  storageBucket: "recipe-space.appspot.com",
  messagingSenderId: "927201715781",
  appId: "1:927201715781:web:4e7f869eb862a917ee252c",
  measurementId: "G-F8PM17PMZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;