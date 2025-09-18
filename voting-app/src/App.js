import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import VotingPage from "./VotingPage";

function App() {
  return (
    <BrowserRouter>
      {/* Navigation links */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        <Link to="/vote">Vote</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vote" element={<VotingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
