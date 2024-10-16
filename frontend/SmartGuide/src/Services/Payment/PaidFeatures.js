import React, { useState } from 'react';
import ScientificCalculator from '../ScientificCalculator/ScientificCalculator';
import Graph from '../Graph/Graph';
import './PaidFeatures.css';

const PaidFeatures = () => {
    // State to control the visibility of the calculator
    const [showCalculator, setShowCalculator] = useState(false);

    // Function to toggle the calculator visibility
    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };

    return (
        <div className="paid-features container-fluid mt-5">
            <h2 className="text-center mb-4">Advanced Features</h2>
            {/* Button to toggle the calculator */}
                <button 
                    className="btn btn-primary mb-4" 
                    onClick={toggleCalculator}
                >
                    {showCalculator ? "Hide Scientific Calculator" : "Show Scientific Calculator"}
                </button>

            {/* Conditionally render the calculator based on state */}
            {showCalculator && (
                <div className="calculator-container mb-5">
                    <ScientificCalculator />
                </div>
            )}
            {/* Graph section */}
            <div className="graph-section">
                <h3 className="text-center">Graphs</h3>
                    <p className="graph-description text-center">
                            Below are the graphs representing the advanced scientific calculations.
                        </p>
                    <Graph />
                </div>
        </div>
    );
};

export default PaidFeatures;
