import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Find email from registerNumber
      const q = query(
        collection(db, "users"),
        where("registerNumber", "==", registerNumber)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Register number not found!");
        return;
      }

      const userData = snapshot.docs[0].data();
      const email = userData.email;

      // Step 2: Sign in with found email + password
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");
      navigate("/vote");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Register Number"
        value={registerNumber}
        onChange={(e) => setRegisterNumber(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
