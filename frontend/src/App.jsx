import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Scores from './pages/Scores';
import Charity from './pages/Charity';
import Subscription from './pages/Subscription';
import Winnings from './pages/Winnings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Draw from './pages/admin/Draw';
import Users from './pages/admin/Users';
import Winners from './pages/admin/Winners';
import Charities from './pages/admin/Charities';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Protected Routes with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scores" element={<Scores />} />
              <Route path="/charity" element={<Charity />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/winnings" element={<Winnings />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="draw" element={<Draw />} />
                <Route path="users" element={<Users />} />
                <Route path="winners" element={<Winners />} />
                <Route path="charities" element={<Charities />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
