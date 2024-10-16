import React, { useEffect, useState } from 'react';
import './LoginModal.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginModal = ({ showModal, handleCloseModal, loading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(loading);

    useEffect(() => {
        setIsOpen(showModal);
        setIsLoading(loading);
    }, [showModal, loading]);

    const closeModal = () => {
        handleCloseModal();
    };

    return (
        <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} role="dialog" aria-hidden={!isOpen}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content home-modal">
                    <div className="modal-header modal-header">
                        <h5 className="modal-title modal-title">
                            <i className="fas fa-user-lock"></i> Login Required
                        </h5>
                        <button type="button" className="close" onClick={closeModal} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body modal-body">
                        {isLoading ? (
                            <div className="text-center">
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <p>Loading...</p>
                            </div>
                        ) : (
                            <p className="text-center">Please log in or sign up to continue.</p>
                        )}
                    </div>
                    {!isLoading && (
                        <div className="modal-footer modal-footer">
                            <a href="/login" className="modal-link">Login</a>
                            <span>/</span>
                            <a href="/signup" className="modal-link">Signup</a>
                        </div>
                    )}
                </div>
            </div>
            {isOpen}
        </div>
    );
};

export default LoginModal;
