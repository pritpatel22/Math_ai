import React, { useState, useEffect } from 'react';
import { create, all } from 'mathjs';
import './Calculator.css';

// Initialize math.js
const math = create(all);

const Calculator = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [clearOnNextInput, setClearOnNextInput] = useState(false);
    const [fontSize, setFontSize] = useState('36px'); // Default font size
    const [screenHeight, setScreenHeight] = useState('auto'); // Height of the screen

    // Handle button click for number or operator
    const handleButtonClick = (value) => {
        if (clearOnNextInput) {
            setInput(value); // Start fresh
            setResult(''); // Clear the result
            setClearOnNextInput(false); // Reset the flag
            setScreenHeight('auto'); // Reset screen size
        } else {
            setInput((prevInput) => prevInput + value);
        }
    };

    // Clear input and result
    const clearInput = () => {
        setInput('');
        setResult('');
        setClearOnNextInput(false);
        setScreenHeight('auto'); // Reset screen size
    };

    // Delete the last character from input
    const deleteLastCharacter = () => {
        setInput((prevInput) => prevInput.slice(0, -1));
    };

    // Calculate result safely using math.js
    const calculateResult = () => {
        try {
            const evaluatedResult = math.evaluate(input);
            setResult(evaluatedResult);
            setClearOnNextInput(true);
            setScreenHeight('150px'); // Adjust screen size for result
        } catch (error) {
            console.error('Calculation error:', error);
            setResult('Error');
            setClearOnNextInput(true);
            setScreenHeight('150px'); // Adjust screen size for error
        }
    };

    // Adjust font size based on the length of input
    useEffect(() => {
        const lines = input.split('\n');
        const maxLength = Math.max(...lines.map(line => line.length));
        const maxFontSize = 36;
        const minFontSize = 16;
        const lineLimit = 20;

        // Calculate font size based on the number of characters
        const fontSize = Math.max(minFontSize, maxFontSize - (maxLength / lineLimit) * (maxFontSize - minFontSize));
        setFontSize(`${fontSize}px`);
    }, [input]);

    // Adjust font size when displaying result or error
    const resultFontSize = result ? '24px' : fontSize; // Smaller font size for result/error

    return (
        <section className="calculator justify-content-center align-items-center vh-100">
            <div className="calculator-body p-4 shadow-lg rounded d-flex flex-column">
                <h1 className="text-center mb-4">Calculator</h1>
                
                {/* Calculator screen for displaying input and result */}
                <div className="calculator-screen p-3 mb-3" style={{ height: screenHeight, overflow: 'hidden' }}>
                    <div className="input" style={{ fontSize }}>{input || '0'}</div>
                    <div className="result" style={{ fontSize: resultFontSize }}>{result}</div>
                </div>

                {/* Group buttons together logically */}
                <div className="calculator-buttons">
                    {/* Top row (Clear, Delete, Parentheses) */}
                    <button className="btn btn-secondary" onClick={clearInput}>C</button>
                    <button className="btn btn-secondary" onClick={deleteLastCharacter}>⌫</button>
                    <button className="btn btn-secondary" onClick={() => handleButtonClick('(')}>(</button>
                    <button className="btn btn-secondary" onClick={() => handleButtonClick(')')}>)</button>

                    {/* Numbers and Operators */}
                    <button className="btn btn-light" onClick={() => handleButtonClick('7')}>7</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('8')}>8</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('9')}>9</button>
                    <button className="btn btn-danger" onClick={() => handleButtonClick('*')}>&times;</button>

                    <button className="btn btn-light" onClick={() => handleButtonClick('4')}>4</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('5')}>5</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('6')}>6</button>
                    <button className="btn btn-danger" onClick={() => handleButtonClick('-')}>&minus;</button>

                    <button className="btn btn-light" onClick={() => handleButtonClick('1')}>1</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('2')}>2</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('3')}>3</button>
                    <button className="btn btn-danger" onClick={() => handleButtonClick('+')}>+</button>

                    {/* Zero, decimal, divide, equals */}
                    <button className="btn btn-light" style={{ gridColumn: 'span 2' }} onClick={() => handleButtonClick('0')}>0</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('.')}>.</button>
                    <button className="btn btn-danger" onClick={() => handleButtonClick('/')}>÷</button>

                    {/* Equals button */}
                    <button className="btn btn-primary" style={{ gridColumn: 'span 4' }} onClick={calculateResult}>=</button>
                </div>
            </div>
        </section>
    );
};

export default Calculator;
