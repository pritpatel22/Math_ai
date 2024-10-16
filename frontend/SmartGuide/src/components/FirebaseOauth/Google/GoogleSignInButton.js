// src/components/GoogleSignInButton.js
import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth'; // Import the useAuth hook
import './GoogleSignInButton.css';

const GoogleSignInButton = ({ isSignup = false }) => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Use the custom hook to access the login function
    const [error, setError] = useState(null);

    const handleGoogleSignIn = async () => {
        setError(''); // Clear previous errors
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const { email } = user;

            // Prepare the data to send to the backend for login
            const loginData = {
                username_or_email: email,
                is_google_signin: true, // This flag tells the backend it's a Google sign-in
            };

            // Call the login function from the useAuth hook
            await login(loginData);

            // Redirect to the home page upon successful login
            navigate('/home');
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            setError('An error occurred during Google sign-in.');
        }
    };

    return (
        <div>
            <button onClick={handleGoogleSignIn} className="btn btn-danger google-signin-btn">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="google-logo" />
                {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default GoogleSignInButton;
