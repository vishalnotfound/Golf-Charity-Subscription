import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Loader2, Check } from 'lucide-react';

const Subscription = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Free Tier',
      price: '$0',
      period: 'forever',
      features: ['Basic dashboard access', 'View charity list'],
      disabled: ['Add scores', 'Select charity', 'Participate in draws'],
    },
    {
      id: 'monthly',
      name: 'Monthly Member',
      price: '$9.99',
      period: '/month',
      features: ['Full dashboard access', 'Add up to 5 active scores', 'Select and support a charity', 'Monthly draw participation (win up to Tier 1)'],
      disabled: [],
    },
    {
      id: 'yearly',
      name: 'Annual VIP',
      price: '$99.99',
      period: '/year',
      features: ['All Monthly Member features', 'Save 16% annually', 'Premium support access'],
      disabled: [],
    }
  ];

  const handleSubscribe = async (planId) => {
    if (user.subscription_type === planId) return;
    
    setLoading(planId);
    setError('');
    setSuccess('');

    try {
      const res = await api.put('/admin/subscription', { subscription_type: planId });
      setUser(res.data);
      setSuccess(`Successfully switched to ${planId} plan!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-gray-500">
          Upgrade to start entering scores, supporting your favorite charities, and winning in our monthly draws.
        </p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center max-w-md mx-auto">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-center max-w-md mx-auto">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = user?.subscription_type === plan.id;
          
          return (
            <div 
              key={plan.id}
              className={`card relative p-8 flex flex-col ${isCurrent ? 'ring-2 ring-nature-500 shadow-md transform scale-105' : 'hover:shadow-md transition-shadow'}`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-nature-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  CURRENT PLAN
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline text-4xl font-extrabold text-gray-900">
                  {plan.price}
                  <span className="text-xl font-medium text-gray-500 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3">
                    <Check className="w-5 h-5 text-nature-500 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
                {plan.disabled.map((feature, idx) => (
                  <li key={`dis-${idx}`} className="flex gap-3 opacity-50">
                    <Check className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    <span className="text-gray-400 text-sm strike-through">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || loading === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                  isCurrent 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : plan.id === 'yearly' 
                      ? 'bg-nature-600 text-white hover:bg-nature-700'
                      : 'bg-white text-nature-600 border-2 border-nature-600 hover:bg-nature-50'
                }`}
              >
                {loading === plan.id ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isCurrent ? 'Active' : `Select ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;
