import React from 'react';
import { Link } from 'react-router-dom';
import CitizenNavbar from '../../components/layout/CitizenNavbar';
import LedgerStat from '../../components/ui/LedgerStat';
import { useAuth } from '../../context/AuthContext';

const CitizenDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <CitizenNavbar />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="font-fraunces text-4xl font-bold text-ink-navy">Welcome back, {user?.name}</h1>
          <p className="text-gray-500 mt-2">Constituency Development Portal • {user?.ward}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <LedgerStat label="My Submissions" value="3" />
          <LedgerStat label="In Review" value="1" />
          <LedgerStat label="Resolved" value="2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-ink-navy mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/citizen/submit" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-marigold border-opacity-30 rounded-lg hover:bg-marigold hover:bg-opacity-5 transition-all group">
                <span className="text-3xl mb-2">📝</span>
                <span className="font-bold text-ink-navy group-hover:text-marigold">New Suggestion</span>
              </Link>
              <Link to="/citizen/schemes" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-moss border-opacity-30 rounded-lg hover:bg-moss hover:bg-opacity-5 transition-all group">
                <span className="text-3xl mb-2">🏛️</span>
                <span className="font-bold text-ink-navy group-hover:text-moss">View Schemes</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-ink-navy mb-6">Recent Updates</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start pb-4 border-b border-gray-100">
                <div className="w-2 h-2 mt-2 rounded-full bg-marigold"></div>
                <div>
                  <p className="text-sm font-bold">New Scheme Announced</p>
                  <p className="text-xs text-gray-500">Road repair work in {user?.ward} starting next week.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-moss"></div>
                <div>
                  <p className="text-sm font-bold">Complaint Resolved</p>
                  <p className="text-xs text-gray-500">Street light issue in Sector 4 has been fixed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
