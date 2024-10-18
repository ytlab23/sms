import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/authcontext';

const FreeNumberPage: React.FC = () => {
  const [eligible, setEligible] = useState<boolean | null>(null); // Tracks if the user is eligible
  const [message, setMessage] = useState<string>('');             // Message to display to the user
  const [loading, setLoading] = useState<boolean>(true);          // Loading state
  const [error, setError] = useState<string | null>(null);  
  const { currentUser } = useAuth();
 
       // Error message

  // Mock user ID for testing purposes (Replace this with actual user ID in production)
  const uid = 'test-user-123';

  // Function to check eligibility
  




  // const checkEligibility = async () => {
  //   try {
  //     // Fetch the user's IP address
  //     const ipResponse = await axios.get('https://api.ipify.org?format=json');
  //     const userIp = ipResponse.data.ip;
  
  //     // Make the request to check eligibility, including the user IP in the query string
  //     const response = await axios.get(`http://localhost:3000/api/check-free-number?uid=${uid}&ip=${userIp}`);
      
  //     const { eligible, message } = response.data;
  //     setEligible(eligible);
  //     setMessage(message);
  //     setLoading(false);
  //   } catch (error) {
  //     setError('Failed to check eligibility');
  //     setLoading(false);
  //   }
  // };
  // const claimFreeNumber = async () => {
  //   try {
  //     // Fetch the user's IP address
  //     const ipResponse = await axios.get('https://api.ipify.org?format=json');
  //     const userIp = ipResponse.data.ip;
  //     console.log(uid);
  //     console.log(userIp);
  
  //     // Make the request to claim a free number, including the user IP in the request body
  //     const response = await axios.post('http://localhost:3000/api/claim-free-number', {
  //       uid: currentUser?.uid,
  //       country: 'russia', // Replace with desired country or make dynamic
  //       product: 'telegram', // Replace with desired product or make dynamic
  //       ip: userIp, // Send the IP from the client
  //     });
  
  //     setMessage(response.data.message);
  //   } catch (error) {
  //     setError('Failed to claim free number');
  //   }
  // };
  const checkEligibility = async () => {
    try {
      // Fetch the user's IP address
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const userIp = ipResponse.data.ip;
    
      // Make the request to check eligibility, including the user IP in the query string
      const response = await axios.get(`https://smsverify-server.vercel.app/api/check-free-number?uid=${currentUser?.uid}&ip=${userIp}`);
      
      const { eligible, message } = response.data;
      setEligible(eligible);
      setMessage(message);
      setLoading(false);
    } catch (error) {
      setError('Failed to check eligibility');
      setLoading(false);
    }
  };
  
  const claimFreeNumber = async () => {
    try {
      // Fetch the user's IP address
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const userIp = ipResponse.data.ip;
      
      // Check if uid is available and logged in correctly
      console.log(currentUser?.uid, "uid");
      console.log(userIp, "userIp");
      
      // Make the request to claim a free number, including the user IP in the request body
      const response = await axios.post('https://smsverify-server.vercel.app/api/claim-free-number', {
        uid: currentUser?.uid,  // Ensure uid is properly defined here
        country: 'russia', // Replace with dynamic country value if needed
        product: 'telegram', // Replace with dynamic product value if needed
        userIp: userIp, // Send the IP from the client
      });
    
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error claiming free number:', error);
      setError('Failed to claim free number');
    }
  };
  
    

  // Run eligibility check on component load
  useEffect(() => {
    checkEligibility();
  }, []);

  // UI to display while loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // UI to display if there's an error
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Free Number Eligibility</h1>

      {/* Display eligibility status */}
      {eligible !== null && (
        <>
          <p>{message}</p>

          {/* Button to claim free number if eligible */}
          {eligible && (
            <button onClick={claimFreeNumber} style={styles.button}>
              Claim Your Free Number
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Styles for the button
const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default FreeNumberPage;
