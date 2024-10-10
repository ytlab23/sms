import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FreeNumberPage: React.FC = () => {
  const [eligible, setEligible] = useState<boolean | null>(null); // Tracks if the user is eligible
  const [message, setMessage] = useState<string>('');             // Message to display to the user
  const [loading, setLoading] = useState<boolean>(true);          // Loading state
  const [error, setError] = useState<string | null>(null);        // Error message

  // Mock user ID for testing purposes (Replace this with actual user ID in production)
  const uid = 'test-user-123';

  // Function to check eligibility
  const checkEligibility = async () => {
    try {
      const response = await axios.get(`https://smsverify-server.vercel.app/api/check-free-number?uid=${uid}`);
      const { eligible, message } = response.data;
      setEligible(eligible);
      setMessage(message);
      setLoading(false);
    } catch (error) {
      setError('Failed to check eligibility');
      setLoading(false);
    }
  };

  // Function to claim free number
  const claimFreeNumber = async () => {
    try {
      const response = await axios.post('https://smsverify-server.vercel.app/api/claim-free-number', {
        uid,
        country: 'usa', // Replace with desired country or make it dynamic
        product: 'telegram', // Replace with desired product or make it dynamic
      });
      setMessage(response.data.message);
    } catch (error) {
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
