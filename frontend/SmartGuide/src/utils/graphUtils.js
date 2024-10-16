// graphUtils.js

/**
 * Generates sample data for a linear function.
 * @param {number} start - The starting x value.
 * @param {number} end - The ending x value.
 * @param {number} step - The increment step for x values.
 * @param {Function} func - The function to evaluate.
 * @returns {Object} An object containing labels and dataset for Chart.js.
 */
export const generateLinearGraphData = (start, end, step, func) => {
    const labels = [];
    const data = [];

    for (let x = start; x <= end; x += step) {
        labels.push(x);
        data.push(func(x));
    }

    return {
        labels,
        datasets: [{
            label: 'Linear Function',
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
        }],
    };
};

/**
 * Generates sample data for a quadratic function.
 * @param {number} start - The starting x value.
 * @param {number} end - The ending x value.
 * @param {number} step - The increment step for x values.
 * @param {Function} func - The function to evaluate.
 * @returns {Object} An object containing labels and dataset for Chart.js.
 */
export const generateQuadraticGraphData = (start, end, step, func) => {
    const labels = [];
    const data = [];

    for (let x = start; x <= end; x += step) {
        labels.push(x);
        data.push(func(x));
    }

    return {
        labels,
        datasets: [{
            label: 'Quadratic Function',
            data,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
        }],
    };
};

/**
 * Generates sample data for a sine function.
 * @param {number} start - The starting x value (in radians).
 * @param {number} end - The ending x value (in radians).
 * @param {number} step - The increment step for x values.
 * @returns {Object} An object containing labels and dataset for Chart.js.
 */
export const generateSineGraphData = (start, end, step) => {
    const labels = [];
    const data = [];

    for (let x = start; x <= end; x += step) {
        labels.push(x);
        data.push(Math.sin(x));
    }

    return {
        labels,
        datasets: [{
            label: 'Sine Function',
            data,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
        }],
    };
};

/**
 * Generates sample data for a cosine function.
 * @param {number} start - The starting x value (in radians).
 * @param {number} end - The ending x value (in radians).
 * @param {number} step - The increment step for x values.
 * @returns {Object} An object containing labels and dataset for Chart.js.
 */
export const generateCosineGraphData = (start, end, step) => {
    const labels = [];
    const data = [];

    for (let x = start; x <= end; x += step) {
        labels.push(x);
        data.push(Math.cos(x));
    }

    return {
        labels,
        datasets: [{
            label: 'Cosine Function',
            data,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: false,
        }],
    };
};
