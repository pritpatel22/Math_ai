const API_URL = 'http://127.0.0.1:8000/api'; // Replace with your Django backend URL

export const loginUser = async (credentials) => {
    try {
        // Ensure credentials are defined
        if (!credentials || !credentials.username_or_email) {
            throw new Error('Username or email is required');
        }

        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username_or_email: credentials.username_or_email || '', // Ensure this matches the backend field
                password: credentials.password || '', // Send password if available, or empty for Google sign-in
                is_google_signin: credentials.is_google_signin || false, // Flag for Google sign-in
            }),
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error('Login failed:', responseData);
            throw new Error(responseData.error || 'Failed to login');
        }

        const responseData = await response.json();
        localStorage.setItem('token', responseData.token);
        return responseData;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};


export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to register');
        }

        return response.json();
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};
