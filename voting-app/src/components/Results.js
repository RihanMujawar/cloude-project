import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Results() {
  const [candidates, setCandidates] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // 🔹 Listen to candidates collection
    const unsubCandidates = onSnapshot(collection(db, "candidates"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // 🔹 Sort descending by voteCount
      data.sort((a, b) => b.voteCount - a.voteCount);
      setCandidates(data);
    });

    // 🔹 Listen to auth changes
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

  // 🔹 Candidate user voted for
  const votedCandidate = candidates.find(c => c.id === userData?.votedFor);

  return (
    <div className="page-container">
      <h2>Live Results</h2>

      {/* 🔹 Highlight user's vote first */}
      {userData?.hasVoted && votedCandidate && (
        <div className="result-highlight">
          ✅ You voted for: {votedCandidate.name} ({votedCandidate.party})
        </div>
      )}

      <ul>
        {candidates.map(c => (
          <li key={c.id}>
            {c.name} ({c.party}) - Votes: {c.voteCount}
          </li>
        ))}
      </ul>
    </div>
  );
}
