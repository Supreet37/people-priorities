import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const CitizenRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    wardNumber: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setIsLoading(true);
    setError('');
    try {
      await authService.registerCitizen({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        ward: formData.wardNumber
      });
      navigate('/login/citizen');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-marigold overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" 
            alt="Community" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-20 text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-ink-navy rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
            <span className="font-fraunces text-2xl font-bold tracking-tight text-ink-navy">People's Priorities</span>
          </Link>
          <h1 className="font-fraunces text-5xl font-bold leading-tight mb-6 text-ink-navy">
            Be the Change in Your Neighborhood.
          </h1>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-paper/30">
        <div className="max-w-md w-full">
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-fraunces text-3xl font-bold text-ink-navy mb-2">Create Account</h2>
            <p className="text-gray-500">Join your local community portal</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input name="fullName" type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-marigold" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ward</label>
                  <input name="wardNumber" type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-marigold" value={formData.wardNumber} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input name="email" type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-marigold" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input name="password" type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-marigold" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm</label>
                  <input name="confirmPassword" type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-marigold" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-ink-navy text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
            <div className="mt-8 text-center text-sm">
              <p>Already have an account? <Link to="/login/citizen" className="text-marigold font-bold">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
};

export default CitizenRegister;
