import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register clicked", { email, password, name });
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Auth created:", res.user);

      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        voterId: "VID-" + Math.floor(100000 + Math.random() * 900000),
        hasVoted: false,
      });

      alert("Registered successfully!");
    } catch (err) {
      console.error("Register error:", err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
