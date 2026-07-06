import React from 'react';

const LedgerStat = ({ label, value, subtext }) => {
  return (
    <div className="border-l-4 border-marigold pl-4 py-2">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-mono font-bold text-ink-navy">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
};

export default LedgerStat;
