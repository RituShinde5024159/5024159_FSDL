import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="nav">
      <h2>🎓 Student App</h2>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Students</Link>
        <Link to="/add">Add</Link>
      </div>
    </nav>
  );
}

export default Navbar;