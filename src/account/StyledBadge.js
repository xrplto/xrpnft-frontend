const { Badge, styled } = require('@mui/material');

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -10,
        top: -3,
        //   border: `1px solid ${theme.palette.background.paper}`,
        padding: '0 4px'
    }
}));

export default StyledBadge;
