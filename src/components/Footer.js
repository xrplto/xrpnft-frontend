import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { Box, Link, Stack, Typography, IconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Glass from '@mui/material/Paper';

// Icons
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Remove the GlassPanel styled component as we won't need it anymore

const FooterWrapper = styled(Box)(
    ({ theme }) => `
    width: 100%;
    background-color: ${theme.palette.background.paper};
    padding: ${theme.spacing(3)};
    margin-top: auto; // This will push the footer to the bottom
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
        </FooterWrapper>
    );
}
