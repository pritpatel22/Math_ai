import { useContext, useEffect, useState } from 'react';
import { PaymentContext } from '../context/PaymentContext';  // Adjust the path as needed
import { getUserPaymentStatus } from '../api/paymentService'; // Adjust the path as needed

/**
 * Custom hook to manage and retrieve the payment status of the user.
 * @returns {Object} An object containing the payment status and a loading state.
 */
const usePaymentStatus = () => {
    const { paymentStatus, setPaymentStatus } = useContext(PaymentContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const status = await getUserPaymentStatus();
                setPaymentStatus(status);
            } catch (error) {
                console.error('Error fetching payment status:', error);
                setPaymentStatus('error');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStatus();
    }, [setPaymentStatus]);

    return {
        paymentStatus,
        loading,
    };
};

export default usePaymentStatus;
