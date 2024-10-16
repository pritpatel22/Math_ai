import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook
import LoginModal from './Home/LoginModal';

const Privateroute = ({ element: Element, ...rest }) => {
    const { isAuthenticated } = useAuth(); // Use the custom hook
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        if (isAuthenticated === false) {
            setShowModal(true);
        }
        if (isAuthenticated !== null) {
            setLoading(false); // Set loading to false when authentication status is determined
        }
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p> {/* Replace with a loading spinner if desired */}
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            {Element}
            {showModal && <LoginModal onClose={() => setShowModal(false)} />}
        </>
    );
};

export default Privateroute;
