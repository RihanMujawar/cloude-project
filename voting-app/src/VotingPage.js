import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if user has voted
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setHasVoted(snap.data().hasVoted);
          }
        } catch (err) {
          console.error("Error checking user vote status:", err);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load candidates from Firestore
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const snap = await getDocs(collection(db, "candidates"));
        setCandidates(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error loading candidates:", err);
      }
    };
    fetchCandidates();
  }, []);

  // Vote for a candidate
  const vote = async (candidateId) => {
    if (!user) return alert("Login first");
    if (hasVoted) return alert("You already voted");

    try {
      // Record vote
      await addDoc(collection(db, "votes"), {
        candidateId,
        voterId: user.uid,
        timestamp: new Date()
      });

      // Mark user as voted
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { hasVoted: true });

      setHasVoted(true);
      alert("Vote recorded!");
    } catch (err) {
      console.error("Error casting vote:", err);
      alert("Error casting vote");
    }
  };

  return (
    <div>
      <h2>Vote for your candidate</h2>
      {candidates.map(c => (
        <div key={c.id} style={{ marginBottom: "10px" }}>
          <span>{c.name}</span>
          <button onClick={() => vote(c.id)} disabled={hasVoted} style={{ marginLeft: "10px" }}>
            Vote
          </button>
        </div>
      ))}
      {hasVoted && <p style={{ color: "green" }}>You have already voted.</p>}
    </div>
  );
}
