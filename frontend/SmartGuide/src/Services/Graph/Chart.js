import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js'; // Import Chart.js and registerables
Chart.register(...registerables); // Register all necessary components

const MyChart = ({ data, options }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        
        // Destroy the existing chart if it exists
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        // Create a new chart instance
        const chart = new Chart(ctx, {
            type: 'bar', // Change this to your chart type
            data: data,
            options: options,
        });

        // Store the chart instance in the canvas context for cleanup
        ctx.chart = chart;

        // Cleanup on component unmount
        return () => {
            chart.destroy();
        };
    }, [data, options]);

    return <canvas ref={chartRef} />;
};

export default MyChart;
