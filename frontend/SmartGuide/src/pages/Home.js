import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import './styles/Home.css';
import Hero from '../components/Home/Hero';
import useAuth from '../hooks/useAuth';
import LoginModal from '../components/Home/LoginModal';
import ImageUpload from '../components/Home/ImageUpload'; // Import ImageUpload component
import { ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            const modalTimer = setInterval(() => {
                setShowModal(true);
            }, 20000); // 20 seconds interval

            const startTimer = setTimeout(() => {
                setShowModal(true);
            }, 10000); // 10 seconds delay

            return () => {
                clearTimeout(startTimer);
                clearInterval(modalTimer);
            };
        }
    }, [isAuthenticated]);

    return (
        <div className="home-container">
            <Hero />
            <div className="content-section">
                {isAuthenticated ? (
                    <div className="authenticated-content">
                        <Row className="justify-content-center mt-4">
                            <Col md={8} className="text-center">
                                <h1 className="animate-fadein">PhotoMath</h1>
                                <p className="animate-fadein delay-1s"> 
                                    Simply upload an image of your math problem, and we'll do the rest.
                                </p>
                                <ImageUpload />

                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div className="guest-content text-center">
                        <h1>Welcome to Smart Guide</h1>
                        <p>Please log in to upload images and solve equations.</p>
                    </div>
                )}
            </div>
            <LoginModal 
                showModal={showModal} 
                handleCloseModal={() => setShowModal(false)}
            />
            <ToastContainer /> {/* Add ToastContainer for Toastify notifications */}
        </div>
    );
};

export default Home;
