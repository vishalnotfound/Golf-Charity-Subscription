import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, Trophy, Heart, Play } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    active_subscribers: 0,
    pending_winners: 0,
    total_charities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [drawLoading, setDrawLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDraw = async () => {
    if (!window.confirm('Are you sure you want to run the draw? This will pick winners for this month.')) return;
    
    setDrawLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/draw/run');
      setMessage({ type: 'success', text: `Draw completed! ID: ${res.data.id}` });
      fetchStats();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to run draw' });
    } finally {
      setDrawLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and quick controls.</p>
      </div>

      {message && (
        <div className={`alert-${message.type} mb-4`}>
          {message.text}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-content">
            <Users className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.total_users}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-content">
            <Trophy className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.active_subscribers}</h3>
              <p>Active Subs</p>
            </div>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-content">
            <Heart className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.total_charities}</h3>
              <p>Charities</p>
            </div>
          </div>
        </div>
        <div className="stat-card glass-panel highlighting-card">
          <div className="stat-content">
            <Trophy className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.pending_winners}</h3>
              <p>Pending Proofs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-actions mt-8">
        <div className="glass-panel text-center action-panel">
          <h2>Quick Actions</h2>
          <p className="text-muted mb-4">Common system management tasks.</p>
          <button 
            onClick={handleRunDraw} 
            disabled={drawLoading} 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
          >
            <Play size={18} />
            {drawLoading ? 'Running...' : 'Run Monthly Draw'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
