import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import SMSStats from '../../components/shadcn/statistics';

const StatsPage: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id'); 
  return (
    <>
    <SMSStats />
    
    
    </>
  );
};

export default StatsPage;
