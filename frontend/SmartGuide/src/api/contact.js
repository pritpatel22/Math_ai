// src/api/contact.js
const API_URL = 'http://localhost:8000/api'; // Replace with your backend URL

export const sendContactMessage = async (messageData) => {
    const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
    });
    if (!response.ok) {
        throw new Error('Failed to send message');
    }
    return response.json();
};
