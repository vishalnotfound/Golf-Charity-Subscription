import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Loader2, Upload, ExternalLink } from 'lucide-react';

const Winnings = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  const fetchWinnings = async () => {
    try {
      const res = await api.get('/winnings');
      setWins(res.data);
    } catch (err) {
      console.error('Failed to fetch winnings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinnings();
  }, []);

  const handleFileUpload = async (winnerId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingId(winnerId);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/winner/upload-proof?winner_id=${winnerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchWinnings();
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload proof. Please try again.');
    } finally {
      setUploadingId(null);
    }
  };

  const getTier = (matches) => {
    switch (matches) {
      case 5: return { name: 'Tier 1 - Jackpot', color: 'text-yellow-600 bg-yellow-100' };
      case 4: return { name: 'Tier 2 - Runner Up', color: 'text-gray-700 bg-gray-200' };
      case 3: return { name: 'Tier 3 - Bronze Entry', color: 'text-orange-700 bg-orange-100' };
      default: return { name: 'No Tier', color: 'text-gray-500 bg-gray-50' };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Paid out</span>;
      case 'approved': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Approved</span>;
      default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Proof</span>;
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-nature-600" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Winnings</h1>
        <p className="text-gray-500 mt-1">Review your draw matches and upload proof to claim prizes.</p>
      </div>

      {wins.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎫</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No winnings yet</h3>
          <p className="text-gray-500 mt-2">Keep actively adding scores to increase your chances in the monthly draw!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {wins.map((win) => {
            const tier = getTier(win.match_count);
            return (
              <div key={win.id} className="card p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-md text-sm font-bold ${tier.color}`}>
                      {tier.name}
                    </span>
                    {getStatusBadge(win.status)}
                  </div>
                  <h3 className="text-gray-900 font-medium mt-3">Matched {win.match_count} numbers in Draw #{win.draw_id}</h3>
                  <p className="text-sm text-gray-500 mt-1">Drawn on: {new Date(win.created_at).toLocaleDateString()}</p>
                </div>

                <div className="w-full md:w-auto p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center min-w-[200px]">
                  {win.proof_image ? (
                    <div className="text-center">
                      <p className="text-sm text-green-600 font-medium mb-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" /> Proof Uploaded
                      </p>
                      <a 
                        href={`http://localhost:8000${win.proof_image}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-nature-600 hover:text-nature-700 flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> View Image
                      </a>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <p className="text-sm text-gray-600 mb-3">Upload scorecard proof to claim</p>
                      
                      <input
                        type="file"
                        id={`upload-${win.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(win.id, e)}
                        disabled={uploadingId === win.id}
                      />
                      <label 
                        htmlFor={`upload-${win.id}`}
                        className={`btn-secondary w-full cursor-pointer ${uploadingId === win.id ? 'opacity-50' : ''}`}
                      >
                        {uploadingId === win.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" /> Upload Proof
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Winnings;
