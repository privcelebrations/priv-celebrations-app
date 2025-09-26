import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AnalyticsCard from './AnalyticsCard';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';

// Register all necessary components for Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
);

const AnalyticsView = ({ analytics, chartData }) => {
    const [lineChart, setLineChart] = useState(null);
    const [pieChart, setPieChart] = useState(null);

    // This effect processes the raw data from props into a format Chart.js can use
    useEffect(() => {
        if (chartData) {
            // Process data for the Line chart (Bookings by Day)
            const lineLabels = chartData.bookingsByDay.map(d => new Date(d.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
            const lineValues = chartData.bookingsByDay.map(d => d.count);
            setLineChart({
                labels: lineLabels,
                datasets: [{
                    label: 'Bookings per Day (Last 30 Days)',
                    data: lineValues,
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            });

            // Process data for the Pie chart (Package Popularity)
            const pieLabels = chartData.packagePopularity.map(p => p.package_name);
            const pieValues = chartData.packagePopularity.map(p => p.count);
            setPieChart({
                labels: pieLabels,
                datasets: [{
                    label: 'Package Bookings',
                    data: pieValues,
                    backgroundColor: ['#D4AF37', '#B8941F', '#A08A45', '#8a7a50', '#73684a', '#5f5740'],
                    borderColor: '#1e1e1e',
                    borderWidth: 2,
                }]
            });
        }
    }, [chartData]);

    // Common options for both charts to ensure consistent styling
    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#a0a0a0', // Text color for the legend
                    font: {
                        family: "'Manrope', sans-serif"
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: { color: '#a0a0a0', stepSize: 1 },
                grid: { color: '#333' }
            },
            x: {
                ticks: { color: '#a0a0a0' },
                grid: { color: '#333' }
            }
        }
    };

    const pieChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#a0a0a0',
                    font: {
                        family: "'Manrope', sans-serif"
                    }
                }
            }
        }
    };

    return (
        <div>
            <section className="analytics-cards">
                <AnalyticsCard title="Total Bookings" value={analytics?.totalBookings || 0} />
                <AnalyticsCard title="Total Inquiries" value={analytics?.totalContacts || 0} />
                <AnalyticsCard title="Bookings This Month" value={analytics?.monthlyBookings || 0} />
                <AnalyticsCard title="Most Popular Theatre" value={analytics?.popularTheatre || 'N/A'} />
            </section>
            
            <section className="charts-section">
                <div className="chart-container" style={{ height: '400px' }}>
                    <h3>Booking Trends</h3>
                    {lineChart ? <Line data={lineChart} options={chartOptions} /> : <p>Loading chart data...</p>}
                </div>
                <div className="chart-container" style={{ height: '400px' }}>
                    <h3>Package Popularity</h3>
                    {pieChart ? <Pie data={pieChart} options={pieChartOptions} /> : <p>No package data to display.</p>}
                </div>
            </section>
        </div>
    );
};

export default AnalyticsView;