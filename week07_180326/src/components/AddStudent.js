import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AddStudent({ addStudent }) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !course) {
      alert("Fill all fields!");
      return;
    }

    addStudent({ name, course });

    setName("");
    setCourse("");
    inputRef.current.focus();

    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">Add Student</h2>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <button type="submit">Add Student</button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;