import React from "react";

function Dashboard({ students }) {
  return (
<div className="container">
  <div className="table-box">
    <h2 className="table-title">📋 Student List</h2>

        {students.length === 0 ? (
          <p className="no-data">No students added yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Course</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.course}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;