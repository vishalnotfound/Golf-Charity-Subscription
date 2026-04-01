import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Award, Settings, Heart, Calculator, LogOut, TicketCheck, Users, Trophy } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = user?.role === 'admin' ? [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Run Draw', path: '/admin/draw', icon: TicketCheck },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Winners', path: '/admin/winners', icon: Trophy },
    { name: 'Charities', path: '/admin/charities', icon: Heart },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scores', path: '/scores', icon: Calculator },
    { name: 'Charity', path: '/charity', icon: Heart },
    { name: 'Subscription', path: '/subscription', icon: Settings },
    { name: 'Winnings', path: '/winnings', icon: Award },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-nature-700 flex items-center gap-2">
          <span>⛳</span> GolfLink
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-nature-50 text-nature-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-nature-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-nature-100 rounded-full flex items-center justify-center text-nature-700 font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
