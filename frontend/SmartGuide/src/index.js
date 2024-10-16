import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './main/App';
import './main/styles/index.css'
import { AuthProvider } from './context/authContext';
import { PaymentProvider } from './context/PaymentContext'; // Import PaymentProvider

// Create a root.
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Initial render: Render your React component within both providers
root.render(
    <React.StrictMode>
        <AuthProvider>
            <PaymentProvider>
                <App />
            </PaymentProvider>
        </AuthProvider>
    </React.StrictMode>
);
