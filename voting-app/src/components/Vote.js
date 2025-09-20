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

    // Increment candidate vote count
    const candidateRef = doc(db, "candidates", candidateId);
    const candidateSnap = await getDoc(candidateRef);
    const newCount = candidateSnap.data().voteCount + 1;

    await updateDoc(candidateRef, { voteCount: newCount });

    // Mark user as voted + save candidate choice
    await updateDoc(doc(db, "users", user.uid), {
      hasVoted: true,
      votedFor: candidateId,
    });

    alert("Vote cast successfully!");
    navigate("/results");
  };

  return (
    <div>
      <h2>Vote for your Candidate</h2>
      {!userData ? (
        <p>Loading...</p>
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
