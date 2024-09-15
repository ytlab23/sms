import React from 'react';
import Sms from '../../components/shadcn/sms';
import { useLocation, Navigate } from 'react-router-dom';

const SmsPage: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id'); 
  return (
    <>
    {id ? <Sms numberId={id}></Sms> : <Navigate to="/" />}
    
    
    </>
  );
};

export default SmsPage;
