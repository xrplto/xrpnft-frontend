import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { Box, Link, Stack, Typography, IconButton } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Glass from '@mui/material/Paper';

// Icons
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Custom components
import Logo from './Logo';

const FooterWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 -8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
    padding: theme.spacing(3, 0),
    paddingBottom: theme.spacing(8),
    marginTop: 'auto',
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&:hover': {
        color: theme.palette.primary.main,
    },
}));

export default function Footer() {
    const { darkMode } = useContext(AppContext);
    const theme = useTheme();

    return (
        <FooterWrapper>
            <Box sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: '100%' }}
                >
                    <Logo />
                    <Stack direction="row" spacing={2}>
                        <StyledLink href="/explore" underline="hover">
                            <Typography variant="body2">Explore</Typography>
                        </StyledLink>
                        <StyledLink href="/collections" underline="hover">
                            <Typography variant="body2">Collections</Typography>
                        </StyledLink>
                        <StyledLink href="/create" underline="hover">
                            <Typography variant="body2">Create</Typography>
                        </StyledLink>
                        <StyledLink href="/terms" underline="hover">
                            <Typography variant="body2">Terms</Typography>
                        </StyledLink>
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
            </Box>
        </FooterWrapper>
    );
}
