import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calculator, Trophy, Heart, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ scoresCount: 0, winningsCount: 0, charity: null });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scoresRes, winningsRes, charitiesRes] = await Promise.all([
          api.get('/scores'),
          api.get('/winnings'),
          api.get('/charities')
        ]);
        
        let userCharity = null;
        if (user?.charity_id) {
          const allCharities = charitiesRes.data;
          userCharity = allCharities.find(c => c.id === user.charity_id);
        }

        setStats({
          scoresCount: scoresRes.data.length,
          winningsCount: winningsRes.data.length,
          charity: userCharity
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Welcome back, {user?.name}!</h1>

      {user?.subscription_status !== 'active' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Subscription Inactive</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Activate your subscription to start adding scores, selecting charities, and participating in draws.</p>
              </div>
              <div className="mt-4">
                <Link to="/subscription" className="text-sm font-medium text-yellow-800 hover:text-yellow-700">
                  Update Subscription &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Calculator className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Scores</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.scoresCount} / 5</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-nature-100 text-nature-600">
              <Heart className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Selected Charity</p>
              <p className="text-lg font-semibold text-gray-900 truncate" title={stats.charity?.name || 'None'}>
                {stats.charity?.name || 'Not selected'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Winnings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.winningsCount}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Settings className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Subscription</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{user?.subscription_type}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/scores" className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Enter New Score</span>
              </div>
              <span className="text-nature-600">&rarr;</span>
            </Link>
            <Link to="/charity" className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Change Charity</span>
              </div>
              <span className="text-nature-600">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
