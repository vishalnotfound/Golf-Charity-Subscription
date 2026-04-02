const AdminDashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, winners, charities, and run the monthly draw.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-content">
            <h3>Use side menu to navigate</h3>
            <p>Access users, draws, matches and charities settings from the Sidebar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
