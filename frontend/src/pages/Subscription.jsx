import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react';

const Subscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const plans = [
    { id: 'free', name: 'Free', price: '£0', features: ['Log scores', 'Basic stats'] },
    { id: 'monthly', name: 'Monthly', price: '£10', period: '/month', features: ['Enter monthly draws', 'Support charities', 'Advanced stats'], popular: true },
    { id: 'yearly', name: 'Yearly', price: '£100', period: '/year', features: ['All monthly features', '2 months free', 'Priority support'] }
  ];

  const handleSubscribe = async (planId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put('/subscription', { subscription_type: planId });
      setSuccess(`Successfully subscribed to ${planId} plan!`);
      setTimeout(() => window.location.reload(), 2000); // Reload to update user context
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0].msg);
      } else {
        setError(detail || 'Failed to update subscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header text-center max-w-2xl mx-auto">
        <h1>Subscription Plans</h1>
        <p>Choose the plan that fits your game. Upgrade to enter the monthly prize draws and support great causes.</p>
      </div>

      {error && <div className="alert-error max-w-2xl mx-auto mb-4">{error}</div>}
      {success && <div className="alert-success max-w-2xl mx-auto mb-4">{success}</div>}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {plans.map(plan => (
          <div key={plan.id} className={`pricing-card glass-panel ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <div className="pricing-header">
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="amount">{plan.price}</span>
                {plan.period && <span className="period">{plan.period}</span>}
              </div>
            </div>
            <ul className="features-list">
              {plan.features.map((feature, idx) => (
                <li key={idx}><Check className="check-icon" /> {feature}</li>
              ))}
            </ul>
            <button 
              className={`btn-primary w-full mt-6 ${user?.subscription_plan === plan.id ? 'btn-outline' : ''}`}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading || user?.subscription_plan === plan.id}
            >
              {user?.subscription_plan === plan.id ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
