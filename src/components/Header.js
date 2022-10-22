import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import {
    alpha, styled,
    Box,
    Container,
    IconButton,
    Stack,
    Typography
} from '@mui/material';

// Iconify Icons
import { Icon } from '@iconify/react';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';

// Utils

// Components
import Logo from 'src/components/Logo';
import Wallet from 'src/components/Wallet';

const NotifyWrapper = styled(Box)(({ theme }) => `
    width: 100%;
    height: ${theme.spacing(3)};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${alpha(theme.colors.primary.main, 0.8)};
    margin-bottom: ${theme.spacing(0)};
    border-radius: 0px;
    border-bottom: 1px solid ${alpha('#CBCCD2', 0.2)};
`
);

const HeaderWrapper = styled(Box)(({ theme }) => `
    width: 100%;
    height: ${theme.spacing(10)};
    display: flex;
    align-items: center;
    background-color: ${theme.colors.alpha.white[10]};
    margin-bottom: ${theme.spacing(0)};
    border-radius: 0px;
    border-bottom: 1px solid ${alpha('#CBCCD2', 0.2)};
`
);

export default function Header(props) {
    const { toggleTheme, darkMode } = useContext(AppContext);
    return (
        <>
            <NotifyWrapper>
                <Stack alignItems="center">
                    <Typography variant="s6">You are on the XLS20 NFT-Devnet now. Your data may reset anytime without any notice.</Typography>
                </Stack>
            </NotifyWrapper>
            <HeaderWrapper>
                <Container maxWidth="xl">
                    <Box display="flex" alignItems="center" justifyContent="space-between" flex={2} sx={{pl:0, pr:0}}>
                        <Box>
                            <Logo />
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                            <Wallet />
                            <IconButton onClick={() => { toggleTheme() }} >
                                {darkMode ? (
                                    <Icon icon={baselineBrightnessHigh} />
                                ) : (
                                    <Icon icon={baselineBrightness4} />
                                )}
                            </IconButton>
                        </Stack>
                    </Box>
                </Container>
            </HeaderWrapper>
        </>
    );
}
