// mathUtils.js

import { create, all } from 'mathjs';

const math = create(all);

/**
 * Evaluates a mathematical expression.
 * @param {string} expression - The mathematical expression to evaluate.
 * @returns {number|string} The result of the evaluation or 'Error' if invalid.
 */
export const evaluateExpression = (expression) => {
    try {
        return math.evaluate(expression);
    } catch (error) {
        return 'Error';
    }
};

/**
 * Integrates a mathematical function over a specified interval.
 * @param {string} expression - The mathematical function to integrate.
 * @param {number} a - The lower bound of the integration interval.
 * @param {number} b - The upper bound of the integration interval.
 * @returns {number|string} The result of the integration or 'Error' if invalid.
 */
export const integrateFunction = (expression, a, b) => {
    try {
        const integral = math.integral(expression, 'x').toMathML();
        return math.integrate(expression, math.range(a, b, 0.1)).toString();
    } catch (error) {
        return 'Error';
    }
};

/**
 * Differentiates a mathematical function with respect to x.
 * @param {string} expression - The mathematical function to differentiate.
 * @returns {string} The derivative of the function or 'Error' if invalid.
 */
export const differentiateFunction = (expression) => {
    try {
        return math.derivative(expression, 'x').toString();
    } catch (error) {
        return 'Error';
    }
};

/**
 * Evaluates a mathematical function at a given point.
 * @param {string} expression - The mathematical function to evaluate.
 * @param {number} x - The point at which to evaluate the function.
 * @returns {number|string} The result of the evaluation or 'Error' if invalid.
 */
export const evaluateFunctionAtPoint = (expression, x) => {
    try {
        return math.evaluate(expression, { x });
    } catch (error) {
        return 'Error';
    }
};
