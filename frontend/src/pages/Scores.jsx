import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Target } from 'lucide-react';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await api.get('/scores/my-scores');
      setScores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const scoreVal = parseInt(newScore);
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      setError('Score must be between 1 and 45');
      return;
    }

    try {
      await api.post('/scores/', { points: scoreVal });
      setSuccess('Score logged successfully!');
      setNewScore('');
      fetchScores();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0].msg);
      } else {
        setError(detail || 'Failed to log score');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Scores</h1>
        <p>Log your weekly stableford scores to enter the draw.</p>
      </div>

      <div className="two-col-layout">
        <div className="glass-panel">
          <h2>Log New Score</h2>
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit} className="score-form mt-4">
            <div className="form-group">
              <label>Stableford Points (1-45)</label>
              <div className="input-with-icon">
                <Target className="input-icon" />
                <input 
                  type="number" 
                  min="1" 
                  max="45"
                  value={newScore} 
                  onChange={(e) => setNewScore(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Submit Score</button>
          </form>
        </div>

        <div className="glass-panel">
          <h2>Recent Scores</h2>
          <div className="score-list mt-4">
            {scores.length === 0 ? (
              <p className="text-muted">No scores logged yet.</p>
            ) : (
              scores.slice(0, 5).map(score => (
                <div key={score.id} className="score-item">
                  <div className="score-points">
                    <span className="points-val">{score.points}</span>
                    <span className="points-label">pts</span>
                  </div>
                  <div className="score-date">
                    {new Date(score.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scores;
