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
    <nav style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
      {/* Not logged in */}
      {!user && (
        <>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        </>
      )}

      {/* Voter logged in */}
      {user && role === "voter" && (
        <>
          <Link to="/vote" style={{ marginRight: "10px" }}>Vote</Link>
          <Link to="/results" style={{ marginRight: "10px" }}>Results</Link>
          <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
            Logout
          </button>
        </>
      )}

      {/* Admin logged in */}
      {user && role === "admin" && (
        <>
          <Link to="/admin" style={{ marginRight: "10px" }}>Admin</Link>
          <Link to="/results" style={{ marginRight: "10px" }}>Results</Link>
          <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
