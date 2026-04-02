import { useState } from 'react';
import api from '../../api/axios';
import { Ticket } from 'lucide-react';

const Draw = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runDraw = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post('/draw/run');
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to run draw');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Run Monthly Draw</h1>
        <p>This will select 6 random numbers (1-45) and find any winning users.</p>
      </div>

      <div className="glass-panel text-center max-w-2xl mx-auto">
        <Ticket size={48} className="mx-auto mb-4 text-primary" />
        <h2>Execute Draw</h2>
        <p className="mb-6">Once executed, this action cannot be undone. Winners will be generated automatically.</p>
        
        {error && <div className="alert-error mb-4">{error}</div>}
        
        <button 
          className="btn-primary btn-large" 
          onClick={runDraw}
          disabled={loading}
        >
          {loading ? 'Running...' : 'Run Draw Now'}
        </button>

        {result && (
          <div className="draw-result mt-8">
            <h3>Draw #{result.draw_id} is Complete!</h3>
            <div className="drawn-numbers flex justify-center gap-2 mt-4 flex-wrap">
              {result.numbers.map((num, i) => (
                <div key={i} className="draw-ball bg-primary text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                  {num}
                </div>
              ))}
            </div>
            <p className="mt-4 font-bold text-lg text-green">{result.winners_count} Winners found!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Draw;
