import axios from 'axios';
import { useState, useEffect, memo } from 'react';
import { Box, Stack, Typography, Chip, Link } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const History = memo(function History({ account }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const activityNames = {
        21: 'Create Sell Offer',
        22: 'Create Buy Offer', 
        23: 'Cancel Sell Offer',
        24: 'Cancel Buy Offer',
        25: 'Accept Buy Offer',
        26: 'Accept Sell Offer'
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/account/activity?account=${account}&page=0&limit=50`);
                if (response.data?.acts) {
                    setActivities(response.data.acts);
                }
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        if (account) {
            fetchHistory();
        }
    }, [account]);

    if (loading) {
        return null;
    }

    return (
        <Stack spacing={1}>
            {activities.map((activity, index) => (
                <Box
                    key={activity.time || index}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        '&:hover': { background: 'rgba(255,255,255,0.05)' }
                    }}
                >
                    <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140 }}>
                            {activityNames[activity.activity] || 'Activity'}
                        </Typography>
                        
                        {activity.data?.NFTokenID && (
                            <Link href={`/nft/${activity.data.NFTokenID}`} underline="none">
                                <Typography variant="caption" color="primary.main">
                                    {activity.data.NFTokenID.slice(0, 8)}...
                                </Typography>
                            </Link>
                        )}
                        
                        {activity.data?.cost?.amount && (
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                {activity.data.cost.amount} {activity.data.cost.currency}
                            </Typography>
                        )}
                        
                        <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(activity.time))} ago
                        </Typography>
                        
                        <Chip 
                            label={activity.activity === 21 ? 'Sell' : 'Buy'}
                            color={activity.activity === 21 ? 'success' : 'warning'}
                            size="small"
                        />
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
});

export default History;