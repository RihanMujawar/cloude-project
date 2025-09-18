// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // if we use DB later
// import { getAnalytics } from "firebase/analytics"; // optional for dev

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTEIvVzqOrwiv5E3RK3YVPy8gnTq0TWxw",
  authDomain: "voting-app-3fb14.firebaseapp.com",
  projectId: "voting-app-3fb14",
  storageBucket: "voting-app-3fb14.appspot.com", // ✅ fixed (was .app → should be .app**spot**.com)
  messagingSenderId: "926896794796",
  appId: "1:926896794796:web:d7c51c9b7b08ff66a7c309",
  measurementId: "G-XR96YQ8HXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app); // for saving voter info
// export const analytics = getAnalytics(app); // optional
