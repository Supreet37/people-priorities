import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MPNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-ink-navy text-white py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/mp/dashboard" className="font-fraunces text-2xl font-bold">
          MP Administration
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/mp/dashboard" className="hover:text-marigold transition-colors">Dashboard</Link>
          <Link to="/mp/map" className="hover:text-marigold transition-colors">Heatmap</Link>
          <Link to="/mp/submissions" className="hover:text-marigold transition-colors">Submissions</Link>
          <Link to="/mp/rankings" className="hover:text-marigold transition-colors">Rankings</Link>
          <Link to="/mp/schemes" className="hover:text-marigold transition-colors">Schemes</Link>
          <Link to="/mp/reports" className="hover:text-marigold transition-colors">Reports</Link>
          
          <button onClick={handleLogout} className="ml-6 bg-stamp-red px-4 py-1 rounded text-sm font-bold uppercase hover:bg-opacity-80 transition-all">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MPNavbar;
