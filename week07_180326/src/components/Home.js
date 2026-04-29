function Home() {
  return (
    <div className="home">
      <h1>🎓 Student Management System</h1>
      <p className="subtitle">Manage and track student records easily</p>

      <div className="card-container">
        <div className="card">
          <h3>📋 View Students</h3>
          <p>See all student records in one place</p>
        </div>

        <div className="card">
          <h3>➕ Add Students</h3>
          <p>Add new student details easily</p>
        </div>

        <div className="card">
          <h3>🗑 Manage Records</h3>
          <p>Update or manage student data</p>
        </div>
      </div>
    </div>
  );
}

export default Home;