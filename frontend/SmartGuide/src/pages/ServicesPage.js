import React, { useEffect, useCallback, useState } from 'react';
import { usePaymentContext } from '../context/PaymentContext';
import Calculator from '../Services/Calculator/Calculator';
import PaidFeatures from '../Services/Payment/PaidFeatures';
import { useNavigate } from 'react-router-dom';
import { getUserPaymentStatus } from '../api/PaymentServices';
import './styles/ServicesPage.css'

const ServicesPage = () => {
    const { paymentStatus, updatePaymentStatus } = usePaymentContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize the navigation hook

    // Fetch the user's payment status
    const fetchPaymentStatus = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const status = await getUserPaymentStatus();
            console.log('Fetched payment status:', status);
            updatePaymentStatus(status);
        } catch (error) {
            setError('Error fetching payment status');
        } finally {
            setLoading(false);
        }
    }, [updatePaymentStatus]);

    // Fetch payment status on component mount
    useEffect(() => {
        fetchPaymentStatus();
    }, [fetchPaymentStatus]);

    const handlePremiumClick = () => {
        navigate('/payment'); // Navigate to the PaymentPage on button click
    };

    return (
        <div className="container-fluid">
            <div className='mb-2'>
            <h1 className="my-1 text-center">Welcome to the Services Page</h1>
            </div>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-danger text-center">Error: {error}</p>}

            {/* Always show the calculator */}
            <div className="calculator-section">
                <Calculator />
            </div>
            <div className='container-fluid'>
            {/* Show payment options if the user hasn't paid */}
            {paymentStatus !== 'paid' && !loading && (
                <div className="payment-options text-center mt-4">
                    <h2>Unlock Premium Features</h2>
                    <p>To access advanced features, please choose the Premium Plan:</p>
                    <button className="btn btn-success mx-2" onClick={handlePremiumClick}>
                        Premium Plan
                    </button>
                </div>
            )}
            </div>
            <div className='container-fluid'>
            {/* Show paid features if the user has paid */}
            {paymentStatus === 'paid' && !loading && (
                    <PaidFeatures />
            )}
            </div>
        </div>
    );
};

export default ServicesPage;
