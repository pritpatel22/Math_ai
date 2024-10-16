import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/authContext';
import { PaymentProvider } from '../context/PaymentContext'; // Import PaymentProvider
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Home from '../pages/Home';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import CoursesPage from '../pages/CoursesPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import Privateroute from '../components/Privateroute';
import DashboardPage from '../pages/DashboardPage'; 
import SplashPage from '../pages/SplashPage'; 
import PaymentPage from '../pages/PaymentPage';
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <PaymentProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<SplashPage />} />
                        <Route path="/home" element={<><Header /><Home /><Footer /></>} />
                        <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
                        <Route path="/services" element={<><Header /><ServicesPage /><Footer /></>} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/courses" element={<><Header /><CoursesPage /><Footer /></>} />
                        <Route path="/login" element={<><Header /><LoginPage /><Footer /></>} />
                        <Route path="/signup" element={<><Header /><SignupPage /><Footer /></>} />
                        <Route
                            path="/dashboard"
                            element={
                                <Privateroute
                                    element={
                                        <>
                                            <Header />
                                            <DashboardPage />
                                            <Footer />
                                        </>
                                    }
                                />
                            }
                        />
                    </Routes>
                </Router>
            </PaymentProvider>
        </AuthProvider>
    );
}

export default App;
