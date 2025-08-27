import React, { useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    useTheme,
    alpha,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function HistoryChart({ history }) {
    const theme = useTheme();
    const [chartType, setChartType] = React.useState('price');

    const chartData = useMemo(() => {
        if (!history || history.length === 0) return null;

        // Sort by date
        const sortedHistory = [...history].sort((a, b) => (a.date || 0) - (b.date || 0));

        // Price over time chart
        const priceData = {
            labels: [],
            datasets: [{
                label: 'Sale Price (XRP)',
                data: [],
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: theme.palette.primary.main,
                pointBorderColor: theme.palette.background.paper,
                pointBorderWidth: 2
            }]
        };

        // Activity by type chart
        const typeCount = {
            'Sale': 0,
            'Listing': 0,
            'Transfer': 0,
            'Buy Offer': 0,
            'Mint': 0,
            'Cancel': 0
        };

        // Volume over time (monthly aggregation)
        const volumeByMonth = {};
        const activityByMonth = {};

        sortedHistory.forEach((tx) => {
            // Count types
            if (typeCount[tx.type] !== undefined) {
                typeCount[tx.type]++;
            }

            // Process sales for price chart
            if (tx.type === 'Sale' && tx.amount) {
                const date = new Date((tx.date + 946684800) * 1000);
                const dateStr = date.toLocaleDateString();
                
                let price = 0;
                if (typeof tx.amount === 'string') {
                    price = parseFloat(tx.amount) / 1000000; // Convert drops to XRP
                } else if (tx.amount.currency === 'XRP') {
                    price = parseFloat(tx.amount.value) / 1000000;
                }
                
                if (price > 0) {
                    priceData.labels.push(dateStr);
                    priceData.datasets[0].data.push(price);
                }
            }

            // Aggregate monthly data
            if (tx.date) {
                const date = new Date((tx.date + 946684800) * 1000);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                // Count activities
                activityByMonth[monthKey] = (activityByMonth[monthKey] || 0) + 1;
                
                // Sum volume for sales
                if (tx.type === 'Sale' && tx.amount) {
                    let amount = 0;
                    if (typeof tx.amount === 'string') {
                        amount = parseFloat(tx.amount) / 1000000;
                    } else if (tx.amount.value) {
                        amount = parseFloat(tx.amount.value) / 1000000;
                    }
                    volumeByMonth[monthKey] = (volumeByMonth[monthKey] || 0) + amount;
                }
            }
        });

        // Activity bar chart data
        const activityData = {
            labels: Object.keys(typeCount),
            datasets: [{
                label: 'Transaction Count',
                data: Object.values(typeCount),
                backgroundColor: [
                    '#10b981', // Sale - green
                    '#ef4444', // Listing - red
                    '#f59e0b', // Transfer - orange
                    '#3b82f6', // Buy Offer - blue
                    '#8b5cf6', // Mint - purple
                    '#6b7280', // Cancel - gray
                ],
                borderWidth: 0,
                borderRadius: 4
            }]
        };

        // Monthly activity chart
        const months = Object.keys(activityByMonth).sort();
        const monthlyActivityData = {
            labels: months.map(m => {
                const [year, month] = m.split('-');
                return `${month}/${year.slice(-2)}`;
            }),
            datasets: [{
                label: 'Monthly Transactions',
                data: months.map(m => activityByMonth[m]),
                borderColor: theme.palette.info.main,
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                fill: true,
                tension: 0.3
            }]
        };

        // Monthly volume chart
        const volumeMonths = Object.keys(volumeByMonth).sort();
        const monthlyVolumeData = {
            labels: volumeMonths.map(m => {
                const [year, month] = m.split('-');
                return `${month}/${year.slice(-2)}`;
            }),
            datasets: [{
                label: 'Monthly Volume (XRP)',
                data: volumeMonths.map(m => volumeByMonth[m]),
                backgroundColor: alpha(theme.palette.success.main, 0.7),
                borderColor: theme.palette.success.main,
                borderWidth: 2,
                borderRadius: 4
            }]
        };

        return {
            price: priceData,
            activity: activityData,
            monthlyActivity: monthlyActivityData,
            monthlyVolume: monthlyVolumeData
        };
    }, [history, theme]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        if (chartType === 'price' || chartType === 'volume') {
                            return `${context.parsed.y.toFixed(2)} XRP`;
                        }
                        return `${context.parsed.y} transactions`;
                    }
                }
            }
        },
        scales: chartType !== 'types' ? {
            x: {
                grid: {
                    display: false,
                    borderColor: theme.palette.divider
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    font: { size: 11 },
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                grid: {
                    color: alpha(theme.palette.divider, 0.1),
                    borderColor: theme.palette.divider
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    font: { size: 11 },
                    callback: function(value) {
                        if (chartType === 'price' || chartType === 'volume') {
                            return `${value} XRP`;
                        }
                        return value;
                    }
                }
            }
        } : {
            x: {
                grid: {
                    display: false,
                    borderColor: theme.palette.divider
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    font: { size: 11 }
                }
            },
            y: {
                grid: {
                    color: alpha(theme.palette.divider, 0.1),
                    borderColor: theme.palette.divider
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    font: { size: 11 }
                }
            }
        }
    };

    if (!chartData) {
        return (
            <Box sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    No history data to visualize
                </Typography>
            </Box>
        );
    }

    const getChartComponent = () => {
        switch(chartType) {
            case 'price':
                return chartData.price.labels.length > 0 ? (
                    <Line data={chartData.price} options={chartOptions} />
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                        No sale history
                    </Typography>
                );
            case 'types':
                return <Bar data={chartData.activity} options={chartOptions} />;
            case 'timeline':
                return chartData.monthlyActivity.labels.length > 0 ? (
                    <Line data={chartData.monthlyActivity} options={chartOptions} />
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                        No timeline data
                    </Typography>
                );
            case 'volume':
                return chartData.monthlyVolume.labels.length > 0 ? (
                    <Bar data={chartData.monthlyVolume} options={chartOptions} />
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                        No volume data
                    </Typography>
                );
            default:
                return null;
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 2,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                borderRadius: 2
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                        Analytics
                    </Typography>
                    <ToggleButtonGroup
                        size="small"
                        value={chartType}
                        exclusive
                        onChange={(e, newType) => newType && setChartType(newType)}
                        sx={{
                            '& .MuiToggleButton-root': {
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.7rem',
                                textTransform: 'none',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                '&.Mui-selected': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                    color: theme.palette.primary.main
                                }
                            }
                        }}
                    >
                        <ToggleButton value="price">Price</ToggleButton>
                        <ToggleButton value="types">Types</ToggleButton>
                        <ToggleButton value="timeline">Activity</ToggleButton>
                        <ToggleButton value="volume">Volume</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                
                <Box sx={{ height: 250, position: 'relative' }}>
                    {getChartComponent()}
                </Box>
            </Stack>
        </Paper>
    );
}