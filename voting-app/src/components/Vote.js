import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setUserData(snap.data());

        // 🔹 Redirect if already voted
        if (snap.data()?.hasVoted) {
          navigate("/results");
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  const fetchCandidates = async () => {
    const snapshot = await getDocs(collection(db, "candidates"));
    setCandidates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const castVote = async (candidateId) => {
    if (!user || !userData) {
      alert("Please login first!");
      return;
    }
    if (userData.hasVoted) {
      alert("You have already voted!");
      navigate("/results");
      return;
    }

    // 🔹 Increment candidate vote count
    const candidateRef = doc(db, "candidates", candidateId);
    const candidateSnap = await getDoc(candidateRef);
    const newCount = candidateSnap.data().voteCount + 1;

    await updateDoc(candidateRef, { voteCount: newCount });

    // 🔹 Mark user as voted + save choice
    await updateDoc(doc(db, "users", user.uid), {
      hasVoted: true,
      votedFor: candidateId,
    });

    alert("Vote cast successfully!");
    navigate("/results");
  };

  return (
    <div className="page-container">
      <h2>Vote for your Candidate</h2>

      {!userData ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ marginTop: "20px" }}>
          {candidates.map((c) => (
            <li key={c.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              background: "#f9f9f9",
              transition: "0.3s"
            }}>
              <div>
                <strong>{c.name}</strong> - {c.party}
              </div>
              <button 
                onClick={() => castVote(c.id)} 
                style={{
                  background: "#4a90e2",
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                Vote
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
