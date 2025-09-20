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
      if (!u) {
        navigate("/login"); // 🔒 not logged in → back to login
        return;
      }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      setUserData(snap.data());
    });
    return () => unsub();
  }, [navigate]);

  const fetchCandidates = async () => {
    const snapshot = await getDocs(collection(db, "candidates"));
    setCandidates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
      return;
    }

    const candidateRef = doc(db, "candidates", candidateId);
    const candidateSnap = await getDoc(candidateRef);
    const newCount = candidateSnap.data().voteCount + 1;

    await updateDoc(candidateRef, { voteCount: newCount });
    await updateDoc(doc(db, "users", user.uid), { hasVoted: true });

    alert("Vote cast successfully!");
    fetchCandidates();
  };

  return (
    <div>
      <h2>Vote for your Candidate</h2>
      {userData?.hasVoted ? (
        <p>You have already voted!</p>
      ) : (
        <ul>
          {candidates.map((c) => (
            <li key={c.id}>
              {c.name} - {c.party}
              <button onClick={() => castVote(c.id)}>Vote</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
