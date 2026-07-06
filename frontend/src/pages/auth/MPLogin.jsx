import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const MPLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.loginMP({ email, password });
      localStorage.setItem('token', response.data.access_token); // save token before calling getMe()
      // In a real app, we'd fetch the user profile here
      const userResponse = await authService.getMe();
      login(userResponse.data, response.data.access_token);
      navigate('/mp/dashboard');
    } catch (err) {
      setError('Invalid MP credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-navy px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="font-fraunces text-3xl font-bold text-ink-navy">MP Dashboard</h2>
          <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest">Administrative Access</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-ink-navy focus:border-ink-navy"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secure Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-ink-navy focus:border-ink-navy"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-ink-navy text-white py-3 rounded font-bold hover:bg-opacity-90 transition-all">
            Enter Dashboard
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-400 text-sm">← Back to Public Site</Link>
        </div>
      </div>
    </div>
  );
};

export default MPLogin;