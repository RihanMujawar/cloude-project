import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // 👈 after logout, back to login
    } catch (err) {
      alert("Error logging out: " + err.message);
    }
  };

  return (
    <nav style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
      <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
      <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
      <Link to="/vote" style={{ marginRight: "10px" }}>Vote</Link>
      <Link to="/results" style={{ marginRight: "10px" }}>Results</Link>
      <Link to="/admin" style={{ marginRight: "10px" }}>Admin</Link>
      <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
        Logout
      </button>
    </nav>
  );
}
