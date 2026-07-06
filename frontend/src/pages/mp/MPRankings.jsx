import React, { useEffect, useState } from 'react';
import MPNavbar from '../../components/layout/MPNavbar';
import { dashboardService } from '../../services/dashboardService';
import { schemeService } from '../../services/schemeService';

const MPRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await dashboardService.getRankings();
      setRankings(response.data);
    } catch (err) {
      console.error('Failed to fetch rankings');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnounce = async (ranking) => {
    try {
      await schemeService.create({
        title: ranking.project_name,
        description: ranking.justification,
        ward: ranking.ward,
        category: ranking.theme,
        status: 'planned',
        linked_theme: ranking.theme
      });
      alert('Project announced as a new scheme!');
    } catch (err) {
      alert('Failed to announce scheme');
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <MPNavbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-fraunces text-3xl font-bold text-ink-navy mb-4">Priority Rankings</h1>
        <p className="text-gray-500 mb-12">AI-driven project recommendations based on citizen demand and infrastructure gaps.</p>
        
        <div className="space-y-6">
          {rankings.map((r, index) => (
            <div key={r._id} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center justify-center bg-gray-50 px-6 py-4 rounded border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase">Rank</span>
                <span className="text-4xl font-mono font-bold text-ink-navy">#{index + 1}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-bold text-ink-navy">{r.project_name}</h3>
                  <span className="bg-marigold bg-opacity-10 text-marigold px-2 py-0.5 rounded text-xs font-bold uppercase">{r.ward}</span>
                </div>
                <p className="text-gray-600 mb-6">{r.justification}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Priority Score</p>
                    <p className="font-mono text-xl font-bold text-ink-navy">{r.priority_score}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Demand Score</p>
                    <p className="font-mono text-xl font-bold text-marigold">{r.demand_score}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Gap Score</p>
                    <p className="font-mono text-xl font-bold text-moss">{r.gap_score}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Accessibility</p>
                    <p className="font-mono text-xl font-bold text-ink-navy">{r.accessibility_score}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <button 
                  onClick={() => handleAnnounce(r)}
                  className="bg-ink-navy text-white px-6 py-3 rounded font-bold hover:bg-opacity-90 transition-all whitespace-nowrap"
                >
                  Announce Scheme
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MPRankings;
