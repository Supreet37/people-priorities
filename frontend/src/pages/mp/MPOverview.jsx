import React, { useEffect, useState } from 'react';
import MPNavbar from '../../components/layout/MPNavbar';
import LedgerStat from '../../components/ui/LedgerStat';
import { dashboardService } from '../../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MPOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-20 text-center">Loading dashboard...</div>;

  const themeData = Object.entries(stats?.themes || {}).map(([name, value]) => ({ name, value }));
  const wardData = Object.entries(stats?.wards || {}).map(([name, value]) => ({ name, value }));

  const COLORS = ['#1B2A4A', '#E2962B', '#4B6B4F', '#A13D2E', '#667eea'];

  return (
    <div className="min-h-screen bg-paper">
      <MPNavbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-fraunces text-4xl font-bold text-ink-navy mb-12">Constituency Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <LedgerStat label="Total Received" value={stats?.total || 0} />
          <LedgerStat label="Pending Review" value={stats?.pending || 0} />
          <LedgerStat label="In Progress" value={stats?.in_review || 0} />
          <LedgerStat label="Resolved" value={stats?.resolved || 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-ink-navy mb-8">Submissions by Theme</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip cursor={{fill: '#f9fafb'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {themeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-ink-navy mb-8">Submissions by Ward</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f9fafb'}} />
                  <Bar dataKey="value" fill="#E2962B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPOverview;
