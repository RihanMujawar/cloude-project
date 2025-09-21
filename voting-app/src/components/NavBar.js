import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "users", u.uid));
        setRole(snap.data()?.role || "voter");
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      alert("Error logging out: " + err.message);
    }
  };

  return (
    <nav
      style={{
        background: "#eaeaeaff",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        borderRadius: "0 0 12px 12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Not logged in */}
      {!user && (
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={linkStyle}>Register</Link>
        </>
      )}

      {/* Voter logged in */}
      {user && role === "voter" && (
        <>
          <Link to="/vote" style={linkStyle}>Vote</Link>
          <Link to="/results" style={linkStyle}>Results</Link>
          <button onClick={handleLogout} style={btnStyle}>Logout</button>
        </>
      )}

      {/* Admin logged in */}
      {user && role === "admin" && (
        <>
          <Link to="/admin" style={linkStyle}>Admin</Link>
          <Link to="/results" style={linkStyle}>Results</Link>
          <button onClick={handleLogout} style={btnStyle}>Logout</button>
        </>
      )}
    </nav>
  );
}

const linkStyle = {
  color: "#ff3b3bff",
  textDecoration: "none",
  fontWeight: "500",
  transition: "0.3s",
};

const btnStyle = {

  background: "#44bffdff",
  border: "1px solid white",
  borderRadius: "6px",
  padding: "6px 12px",
  color: "white",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.3s",
};
