import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import GoogleSignUpButton from '../FirebaseOauth/Google/GoogleSignUpButton'; // Adjust the path if necessary
import { checkSignup } from '../validData'; // Adjust the path if necessary
import './Signup.css'; // Ensure this CSS file contains your form styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import icons

const Signup = ({ onSignup }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
    const [showPopup, setShowPopup] = useState(false);
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            mobile: '',
            password: '',
            confirmPassword: ''
        },
        validate: (values) => {
            const { firstname, lastname, email, mobile, password, confirmPassword } = values;
            const errors = {};
            const { firstNameMsg, lastNameMsg, emailMsg, mobileNumberMsg, passwordMsg, confirmPasswordMsg } = checkSignup(
                firstname,
                lastname,
                email,
                mobile,
                password,
                confirmPassword
            );

            if (firstNameMsg) errors.firstname = firstNameMsg;
            if (lastNameMsg) errors.lastname = lastNameMsg;
            if (emailMsg) errors.email = emailMsg;
            if (mobileNumberMsg) errors.mobile = mobileNumberMsg;
            if (passwordMsg) errors.password = passwordMsg;
            if (confirmPasswordMsg) errors.confirmPassword = confirmPasswordMsg;

            return errors; // Formik expects an object, {} means no errors
        },

        onSubmit: async (values) => {
            console.log('Form Submitted:', values); // Add this line to check form values
            setIsLoading(true);
            try {
                if (typeof onSignup === 'function') {
                    await onSignup(values);
                    setUserInfo({ username: values.email, password: values.password }); // Set user info
                    setShowPopup(true); // Show the popup
                    navigate('/login'); // Redirect to login page upon successful signup
                } else {
                    console.error('onSignup is not a function');
                }
            } catch (error) {
                console.error('Signup failed:', error);
            } finally {
                setIsLoading(false);
            }
        }

    });

    const closePopup = () => setShowPopup(false);

    return (
        <section className="signup">
            <div className="signup-container">
                <div className="signup-form">
                    <h2>Sign Up</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstname">First Name</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formik.values.firstname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.firstname && formik.errors.firstname ? 'error-input' : ''}
                            />
                            {formik.touched.firstname && formik.errors.firstname ? (
                                <div className="error-message">{formik.errors.firstname}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Last Name</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formik.values.lastname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.lastname && formik.errors.lastname ? 'error-input' : ''}
                            />
                            {formik.touched.lastname && formik.errors.lastname ? (
                                <div className="error-message">{formik.errors.lastname}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.email && formik.errors.email ? 'error-input' : ''}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="error-message">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number</label>
                            <input
                                type="text"
                                id="mobile"
                                name="mobile"
                                value={formik.values.mobile}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.mobile && formik.errors.mobile ? 'error-input' : ''}
                            />
                            {formik.touched.mobile && formik.errors.mobile ? (
                                <div className="error-message">{formik.errors.mobile}</div>
                            ) : null}
                        </div>
                        <div className="form-group position-relative"> {/* Added position-relative for icons */}
                            <label htmlFor="password">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'} // Toggle input type
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.password && formik.errors.password ? 'error-input' : ''}
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="error-message">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className="form-group position-relative"> {/* Added position-relative for confirm password */}
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'} // Toggle input type
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error-input' : ''}
                            />
                            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </span>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="error-message">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                        <div className='button-container'>
                        <button type="submit" className="submit-button">
                            {isLoading ? <div className="loading-spinner"></div> : 'Sign Up'}
                        </button>
                        </div>
                    </form>
                    <div className="or-separator">
                        <span>or</span>
                    </div>
                    <div className='button-container'>
                    <GoogleSignUpButton isSignUp={true} />
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Sign-Up Successful!</h3>
                        <p><strong>Username:</strong> {userInfo.username}</p>
                        <p><strong>Password:</strong> {userInfo.password}</p>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Signup;
