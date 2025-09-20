import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Results() {
  const [candidates, setCandidates] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubCandidates = onSnapshot(collection(db, "candidates"), (snapshot) => {
      setCandidates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setUserData(snap.data());
      }
    });

    return () => {
      unsubCandidates();
      unsubAuth();
    };
  }, []);

  const votedCandidate = candidates.find(c => c.id === userData?.votedFor);

  return (
    <div>
      <h2>Live Results</h2>
      <ul>
        {candidates.map(c => (
          <li key={c.id}>
            {c.name} ({c.party}) - Votes: {c.voteCount}
          </li>
        ))}
      </ul>

      {userData?.hasVoted && votedCandidate && (
        <div style={{ marginTop: "20px", fontWeight: "bold", color: "green" }}>
          ✅ You voted for: {votedCandidate.name} ({votedCandidate.party})
        </div>
      )}
    </div>
  );
}
