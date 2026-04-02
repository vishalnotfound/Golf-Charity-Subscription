import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Target, Shield, Heart } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">Golf Charity</div>
        <div className="nav-actions">
          <Link to="/login" className="btn-outline">Log In</Link>
          <Link to="/signup" className="btn-primary">Sign Up</Link>
        </div>
      </nav>

      <header className="hero">
        <h1>Play Golf. Win Prizes. <span className="text-gradient">Give Back.</span></h1>
        <p>Join the premier golf subscription platform where your scores enter you into monthly prize draws, with proceeds supporting global charities.</p>
        <Link to="/signup" className="btn-primary btn-large cta-btn">Start Your Journey</Link>
      </header>

      <section className="features">
        <div className="grid">
          <div className="feature-card glass-panel">
            <Target className="feature-icon" />
            <h3>Track Scores</h3>
            <p>Log your golf scores every week. The more you play, the better your chances.</p>
          </div>
          <div className="feature-card glass-panel">
            <Trophy className="feature-icon" />
            <h3>Win Prizes</h3>
            <p>Monthly draws for equipment, dream holidays, and cash prizes based on your entries.</p>
          </div>
          <div className="feature-card glass-panel">
            <Heart className="feature-icon" />
            <h3>Support Charities</h3>
            <p>Choose where your subscription money goes from our list of vetted charity partners.</p>
          </div>
          <div className="feature-card glass-panel">
            <Shield className="feature-icon" />
            <h3>Fair Play</h3>
            <p>Transparent draw system and verified winnings mean everyone has a fair shot.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
