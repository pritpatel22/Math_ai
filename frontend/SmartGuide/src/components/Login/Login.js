import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth'; // Import the useAuth hook
import { Link, useNavigate } from 'react-router-dom';
import { checkLogin } from '../validData'; // Import your custom validation function
import './Login.css';
import GoogleSignInButton from '../FirebaseOauth/Google/GoogleSignInButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import icons

const Login = () => {
    const { login } = useAuth(); // Use the custom hook
    const [loginError, setLoginError] = useState('');
    const [formData, setFormData] = useState({
        username_or_email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle the password visibility
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const { username_or_email, password } = formData;

        // Use your custom validation function
        const validationErrors = checkLogin(username_or_email, password);
        setErrors(validationErrors);

        // If there are no validation errors, proceed with login
        if (!validationErrors.emailMsg && !validationErrors.passwordMsg) {
            try {
                setLoginError(''); // Clear previous errors

                const loginData = {
                    username_or_email,
                    password,
                };

                await login(loginData);
                navigate('/home'); // Redirect to home page upon successful login
            } catch (error) {
                setLoginError('Invalid username/email or password');
            }
        }
    };

    return (
        <section className="login">
            <div className="container">
                <div className="login-form">
                    <h2>Login</h2>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label>Email or Username</label>
                            <input 
                                type="text" 
                                name="username_or_email" 
                                value={formData.username_or_email}
                                onChange={handleChange}
                                placeholder="Enter your email or username"
                                className={`form-control ${errors.emailMsg ? 'is-invalid' : ''}`} 
                            />
                            <div className="error-message">{errors.emailMsg}</div>
                        </div>
                        <div className="form-group position-relative"> {/* Added position-relative for positioning the icon */}
                            <label>Password</label>
                            <input 
                                type={showPassword ? 'text' : 'password'} // Toggle input type
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-control ${errors.passwordMsg ? 'is-invalid' : ''}`} 
                            />
                            <div className="error-message">{errors.passwordMsg}</div>
                            <span className="toggle-password" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}> {/* Positioned icon */}
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        {loginError && <div className="error-message">{loginError}</div>}
                        <div className="button-container"> {/* Added a wrapper for buttons */}
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>
                    <div className="separator">
                        <div className="or-separator">
                            <span>or</span>
                        </div>
                    </div>
                    <div className="button-container"> {/* Added a wrapper for Google Sign-In button */}
                        <GoogleSignInButton redirectPath="/home" /> {/* Google Sign-In Button */}
                    </div>
                    <div className="link mt-3">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
