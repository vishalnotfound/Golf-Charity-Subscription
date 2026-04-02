import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, ListOrdered, Heart, CreditCard, Trophy, LayoutDashboard, Ticket, Users, Award, Building2, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Scores', path: '/scores', icon: ListOrdered },
    { name: 'Charity', path: '/charity', icon: Heart },
    { name: 'Subscription', path: '/subscription', icon: CreditCard },
    { name: 'Winnings', path: '/winnings', icon: Trophy },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Run Draw', path: '/admin/draw', icon: Ticket },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Winners', path: '/admin/winners', icon: Award },
    { name: 'Charities', path: '/admin/charities', icon: Building2 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Golf Charity</h2>
      </div>

      <div className="sidebar-user">
        <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <span className={`role-badge ${user?.is_admin ? 'admin' : 'user'}`}>
            {user?.is_admin ? 'Admin' : 'Player'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="nav-group-title">Menu</li>
          {userLinks.map((link) => (
            <li key={link.path}>
              <NavLink end to={link.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                <link.icon className="nav-icon" />
                {link.name}
              </NavLink>
            </li>
          ))}

          {user?.is_admin && (
            <>
              <li className="nav-group-title mt-4">Admin</li>
              {adminLinks.map((link) => (
                <li key={link.path}>
                  <NavLink end to={link.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <link.icon className="nav-icon" />
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <LogOut className="nav-icon" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
