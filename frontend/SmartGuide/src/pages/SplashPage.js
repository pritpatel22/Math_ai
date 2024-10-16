import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SplashPage.css'; // Import the CSS file

const SplashPage = () => {
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate(); // Use useNavigate instead of useHistory
    
        const handleStart = () => {
            setLoading(true);
            setTimeout(() => {
                navigate('/home'); // Redirect to HomePage after transition
            }, 1000); // Adjust the transition duration if needed
        };
    return (
        <div className={`splash-page ${loading ? 'fade-out' : ''}`}>
            <h1 className="splash-title">Smart Guide</h1>
            <button className="start-button" onClick={handleStart}>Get Started</button>
        </div>
    );
};

export default SplashPage;
