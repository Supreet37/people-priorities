import React, { useEffect, useState } from 'react';

const StampBadge = ({ status }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'stamp-pending';
      case 'in_review': return 'stamp-in-review';
      case 'resolved': return 'stamp-resolved';
      case 'rejected': return 'stamp-rejected';
      default: return 'stamp-pending';
    }
  };

  return (
    <div className={`stamp-badge ${getStatusClass()} ${show ? 'scale-100 rotate-[-3deg]' : 'scale-150 rotate-0 opacity-0'} transition-all duration-150 ease-out`}>
      {status?.replace('_', ' ')}
    </div>
  );
};

export default StampBadge;
