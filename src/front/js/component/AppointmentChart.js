import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppointmentChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/statistics`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure you're passing auth token
                    }
                });
                const data = await response.json();
                prepareChartData(data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        const prepareChartData = (data) => {

            const labels = data.map(item => item.month);
            const appointmentsData = data.map(item => item.appointments);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Monthly Appointments',
                        data: appointmentsData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        };

        fetchData();
    }, []);

    if (!chartData) return <p>Loading chart...</p>;

    return (
        <div className="chart-container" style={{ width: '600px', margin: '0 auto', padding: '20px' }}>
            <h3 className="text-center">Monthly Appointments Overview</h3>
            <Bar data={chartData} options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Number of Appointments per Month',
                    },
                },
            }} />
        </div>
    );
};

export default AppointmentChart;
