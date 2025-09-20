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
    if (!name || !party) return;
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
    <div className="page-container">
      <h2>Admin Panel</h2>

      {/* 🔹 Add Candidate Form */}
      <form onSubmit={addCandidate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Candidate Name" 
        />
        <input 
          value={party} 
          onChange={(e) => setParty(e.target.value)} 
          placeholder="Party" 
        />
        <button type="submit">Add Candidate</button>
      </form>

      {/* 🔹 Candidates List */}
      <ul style={{ marginTop: "25px" }}>
        {candidates.map(c => (
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
              <strong>{c.name}</strong> - {c.party} ({c.voteCount} votes)
            </div>
            <button 
              onClick={() => removeCandidate(c.id)} 
              style={{
                background: "#ff6b6b",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.3s"
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
