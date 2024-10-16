import React, { useState } from 'react';
import { auth, provider } from '../firebase'; // Adjust the path if necessary
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './GoogleSignUpButton.css';

const GoogleSignInButton = ({ isSignup = false }) => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get user information
            const { displayName, email } = user;

            // Split displayName into first and last name (if available)
            const [firstName, ...rest] = displayName ? displayName.split(' ') : [''];
            const lastName = rest.join(' ') || ''; // Join remaining parts as last name

            // Prepare user data
            const userData = {
                is_google_signup : true,
                firstname: firstName || 'Unknown', // Provide a default value if name is missing
                lastname: lastName || 'User', // Provide a default value if name is missing
                email: email || '' // Email is required; handle empty case properly
            };

            // Ensure email is not empty
            if (!userData.email) {
                throw new Error('Email is required for Google sign-up.');
            }
            // Send user data to backend for registration
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            console.log('after')

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to register user');
            }

            // Redirect to login page with a message
            navigate('/login', { state: { message: 'Registration successful! Please log in to continue.' } });
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            setError(error.message || 'An error occurred during Google sign-in or registration');
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
