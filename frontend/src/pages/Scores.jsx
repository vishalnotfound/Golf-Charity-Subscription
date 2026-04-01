import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Plus, Calendar } from 'lucide-react';

const Scores = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newScore, setNewScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const fetchScores = async () => {
    try {
      const res = await api.get('/scores');
      setScores(res.data);
    } catch (err) {
      console.error('Failed to fetch scores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleAddScore = async (e) => {
    e.preventDefault();
    setError('');
    const scoreVal = parseInt(newScore);

    if (scoreVal < 1 || scoreVal > 45) {
      setError('Score must be between 1 and 45');
      return;
    }

    setAdding(true);
    try {
      // Must include a time component for FastAPI datetime validation
      const dateString = new Date(date).toISOString();
      await api.post('/scores', { score: scoreVal, date: dateString });
      setNewScore('');
      fetchScores();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add score. Check subscription.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-nature-600" /></div>;

  const isActive = user?.subscription_status === 'active';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Scores</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Score Form */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add Score
            </h2>
            
            {!isActive ? (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                You need an active subscription to add scores.
              </div>
            ) : (
              <form onSubmit={handleAddScore} className="space-y-4">
                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Score (1-45)</label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    required
                    className="input-field"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    placeholder="e.g. 42"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={adding} className="w-full btn-primary">
                  {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Score'}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Only your latest 5 scores are active for the draw.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Scores List */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Active Scores (Latest 5)</h2>
            </div>
            
            {scores.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No scores recorded yet. Enter your first score to qualify for draws!
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {scores.map((s, idx) => (
                  <li key={s.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-nature-100 text-nature-700 font-bold flex items-center justify-center text-xl">
                        {s.score}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Score Entry #{scores.length - idx}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(s.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scores;
