import React, { useState, useEffect } from 'react';
import { create, all } from 'mathjs';
import './ScientificCalculator.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Initialize math.js
const math = create(all);

const ScientificCalculator = () => {
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

    const resultFontSize = result ? '24px' : fontSize;

    return (
        <section className="scientific-calculator">
            <div className="scientific-calculator-body">
                <h2 className="text-center mb-3">Scientific Calculator</h2>
                <div className="scientific-calculator-screen p-2 mb-2" style={{ height: screenHeight, overflow: 'hidden' }}>
                    <div className="input" style={{ fontSize }}>{input || '0'}</div>
                    <div className="result" style={{ fontSize: resultFontSize }}>{result}</div>
                </div>
                <div className="scientific-calculator-buttons">
                    <button className="btn btn-secondary" onClick={clearInput}>C</button>
                    <button className="btn btn-secondary" onClick={deleteLastCharacter}>⌫</button>
                    <button className="btn btn-secondary" onClick={() => handleButtonClick('(')}>(</button>
                    <button className="btn btn-secondary" onClick={() => handleButtonClick(')')}>)</button>
                    <button className="btn btn-danger" onClick={() => handleButtonClick('/')}>÷</button>
                    <button className="btn btn-danger" onClick={() => handleButtonClick('*')}>x</button>

                    <button className="btn btn-light" onClick={() => handleButtonClick('7')}>7</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('8')}>8</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('9')}>9</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('4')}>4</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('5')}>5</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('6')}>6</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('1')}>1</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('2')}>2</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('3')}>3</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('0')}>0</button>
                    <button className="btn btn-light" onClick={() => handleButtonClick('.')}>.</button>
                    <button className="btn btn-danger" onClick={() => handleButtonClick('-')}>-</button>

                    {/* Scientific functions */}
                    <button className="btn btn-info" onClick={() => handleButtonClick('sin(')}>sin</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('cos(')}>cos</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('tan(')}>tan</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('log(')}>log</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('ln(')}>ln</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('sqrt(')}>√</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('^')}>^</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('pi')}>π</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('e')}>e</button>

                    {/* Additional functions */}
                    <button className="btn btn-info" onClick={() => handleButtonClick('factorial(')}>x!</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('mod(')}>mod</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('exp(')}>exp</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('gamma(')}>gamma</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('ceil(')}>ceil</button>
                    <button className="btn btn-info" onClick={() => handleButtonClick('floor(')}>floor</button>

                    {/* Place the '=' button at the end */}
                    <button className="btn btn-primary span-three" onClick={calculateResult}>=</button>
                </div>
            </div>
        </section>
    );
};

export default ScientificCalculator;
