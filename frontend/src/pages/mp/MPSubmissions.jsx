import React, { useEffect, useState } from 'react';
import MPNavbar from '../../components/layout/MPNavbar';
import StampBadge from '../../components/ui/StampBadge';
import { submissionService } from '../../services/submissionService';

const MPSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await submissionService.getAllSubmissions();
      setSubmissions(response.data);
    } catch (err) {
      console.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await submissionService.updateStatus(id, newStatus);
      fetchSubmissions();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <MPNavbar />
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-fraunces text-3xl font-bold text-ink-navy">Complaint Registry</h1>
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded text-sm">
              <option>All Wards</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded text-sm">
              <option>All Statuses</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID / Ward</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Content</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Theme</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-bold text-ink-navy">{s.ward}</div>
                    <div className="font-mono text-[10px] text-gray-400">#{s._id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{s.text_content}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(s.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-marigold uppercase">{s.theme}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StampBadge status={s.status} />
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                      value={s.status}
                      onChange={(e) => handleStatusChange(s._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_review">In Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MPSubmissions;
