import React, { useState } from 'react';
import PaymentModal from '../Services/Payment/PaymentModal'; // Adjust the import path if necessary
import './styles/PaymentPage.css';
import { FaTimes } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const PaymentPage = () => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <>
        <Header/>
        <div className="payment-page">
            <button 
                className="btn-close top-right"
                onClick={() => window.location.href = '/services'}
            >
                <FaTimes size={24} />
            </button>

            <div className="premium-features container-fluid">
                <div className="background-gif">
                    <h1 className="features-heading">Unlock Premium Features</h1>
                    <p className="features-description">Enjoy our exclusive features and enhancements by choosing one of the premium plans.</p>
                </div>
            </div>

            <div className="plan-container">
                <div className="plan-options">
                    <div className="plan-card monthly-plan">
                        <h2>Monthly Plan</h2>
                        <p className="price">30 Days</p>
                        <button className="btn-plan" onClick={handleShow}>Only $9.99</button>
                    </div>

                    <div className="plan-card six-month-plan">
                        <h2>Half-Yearly Plan</h2>
                        <p className="price">6 Months</p>
                        <button className="btn-plan" onClick={handleShow}>Only $49.99</button>
                    </div>

                    <div className="plan-card twelve-month-plan">
                        <h2>Yearly Plan</h2>
                        <p className="price">12 Months</p>
                        <button className="btn-plan" onClick={handleShow}>Only $99.99</button>
                    </div>
                </div>
            </div>

            <PaymentModal show={showModal} handleClose={handleClose} />
        </div>
         <Footer/>
         </>
    );
};

export default PaymentPage;
