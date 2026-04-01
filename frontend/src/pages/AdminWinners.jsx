import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Loader2, ExternalLink, CheckCircle } from 'lucide-react';

const AdminWinners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchWinners = async () => {
    try {
      const res = await api.get('/admin/winners');
      setWinners(res.data);
    } catch (err) {
      console.error('Failed to view winners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/admin/winners/${id}/status`, { status });
      fetchWinners();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getTier = (matches) => {
    switch (matches) {
      case 5: return <span className="text-yellow-600 font-bold">Tier 1 (5/5)</span>;
      case 4: return <span className="text-gray-700 font-bold">Tier 2 (4/5)</span>;
      case 3: return <span className="text-orange-700 font-bold">Tier 3 (3/5)</span>;
      default: return <span>{matches}/5</span>;
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-nature-600" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Winner Management</h1>
        <p className="text-gray-500 mt-1">Review proofs and process payouts.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Draw & Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Tier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {winners.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No winners found. Run a draw first!</td>
                </tr>
              )}
              {winners.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium text-gray-900">Draw #{w.draw_id}</div>
                    <div>{new Date(w.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{w.user_name}</div>
                    <div className="text-sm text-gray-500">{w.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getTier(w.match_count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {w.proof_image ? (
                      <a 
                        href={`http://localhost:8000${w.proof_image}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-nature-600 hover:text-nature-900 flex items-center gap-1 font-medium bg-nature-50 px-3 py-1 rounded inline-flex"
                      >
                        <ExternalLink className="w-4 h-4" /> View Match Image
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Not uploaded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                       <select
                        value={w.status}
                        onChange={(e) => handleUpdateStatus(w.id, e.target.value)}
                        disabled={updatingId === w.id}
                        className={`text-sm rounded border-gray-300 shadow-sm focus:border-nature-500 focus:ring-nature-500 ${
                          w.status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                          w.status === 'approved' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                      </select>
                      {updatingId === w.id && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                      {w.status === 'paid' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWinners;
