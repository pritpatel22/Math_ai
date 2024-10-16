import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { usePaymentContext } from '../../context/PaymentContext';
import { updatePaymentStatus as updateStatusAPI } from '../../api/PaymentServices';
import './PaymentModal.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PaymentModal = ({ show, handleClose }) => {
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const { updatePaymentStatus } = usePaymentContext();
    const navigate = useNavigate();

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePayment = async () => {
        setLoading(true);
        setPaymentError('');
        try {
            // Simulate payment processing delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Update payment status in the backend
            const newStatus = 'paid';
            await updateStatusAPI(newStatus);

            // Update payment status in context
            updatePaymentStatus(newStatus);

            setPaymentSuccessful(true);

            // Redirect to services page after payment success
            setTimeout(() => {
                handleClose();
                navigate('/services');
            }, 2000);

        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal 
                show={show} 
                onHide={handleClose} 
                centered 
                className="payment-modal animate-modal"
                dialogClassName="modal-responsive"
            >
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title>Complete Your Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {paymentSuccessful ? (
                        <div className="success-screen" onClick={() => {
                            handleClose();
                            navigate('/services'); // Redirect to services page
                        }}>
                            <div className="success-content text-center animate-fadein">
                                <FaCheckCircle size={100} className="text-success mb-3 success-icon" />
                                <h4>Payment Successful!</h4>
                                <p>Your premium features are now unlocked.</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {paymentError && <p className="text-danger text-center">{paymentError}</p>}
                            <Form className="payment-form">
                                <Form.Group controlId="formPaymentMethod">
                                    <Form.Label>Select Payment Method</Form.Label>
                                    <div className="payment-options animate-slidein">
                                        <Form.Check
                                            type="radio"
                                            label="UPI"
                                            value="UPI"
                                            checked={paymentMethod === 'UPI'}
                                            onChange={handlePaymentMethodChange}
                                            className="payment-option"
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Credit/Debit Card"
                                            value="Card"
                                            checked={paymentMethod === 'Card'}
                                            onChange={handlePaymentMethodChange}
                                            className="payment-option"
                                        />
                                    </div>
                                </Form.Group>
                                {paymentMethod === 'UPI' && (
                                    <Form.Group controlId="formUpiId" className="animate-slidein">
                                        <Form.Label>UPI ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter UPI ID"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            className="input-field"
                                        />
                                    </Form.Group>
                                )}
                                {paymentMethod === 'Card' && (
                                    <div className="animate-slidein">
                                        <Form.Group controlId="formCardNumber">
                                            <Form.Label>Card Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Card Number"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                className="input-field"
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-between">
                                            <Form.Group controlId="formCvv" className="me-2">
                                                <Form.Label>CVV</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter CVV"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value)}
                                                    className="input-field"
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formExpiryDate">
                                                <Form.Label>Expiry Date</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(e.target.value)}
                                                    className="input-field"
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                )}
                            </Form>
                            {loading ? (
                                <div className="text-center mt-3">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Processing Payment...</span>
                                    </div>
                                </div>
                            ) : (
                                <Button 
                                    variant="primary" 
                                    onClick={handlePayment} 
                                    className="mt-3 w-100 animate-bounce"
                                >
                                    Pay
                                </Button>
                            )}
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Error Modal */}
            {paymentError && (
                <Modal show={paymentError !== ''} onHide={() => setPaymentError('')} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <FaTimesCircle size={50} className="text-danger mb-3" />
                        <p>{paymentError}</p>
                        <Button variant="danger" onClick={() => setPaymentError('')}>Close</Button>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default PaymentModal;
