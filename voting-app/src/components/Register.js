import React, { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 👇 Fake email banayenge Firebase ke liye
      const fakeEmail = `${registerNumber}@college.com`;

      const res = await createUserWithEmailAndPassword(auth, fakeEmail, password);

      await setDoc(doc(db, "users", res.user.uid), {
        name,
        registerNumber,
        role: "voter",
        hasVoted: false,
      });

      alert("Registered successfully! Please login now.");

      // 👇 Register ke turant baad logout & redirect
      await signOut(auth);
      navigate("/login");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
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
      <button type="submit">Register</button>
    </form>
  );
}
