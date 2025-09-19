import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";


function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
  