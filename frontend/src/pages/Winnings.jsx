import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trophy, Upload, CheckCircle } from 'lucide-react';

const Winnings = () => {
  const [winnings, setWinnings] = useState([]);

  useEffect(() => {
    fetchWinnings();
  }, []);

  const fetchWinnings = async () => {
    try {
      const res = await api.get('/winners/my-wins');
      setWinnings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadProof = (winId) => {
    // In a real app this would upload a file. For now we just alert.
    alert(`Upload proof for win ${winId} - feature coming soon!`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Winnings</h1>
        <p>Check your draw results and upload proof of play for your prizes.</p>
      </div>

      <div className="glass-panel">
        {winnings.length === 0 ? (
          <div className="empty-state">
            <Trophy className="empty-icon" />
            <h3>No winnings yet</h3>
            <p>Keep logging your scores to enter the monthly draws!</p>
          </div>
        ) : (
          <div className="winnings-list">
            {winnings.map(win => (
              <div key={win.id} className="winning-item glass-panel">
                <div className="winning-details">
                  <h3>Draw #{win.draw_id}</h3>
                  <div className="matched-numbers">
                    Matched {win.match_count} numbers!
                  </div>
                  <div className="winning-status mt-2">
                    <span className={`status-badge ${win.approved ? 'success' : 'pending'}`}>
                      {win.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                    {win.paid && <span className="status-badge success ml-2">Paid</span>}
                  </div>
                </div>
                <div className="winning-actions">
                  {win.proof_image_url ? (
                    <div className="proof-status text-green flex items-center">
                      <CheckCircle className="mr-2" size={16} /> Proof Uploaded
                    </div>
                  ) : (
                    <button className="btn-outline" onClick={() => handleUploadProof(win.id)}>
                      <Upload size={16} className="mr-2" /> Upload Proof
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Winnings;
