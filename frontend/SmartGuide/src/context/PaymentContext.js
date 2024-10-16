import React, { createContext, useState, useContext } from 'react';

const PaymentContext = createContext({
    paymentStatus: 'pending',
    updatePaymentStatus: () => {}
});

export const PaymentProvider = ({ children }) => {
    const [paymentStatus, setPaymentStatus] = useState('pending');

    const updatePaymentStatus = (status) => {
        setPaymentStatus(status);
    };

    return (
        <PaymentContext.Provider value={{ paymentStatus, updatePaymentStatus }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePaymentContext = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePaymentContext must be used within a PaymentProvider');
    }
    return context;
};
