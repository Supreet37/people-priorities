import React, { useEffect, useState } from 'react';
import CitizenNavbar from '../../components/layout/CitizenNavbar';
import StampBadge from '../../components/ui/StampBadge';
import { submissionService } from '../../services/submissionService';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await submissionService.getMySubmissions();
      setComplaints(response.data);
    } catch (err) {
      console.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await submissionService.delete(id);
        fetchComplaints();
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to delete');
      }
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <CitizenNavbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-fraunces text-3xl font-bold text-ink-navy mb-8">My Complaints</h1>
        
        {loading ? (
          <p>Loading your submissions...</p>
        ) : complaints.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {complaints.map((c) => (
              <div key={c._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {c.ward} / {c._id.slice(-4).toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-ink-text text-lg mb-4">{c.text_content}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-marigold">{c.theme}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400 capitalize">{c.input_type} input</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between gap-4">
                  <StampBadge status={c.status} />
                  {c.status === 'pending' && (
                    <div className="flex gap-4">
                      <button className="text-sm text-gray-500 hover:text-ink-navy font-bold uppercase">Edit</button>
                      <button 
                        onClick={() => handleDelete(c._id)}
                        className="text-sm text-stamp-red hover:text-opacity-80 font-bold uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
