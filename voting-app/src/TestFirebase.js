import React, { useEffect } from "react";
import { auth } from "./firebase";

export default function TestFirebase() {
  useEffect(() => {
    console.log("Firebase Auth Object:", auth);
  }, []);

  return <h2>Firebase test mounted</h2>;
}
