import { Box, styled, alpha } from '@mui/material';

const StyledContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 3,
    boxShadow: theme.palette.mode === 'dark' 
        ? '0 8px 32px rgba(0,0,0,0.4)'
        : '0 8px 32px rgba(0,0,0,0.08)',
    padding: theme.spacing(3),
    position: 'relative',
    backdropFilter: 'blur(10px)',
    background: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.95)
        : alpha(theme.palette.background.paper, 0.98),
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(5),
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: 1,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        pointerEvents: 'none'
    }
}));

export default function CreateContainer({ children }) {
    return (
        <StyledContainer>
            {children}
        </StyledContainer>
    );
}
