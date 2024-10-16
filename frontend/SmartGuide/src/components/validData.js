// src/utils/validData.js

export const checkContact = (name, email, phoneNo) => {
    let nameMsg = '';
    let emailMsg = '';
    let phoneNoMsg = '';

    if (!name.trim()) {
        nameMsg = 'Full name is required.';
    }

    if (!email.trim()) {
        emailMsg = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        emailMsg = 'Email address is invalid.';
    }

    if (!phoneNo.trim()) {
        phoneNoMsg = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phoneNo)) {
        phoneNoMsg = 'Phone number must be exactly 10 digits.';
    }

    return { nameMsg, emailMsg, phoneNoMsg };
};

export const checkSignup = (firstName, lastName, email, mobileNumber, password, confirmPassword) => {
    let firstNameMsg = '';
    let lastNameMsg = '';
    let emailMsg = '';
    let mobileNumberMsg = '';
    let passwordMsg = '';
    let confirmPasswordMsg = '';

    if (!firstName.trim()) {
        firstNameMsg = 'First name is required.';
    }

    if (!lastName.trim()) {
        lastNameMsg = 'Last name is required.';
    }

    if (!email.trim()) {
        emailMsg = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        emailMsg = 'Email address is invalid.';
    }

    if (!mobileNumber.trim()) {
        mobileNumberMsg = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
        mobileNumberMsg = 'Mobile number must be exactly 10 digits.';
    }

    if (!password.trim()) {
        passwordMsg = 'Password is required.';
    } else if (password.length < 6) {
        passwordMsg = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
        confirmPasswordMsg = 'Passwords do not match.';
    }

    return { firstNameMsg, lastNameMsg, emailMsg, mobileNumberMsg, passwordMsg, confirmPasswordMsg };
};

export const checkLogin = (email, password) => {
    let emailMsg = '';
    let passwordMsg = '';

    if (!email.trim()) {
        emailMsg = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        emailMsg = 'Email address is invalid.';
    }

    if (!password.trim()) {
        passwordMsg = 'Password is required.';
    }

    return { emailMsg, passwordMsg };
};
