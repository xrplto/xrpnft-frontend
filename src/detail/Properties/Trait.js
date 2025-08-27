import Decimal from 'decimal.js';

import {
    Paper,
    Stack,
    Typography,
    Tooltip,
    useTheme,
    alpha,
} from '@mui/material';

export default function Trait({ prop, total, issuer, taxon, cslug }) {
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;
    
    const type = prop.type || prop.trait_type;
    const value = prop.value;
    const count = prop.count || 0;

    let rarity = 0;
    if (total > 0 && count > 0)
        rarity = new Decimal(count).mul(100).div(total).toDP(2, Decimal.ROUND_DOWN).toNumber();

    // Function to get color based on rarity percentage
    const getRarityColor = (percentage) => {
        if (percentage <= 1) {
            return '#9333ea'; // Mythic: Purple
        } else if (percentage <= 5) {
            return '#ef4444'; // Legendary: Red
        } else if (percentage <= 15) {
            return '#f97316'; // Epic: Orange
        } else if (percentage <= 35) {
            return '#eab308'; // Rare: Yellow
        } else if (percentage <= 60) {
            return '#3b82f6'; // Uncommon: Blue
        } else {
            return '#64748b'; // Common: Gray
        }
    };

    const rarityColor = rarity > 0 ? getRarityColor(rarity) : theme.palette.text.secondary;

    const tooltipTitle = total > 0 ? `${count} out of ${total} have this trait` : 'Rarity data not available';

    const handleClick = () => {
        const filterAttrs = [{
            trait_type: type,
            value: [value]
        }];
        
        // Create URL with proper encoding
        const params = new URLSearchParams();
        if (issuer) params.set('issuer', issuer);
        if (taxon) params.set('taxon', taxon);
        params.set('filterAttrs', JSON.stringify(filterAttrs));
        
        console.log('[Trait] Property clicked:', { 
            type, 
            value, 
            filterAttrs,
            issuer,
            taxon,
            cslug,
            url: cslug ? `/collection/${cslug}?${params.toString()}` : `/explore?${params.toString()}`,
            timestamp: new Date().toISOString()
        });
        
        if (cslug) {
            window.location.href = `/collection/${cslug}?${params.toString()}`;
        } else {
            window.location.href = `/explore?${params.toString()}`;
        }
    };

    return (
        <Tooltip title={tooltipTitle} arrow>
            <Paper
                onClick={handleClick}
                sx={{
                    width: '100%',
                    height: "100%",
                    borderRadius: '6px',
                    border: theme.palette.mode === 'dark' ? 
                        `1px solid ${alpha(theme.palette.divider, 0.08)}` :
                        `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                    padding: 1,
                    textAlign: 'center',
                    background: theme.palette.mode === 'dark' ?
                        alpha(theme.palette.background.paper, 0.3) :
                        alpha(theme.palette.background.paper, 0.5),
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: theme.palette.mode === 'dark' ?
                            `0 4px 8px ${alpha(theme.palette.common.black, 0.2)}` :
                            `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                        background: theme.palette.mode === 'dark' ?
                            alpha(theme.palette.background.paper, 0.5) :
                            alpha(theme.palette.background.paper, 0.8),
                    },
                }}
            >
                <Stack spacing={0.25}>
                    <Typography sx={{ 
                        overflowWrap: 'break-word', 
                        textTransform: 'uppercase', 
                        color: alpha(theme.palette.text.secondary, 0.6), 
                        fontWeight: 600, 
                        fontSize: 9,
                        letterSpacing: 0.5,
                    }}>
                        {type}
                    </Typography>
                    <Typography sx={{ fontWeight: 500, color: alpha(theme.palette.text.primary, 0.9), fontSize: 13 }}>
                        {value}
                    </Typography>
                    {total > 0 && (
                        <Typography sx={{ fontSize: 10, color: rarityColor, fontWeight: 500 }}>
                            {rarity}%
                        </Typography>
                    )}
                </Stack>
            </Paper>
        </Tooltip>
    );
}
