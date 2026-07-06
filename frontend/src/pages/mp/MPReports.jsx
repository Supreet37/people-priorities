import React, { useState } from 'react';
import MPNavbar from '../../components/layout/MPNavbar';
import api from '../../services/api';

const MPReports = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post('/mp/reports/generate', {
        period: 'last_30_days',
        wards: 'all'
      });
      setReport(response.data);
    } catch (err) {
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!report?.download_url) return;
    try {
      const path = report.download_url.replace(/^\/api/, ''); // baseURL already includes /api
      const response = await api.get(path, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.report_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report');
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <MPNavbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-fraunces text-3xl font-bold text-ink-navy mb-8">Executive Reports</h1>
        
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm max-w-2xl">
          <h3 className="text-xl font-bold mb-6">Generate New Report</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Period</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Financial Year 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ward Scope</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded">
                <option>All Wards</option>
                <option>Ward 1-5</option>
                <option>Ward 6-10</option>
              </select>
            </div>
            <button 
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-marigold text-white py-3 rounded font-bold hover:bg-opacity-90 transition-all"
            >
              {loading ? 'Generating...' : 'Generate PDF Report'}
            </button>
          </div>

          {report && (
            <div className="mt-12 p-6 bg-gray-50 rounded border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-ink-navy">{report.report_id}</h4>
                  <p className="text-xs text-gray-500">Generated on {new Date(report.generated_at).toLocaleString()}</p>
                </div>
                <span className="bg-moss text-white text-[10px] font-bold uppercase px-2 py-1 rounded">Ready</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">{report.summary}</p>
              <button onClick={handleDownload} className="text-marigold font-bold text-sm uppercase underline">Download Report</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MPReports;