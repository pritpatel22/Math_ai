import React, { useState } from 'react';
import Signup from '../components/Signup/Signup';
import { useNavigate } from 'react-router-dom';  // Ensure the path is correct

const SignupPage = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleSignup = async (userData) => {
        console.log('handleSignup called with:', userData);  // Debug log
        setError(null);  // Reset any previous error

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            console.log('Response status:', response.status);

            // Check if response is OK
            if (!response.ok) {
                // If the response contains a JSON error message
                const errorData = await response.json();
                console.log('Error response data:', errorData);
                throw new Error(errorData.message || 'Signup failed');
            }

            const responseData = await response.json();  // Parse response data
            console.log('Signup successful, response:', responseData);

            navigate('/login', { state: { message: 'Login to complete the process' } });  // You can replace this with a redirect if needed

        } catch (err) {
            console.error('Error during signup:', err);
            setError(err.message);
        }
    };

    return (
        <div>
            <Signup onSignup={handleSignup} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignupPage;
