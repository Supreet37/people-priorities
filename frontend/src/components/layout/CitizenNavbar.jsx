import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CitizenNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/citizen" className="font-fraunces text-2xl font-bold text-ink-navy">
          People's Priorities
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/citizen" className="text-gray-600 hover:text-marigold font-medium">Overview</Link>
          <Link to="/citizen/submit" className="text-gray-600 hover:text-marigold font-medium">Submit</Link>
          <Link to="/citizen/my-complaints" className="text-gray-600 hover:text-marigold font-medium">My Complaints</Link>
          <Link to="/citizen/schemes" className="text-gray-600 hover:text-marigold font-medium">Schemes</Link>
          
          <div className="flex items-center gap-4 pl-8 border-l border-gray-200">
            <span className="text-sm text-gray-500 font-mono">#{user?.ward || 'Ward 1'}</span>
            <button onClick={handleLogout} className="text-sm text-stamp-red font-bold uppercase">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CitizenNavbar;
