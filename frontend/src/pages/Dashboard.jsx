import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, ListOrdered, Heart, Trophy } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    scores: 0,
    winnings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const scoresRes = await api.get('/scores');
        const winsRes = await api.get('/winnings');
        
        setStats({
          scores: scoresRes.data.length,
          winnings: winsRes.data.length
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Here's an overview of your activity.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-blue">
            <CreditCard className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3>Subscription</h3>
            <p className="stat-value">{user?.subscription_type}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-green">
            <ListOrdered className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3>Scores Logged</h3>
            <p className="stat-value">{stats.scores}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-purple">
            <Heart className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3>Selected Charity</h3>
            <p className="stat-value truncate">{user?.charity_id ? 'Charity Selected' : 'None Selected'}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-yellow">
            <Trophy className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3>Wins</h3>
            <p className="stat-value">{stats.winnings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
