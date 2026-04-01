import React, { useState } from 'react';
import api from '../api/axios';
import { Loader2, TicketCheck, AlertCircle } from 'lucide-react';

const AdminDraw = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRunDraw = async () => {
    if (!window.confirm('Are you sure you want to run the draw? This will calculate winners for all active subscribers currently.')) {
      return;
    }
    
    setRunning(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/draw/run');
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to run draw. Check server logs.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Run Monthly Draw</h1>
        <p className="text-gray-500 mt-1">Generate 5 random numbers (1-45) and find matches among active users.</p>
      </div>

      <div className="card p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-nature-100 rounded-full flex items-center justify-center">
            <TicketCheck className="w-10 h-10 text-nature-600" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900">Trigger New Draw</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              This action will immediately draw 5 numbers, cross-reference them with all active users' latest 5 scores, and generate pending winner records for any matches of 3 or more.
            </p>
          </div>

          <button
            onClick={handleRunDraw}
            disabled={running}
            className="btn-primary py-3 px-8 text-lg"
          >
            {running ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin inline" /> Running Analysis...
              </>
            ) : (
              'Run Draw Now'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">Error running draw</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 transform transition-all animate-fade-in-up">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-nature-600 to-green-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Draw Complete!</h2>
              <p className="opacity-90">Draw #{result.id} • {new Date(result.created_at).toLocaleString()}</p>
            </div>
            
            <div className="p-8">
              <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Winning Numbers</h3>
              
              <div className="flex justify-center flex-wrap gap-4">
                {result.numbers.map((num, i) => (
                  <div key={i} className="w-16 h-16 rounded-full bg-white border-4 border-nature-100 flex items-center justify-center text-2xl font-bold text-gray-900 shadow-sm animate-bounce-short" style={{ animationDelay: `${i * 150}ms` }}>
                    {num}
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Winners have been calculated and saved. 
                  <a href="/admin/winners" className="text-nature-600 font-medium ml-2 hover:underline">
                    View Winners
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDraw;
