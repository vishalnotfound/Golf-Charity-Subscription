import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, TicketCheck, Trophy, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, draws: 0, winners: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, winnersRes, drawRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/winners'),
          api.get('/draw/latest').catch(() => ({ data: { id: 0 } }))
        ]);
        
        setStats({
          users: usersRes.data.length,
          winners: winnersRes.data.length,
          draws: drawRes.data?.id || 0
        });
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-nature-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-nature-100 text-nature-600">
              <TicketCheck className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Draws Run</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.draws}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Winners</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.winners}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
          <div className="space-y-4">
            <Link to="/admin/draw" className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <TicketCheck className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Run Monthly Draw</span>
              </div>
              <span className="text-nature-600">&rarr;</span>
            </Link>
            <Link to="/admin/winners" className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Review Winner Proofs</span>
              </div>
              <span className="text-nature-600">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
