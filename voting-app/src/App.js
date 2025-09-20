import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Vote from "./components/Vote";
import Results from "./components/Results";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/vote">Vote</Link> |{" "}
        <Link to="/results">Results</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
