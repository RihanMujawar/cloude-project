import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Results() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "candidates"), (snapshot) => {
      setCandidates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

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
    </div>
  );
}
