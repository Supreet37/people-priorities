import React, { useEffect, useState } from 'react';
import CitizenNavbar from '../../components/layout/CitizenNavbar';
import { schemeService } from '../../services/schemeService';

const SchemesView = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await schemeService.getAll();
        setSchemes(response.data);
      } catch (err) {
        console.error('Failed to fetch schemes');
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <CitizenNavbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-fraunces text-3xl font-bold text-ink-navy mb-4">Constituency Schemes</h1>
        <p className="text-gray-500 mb-12">Stay updated on development projects and government initiatives in your area.</p>
        
        {loading ? (
          <p>Loading schemes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map((s) => (
              <div key={s._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${s.image_url || 'https://images.unsplash.com/photo-1622354573449-ce732931783f?fm=jpg&q=80&w=1200&auto=format&fit=crop'})` }}></div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-marigold">{s.category}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${s.status === 'completed' ? 'bg-moss text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {s.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-ink-navy mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 mb-6">{s.description}</p>
                  <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-gray-400">{s.ward}</span>
                    <button className="text-xs font-bold text-marigold uppercase">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesView;
