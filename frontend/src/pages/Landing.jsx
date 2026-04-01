import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, Heart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-nature-700">⛳ GolfLink</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-nature-600 font-medium">Log In</Link>
            <Link to="/signup" className="btn-primary">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
            Play Golf. <span className="text-nature-600">Give Back.</span> Win Big.
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
            The platform that turns your golf scores into charity donations and gives you a chance to win in our monthly draws.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/signup" className="btn-primary px-8 py-4 text-lg">
              Get Started Now
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Scores</h3>
              <p className="text-gray-500 text-center">Enter your scores between 1-45. We keep your latest 5 active for the draw.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-nature-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support Charity</h3>
              <p className="text-gray-500 text-center">Select your favorite charity and allocate a percentage of your subscription.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Win Monthly</h3>
              <p className="text-gray-500 text-center">Match 3, 4, or 5 numbers in our monthly draw to win prizes.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2026 Golf Charity Subscription Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
