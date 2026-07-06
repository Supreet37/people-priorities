import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const AuthComponent = ({ initialMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to toggle between Login and Register
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register' || location.pathname === '/register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  // Unified Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    wardNumber: '',
    confirmPassword: ''
  });

  // Keep state in sync with URL if it changes (e.g., via browser back/forward)
  useEffect(() => {
    setIsRegisterMode(location.pathname === '/register');
  }, [location.pathname]);

  const toggleMode = () => {
    const newMode = !isRegisterMode;
    setIsRegisterMode(newMode);
    setError('');
    // This updates the URL without needing separate routes in App.js to be functional
    // However, for the page to NOT be blank on refresh, the route MUST exist in App.js
    navigate(newMode ? '/register' : '/login/citizen');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        // --- REGISTRATION LOGIC ---
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await authService.registerCitizen({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          ward: formData.wardNumber
        });
        // Switch to login mode after successful registration
        setIsRegisterMode(false);
        navigate('/login/citizen');
        alert('Registration successful! Please log in with your new credentials.');
      } else {
        // --- LOGIN LOGIC ---
        const response = await authService.loginCitizen({ 
          email: formData.email, 
          password: formData.password 
        });
        localStorage.setItem('token', response.data.access_token);
        const userResponse = await authService.getMe();
        login(userResponse.data, response.data.access_token);
        navigate('/citizen');
      }
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Authentication failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Visual/Branding (Dynamic based on mode) */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-700 ${isRegisterMode ? 'bg-marigold' : 'bg-ink-navy'}`}>
        <div className="absolute inset-0 opacity-40">
          <img 
            src={isRegisterMode 
              ? "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" 
              : "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200"} 
            alt="Community Engagement" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-20 text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl ${isRegisterMode ? 'bg-ink-navy text-white' : 'bg-marigold text-white'}`}>P</div>
            <span className={`font-fraunces text-2xl font-bold tracking-tight ${isRegisterMode ? 'text-ink-navy' : 'text-white'}`}>People's Priorities</span>
          </Link>
          <h1 className={`font-fraunces text-5xl font-bold leading-tight mb-6 ${isRegisterMode ? 'text-ink-navy' : 'text-white'}`}>
            {isRegisterMode ? "Be the Change in Your Neighborhood." : "Welcome Back to Your Community Hub."}
          </h1>
          <p className={`text-xl leading-relaxed max-w-lg ${isRegisterMode ? 'text-ink-navy/80' : 'text-white/80'}`}>
            {isRegisterMode 
              ? "Join thousands of citizens in shaping the future of your constituency. Your voice matters." 
              : "Log in to track your submitted concerns, view community projects, and participate in development."}
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32 blur-3xl" />
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-paper/30">
        <div className="max-w-md w-full">
          <div className="mb-10 lg:hidden flex justify-center">
             <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-marigold rounded-lg flex items-center justify-center text-white font-bold">P</div>
                <span className="font-fraunces text-xl font-bold text-ink-navy">People's Priorities</span>
             </Link>
          </div>
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-fraunces text-3xl font-bold text-ink-navy mb-2">
              {isRegisterMode ? "Create Account" : "Citizen Login"}
            </h2>
            <p className="text-gray-500">
              {isRegisterMode ? "Join your local community portal" : "Access your personalized citizen portal"}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm animate-pulse">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input 
                      name="fullName"
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ward Number</label>
                    <input 
                      name="wardNumber"
                      type="text" 
                      placeholder="e.g. 12"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all"
                      value={formData.wardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={isRegisterMode ? "grid grid-cols-2 gap-4" : ""}>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    {!isRegisterMode && <a href="#" className="text-xs font-bold text-marigold hover:underline">Forgot?</a>}
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {isRegisterMode && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm</label>
                    <input 
                      name="confirmPassword"
                      type="password" 
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-marigold/20 focus:border-marigold outline-none transition-all"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 ${isRegisterMode ? 'bg-ink-navy shadow-ink-navy/20' : 'bg-marigold shadow-marigold/20'}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (isRegisterMode ? "Create Account" : "Sign In to Portal")}
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-600">
              <p>
                {isRegisterMode ? "Already have an account?" : "Don't have an account yet?"} 
                <button 
                  onClick={toggleMode}
                  className="text-marigold font-bold hover:underline ml-1 transition-all"
                >
                  {isRegisterMode ? "Log in instead" : "Create an account"}
                </button>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-gray-400 text-sm hover:text-ink-navy transition-colors">← Back to Homepage</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// We export both names so your existing App.js imports don't break
export const CitizenLogin = () => <AuthComponent initialMode="login" />;
export const CitizenRegister = () => <AuthComponent initialMode="register" />;
