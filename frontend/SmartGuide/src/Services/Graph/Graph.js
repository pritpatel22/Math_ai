import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Graph.css';
import { Accordion } from 'react-bootstrap';
import MyChart from './Chart';

// Register all necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
);
// Function data generators
const generateSineData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Sine Function',
        data: Array.from({ length: 100 }, (_, i) => Math.sin((i - 50) * 0.1)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateCosineData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Cosine Function',
        data: Array.from({ length: 100 }, (_, i) => Math.cos((i - 50) * 0.1)),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateTangentData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Tangent Function',
        data: Array.from({ length: 100 }, (_, i) => Math.tan((i - 50) * 0.1)),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateLog10Data = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i + 1) * 0.1),
    datasets: [{
        label: 'Logarithm Base 10',
        data: Array.from({ length: 100 }, (_, i) => Math.log10((i + 1) * 0.1)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateLogData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i + 1) * 0.1),
    datasets: [{
        label: 'Natural Logarithm',
        data: Array.from({ length: 100 }, (_, i) => Math.log((i + 1) * 0.1)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateExponentialData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Exponential Function',
        data: Array.from({ length: 100 }, (_, i) => Math.exp((i - 50) * 0.1)),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateQuadraticData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Quadratic Function',
        data: Array.from({ length: 100 }, (_, i) => Math.pow((i - 50) * 0.1, 2)),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateCubicData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Cubic Function',
        data: Array.from({ length: 100 }, (_, i) => Math.pow((i - 50) * 0.1, 3)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateAbsoluteValueData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Absolute Value Function',
        data: Array.from({ length: 100 }, (_, i) => Math.abs((i - 50) * 0.1)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateSquareRootData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => i * 0.1),
    datasets: [{
        label: 'Square Root Function',
        data: Array.from({ length: 100 }, (_, i) => Math.sqrt(i * 0.1)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateCubeRootData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Cube Root Function',
        data: Array.from({ length: 100 }, (_, i) => Math.cbrt((i - 50) * 0.1)),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateLogisticData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Logistic Function',
        data: Array.from({ length: 100 }, (_, i) => 1 / (1 + Math.exp(-((i - 50) * 0.1)))),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateSinusoidalData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Sinusoidal Function',
        data: Array.from({ length: 100 }, (_, i) => 2 * Math.sin((i - 50) * 0.1) + 1),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generatePowerData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => i * 0.1),
    datasets: [{
        label: 'Power Function (x^2)',
        data: Array.from({ length: 100 }, (_, i) => Math.pow(i * 0.1, 2)),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateRationalData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Rational Function',
        data: Array.from({ length: 100 }, (_, i) => 1 / ((i - 50) * 0.1 + 1)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateGaussianData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Gaussian Function',
        data: Array.from({ length: 100 }, (_, i) => Math.exp(-Math.pow((i - 50) * 0.1, 2))),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateSinhData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Hyperbolic Sine Function',
        data: Array.from({ length: 100 }, (_, i) => Math.sinh((i - 50) * 0.1)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateCoshData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Hyperbolic Cosine Function',
        data: Array.from({ length: 100 }, (_, i) => Math.cosh((i - 50) * 0.1)),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

const generateTanhData = () => ({
    labels: Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1),
    datasets: [{
        label: 'Hyperbolic Tangent Function',
        data: Array.from({ length: 100 }, (_, i) => Math.tanh((i - 50) * 0.1)),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1,
        fill: true,
    }],
});

// Function descriptions and data
const functionData = [
    {
        name: 'Sine Function',
        description: 'Computes the sine of an angle, measured in radians. It oscillates between -1 and 1, modeling wave-like phenomena.',
        data: generateSineData()
    },
    {
        name: 'Cosine Function',
        description: 'Computes the cosine of an angle, measured in radians. It oscillates between -1 and 1, phase-shifted by π/2 compared to the sine function.',
        data: generateCosineData()
    },
    {
        name: 'Tangent Function',
        description: 'Computes the tangent of an angle, measured in radians. It has vertical asymptotes at odd multiples of π/2 and oscillates between -∞ and ∞.',
        data: generateTangentData()
    },
    {
        name: 'Logarithm Base 10',
        description: 'Computes the base-10 logarithm of a number, commonly used in scientific calculations.',
        data: generateLog10Data()
    },
    {
        name: 'Natural Logarithm',
        description: 'Computes the natural logarithm (base e) of a number, which is used in continuous growth models.',
        data: generateLogData()
    },
    {
        name: 'Exponential Function',
        description: 'Computes the exponential function, e^x. It models growth processes and has a rapid increase for positive x values.',
        data: generateExponentialData()
    },
    {
        name: 'Quadratic Function',
        description: 'Computes the quadratic function, x^2. It forms a parabola and is used in various applications such as projectile motion.',
        data: generateQuadraticData()
    },
    {
        name: 'Cubic Function',
        description: 'Computes the cubic function, x^3. It exhibits an S-shaped curve and can be used to model more complex growth processes.',
        data: generateCubicData()
    },
    {
        name: 'Absolute Value Function',
        description: 'Computes the absolute value of x, which returns the non-negative value of x. It creates a V-shaped graph.',
        data: generateAbsoluteValueData()
    },
    {
        name: 'Square Root Function',
        description: 'Computes the square root of x. It increases gradually and is used in various mathematical and physical contexts.',
        data: generateSquareRootData()
    },
    {
        name: 'Cube Root Function',
        description: 'Computes the cube root of x. It has a similar shape to the cubic function but with a more gradual slope.',
        data: generateCubeRootData()
    },
    {
        name: 'Logistic Function',
        description: 'Computes the logistic function, 1 / (1 + e^(-x)). It is used in population growth models and neural networks.',
        data: generateLogisticData()
    },
    {
        name: 'Sinusoidal Function',
        description: 'Computes a sinusoidal function with adjustable amplitude and frequency. It models periodic phenomena with more control over its properties.',
        data: generateSinusoidalData()
    },
    {
        name: 'Power Function',
        description: 'Computes the power function, x^n where n is a constant. It generalizes the quadratic and cubic functions.',
        data: generatePowerData()
    },
    {
        name: 'Rational Function',
        description: 'Computes a rational function, 1 / (x + 1). It has vertical asymptotes and is used in various applications such as fluid dynamics.',
        data: generateRationalData()
    },
    {
        name: 'Gaussian Function',
        description: 'Computes the Gaussian function, e^(-x^2). It forms a bell-shaped curve and is used in probability and statistics.',
        data: generateGaussianData()
    },
    {
        name: 'Hyperbolic Sine Function',
        description: 'Computes the hyperbolic sine function, sinh(x). It models hyperbolic waveforms and is used in various scientific contexts.',
        data: generateSinhData()
    },
    {
        name: 'Hyperbolic Cosine Function',
        description: 'Computes the hyperbolic cosine function, cosh(x). It complements the hyperbolic sine function and is used in similar applications.',
        data: generateCoshData()
    },
    {
        name: 'Hyperbolic Tangent Function',
        description: 'Computes the hyperbolic tangent function, tanh(x). It is used in machine learning and various scientific models.',
        data: generateTanhData()
    }
];

const Graph = () => {
    return (
        <section className="graph-container container-fluid mt-5">
            <div className='container-fluid'>
            <h2 className="mb-4">Mathematical Functions</h2>
            </div>
            <div className='container-fluid'>
            <Accordion defaultActiveKey="0">
                {functionData.map((func, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>{func.name}</Accordion.Header>
                        <Accordion.Body>
                            <p>{func.description}</p>
                            <MyChart
                                data={func.data}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: {
                                            display: true,
                                            text: func.name,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: { display: true, text: 'X' }
                                        },
                                        y: {
                                            title: { display: true, text: 'Y' }
                                        }
                                    }
                                }}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
            </div>
        </section>
    );
};

export default Graph;