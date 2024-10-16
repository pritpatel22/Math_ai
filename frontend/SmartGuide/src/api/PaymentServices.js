const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fetches the user's payment status.
 */
export const getUserPaymentStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/get-payment-status/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch payment status');
        }

        const data = await response.json();

        // Ensure that we correctly extract the status from the response
        if (data && data.status) {
            console.log('Fetched payment status:', data.status);  // Log for debugging
            return data.status;  // Return the payment status
        } else {
            throw new Error('Invalid payment status format');
        }

    } catch (error) {
        console.error('Error fetching payment status:', error);
        throw error;
    }
};


/**
 * Updates the user's payment status.
 */
export const updatePaymentStatus = async (status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/update-payment-status/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ status: status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update payment status');
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
};
