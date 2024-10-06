import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import {
    Box,
    Link,
    Stack,
    Typography,
    IconButton
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Glass from '@mui/material/Paper';

// Icons
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Create a styled component for the glass effect
const GlassPanel = styled(Glass)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    borderRadius: 0,
    padding: theme.spacing(3),
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    width: '100%'
}));

const FooterWrapper = styled(Box)(
    ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    background-color: transparent;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
`
);

const SocialIcon = styled(IconButton)(
    ({ theme }) => `
    color: ${theme.palette.text.secondary};
    &:hover {
        color: ${theme.palette.primary.main};
    }
`
);

export default function Footer() {
    const { darkMode } = useContext(AppContext);

    const img = darkMode
        ? '/logo/xrpnft-logo-white.svg'
        : '/logo/xrpnft-logo-black.svg';

    return (
        <FooterWrapper>
            <GlassPanel elevation={0}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{ maxWidth: 'xxl', margin: '0 auto', width: '100%' }}
                >
                    <Link href="/" underline="none">
                        <Box
                            component="img"
                            src={img}
                            sx={{ height: 30 }}
                            alt="XRPNFT Logo"
                        />
                    </Link>
                    <Stack direction="row" spacing={2}>
                        <Link href="/explore" underline="hover" color="inherit">
                            <Typography variant="body2">Explore</Typography>
                        </Link>
                        <Link
                            href="/collections"
                            underline="hover"
                            color="inherit"
                        >
                            <Typography variant="body2">Collections</Typography>
                        </Link>
                        <Link href="/create" underline="hover" color="inherit">
                            <Typography variant="body2">Create</Typography>
                        </Link>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <SocialIcon
                            aria-label="Twitter"
                            href="https://twitter.com/XRPNFTdotcom/"
                            target="_blank"
                            size="small"
                        >
                            <TwitterIcon fontSize="small" />
                        </SocialIcon>
                        <SocialIcon
                            aria-label="Facebook"
                            href="https://www.facebook.com/xrpnft/"
                            target="_blank"
                            size="small"
                        >
                            <FacebookIcon fontSize="small" />
                        </SocialIcon>
                        <SocialIcon
                            aria-label="Instagram"
                            href="https://www.instagram.com/xrpnftdotcom"
                            target="_blank"
                            size="small"
                        >
                            <InstagramIcon fontSize="small" />
                        </SocialIcon>
                        <SocialIcon
                            aria-label="Discord"
                            href="https://xrpnft.com/discord"
                            target="_blank"
                            size="small"
                        >
                            <LinkedInIcon fontSize="small" />
                        </SocialIcon>
                    </Stack>
                </Stack>
            </GlassPanel>
        </FooterWrapper>
    );
}
