import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Check } from 'lucide-react';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const res = await api.get('/winners/all');
      setWinners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (winnerId, action) => {
    try {
      await api.put(`/winners/${winnerId}/${action}`);
      fetchWinners();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Winners</h1>
        <p>Review proof of play, approve winners, and mark as paid.</p>
      </div>

      <div className="glass-panel overflow-x-auto">
        {loading ? <p>Loading winners...</p> : (
          <table className="data-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-white/10">Win ID</th>
                <th className="p-4 border-b border-white/10">User ID</th>
                <th className="p-4 border-b border-white/10">Draw ID</th>
                <th className="p-4 border-b border-white/10">Matches</th>
                <th className="p-4 border-b border-white/10">Proof</th>
                <th className="p-4 border-b border-white/10">Approval</th>
                <th className="p-4 border-b border-white/10">Paid</th>
              </tr>
            </thead>
            <tbody>
              {winners.map(w => (
                <tr key={w.id}>
                  <td className="p-4 border-b border-white/5">{w.id}</td>
                  <td className="p-4 border-b border-white/5">{w.user_id}</td>
                  <td className="p-4 border-b border-white/5">{w.draw_id}</td>
                  <td className="p-4 border-b border-white/5">{w.match_count}</td>
                  <td className="p-4 border-b border-white/5">
                    {w.proof_image_url ? (
                      <a href={w.proof_image_url} target="_blank" rel="noreferrer" className="text-link">View Proof</a>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td className="p-4 border-b border-white/5">
                    {w.approved ? (
                      <span className="text-green flex items-center"><Check size={16} className="mr-1"/> Approved</span>
                    ) : (
                      <button className="btn-sm btn-outline text-green" onClick={() => updateStatus(w.id, 'approve')}>Approve</button>
                    )}
                  </td>
                  <td className="p-4 border-b border-white/5">
                    {w.paid ? (
                      <span className="text-green flex items-center"><Check size={16} className="mr-1"/> Paid</span>
                    ) : (
                      <button className="btn-sm btn-outline text-yellow break-keep" onClick={() => updateStatus(w.id, 'pay')} disabled={!w.approved}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Winners;
