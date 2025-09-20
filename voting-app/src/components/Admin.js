import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function Admin() {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState("");
  const [party, setParty] = useState("");

  const fetchCandidates = async () => {
    const snapshot = await getDocs(collection(db, "candidates"));
    setCandidates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const addCandidate = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "candidates"), {
      name,
      party,
      voteCount: 0
    });
    setName("");
    setParty("");
    fetchCandidates();
  };

  const removeCandidate = async (id) => {
    await deleteDoc(doc(db, "candidates", id));
    fetchCandidates();
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <form onSubmit={addCandidate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Candidate Name" />
        <input value={party} onChange={(e) => setParty(e.target.value)} placeholder="Party" />
        <button type="submit">Add Candidate</button>
      </form>

      <ul>
        {candidates.map(c => (
          <li key={c.id}>
            {c.name} - {c.party}
            <button onClick={() => removeCandidate(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
