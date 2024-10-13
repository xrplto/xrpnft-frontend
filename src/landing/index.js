// React
import React, { useState, useEffect } from 'react';

// Material
import {
    styled,
    Button,
    Grid,
    Link,
    Stack,
    Typography,
    Container,
    Box,
    Paper,
    Avatar,
    Fab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';

// Components
import CollectionPreview from './CollectionPreview';
import CollectionList from './CollectionList';

// Add this import at the top of the file
import Image from 'next/image';

const AutoStack = styled(Stack)(
    ({ theme }) => `
        align-items: center;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            align-items: flex-start;
        }
    `
);

const GradientTypography = styled(Typography)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

const HeroButton = styled(Button)(
    ({ theme }) => `
        padding: 12px 24px;
        font-weight: 600;
        font-size: 1rem;
        text-transform: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        &.MuiButton-contained {
            background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
            color: ${theme.palette.common.white};
            border: none;

            &:hover {
                background: linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark});
            }
        }

        &.MuiButton-outlined {
            border: 2px solid ${theme.palette.primary.main};
            color: ${theme.palette.primary.main};

            &:hover {
                background: rgba(${theme.palette.primary.main}, 0.05);
            }
        }
    `
);

// Update the float keyframe
const float = keyframes`
  0% { transform: scale(0.8) translateY(0px); opacity: 0; }
  50% { transform: scale(1.1) translateY(-10px); opacity: 1; }
  100% { transform: scale(1) translateY(0px); opacity: 1; }
`;

// Update the ChatMessage styled component
const ChatMessage = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    maxWidth: '200px',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    animation: `${float} 2s ease-in-out forwards`, // Reduced from 3s to 2s
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    opacity: 0,
    zIndex: 10,
    pointerEvents: 'none'
}));

// Add this new styled component for the animated text
const AnimatedText = styled(Box)(({ theme }) => ({
    display: 'inline-block',
    minWidth: '200px',
    fontWeight: 'bold',
    color: theme.palette.primary.main
}));

// Update the useRandomMessages hook
const useRandomMessages = (messages, minDelay = 2000, maxDelay = 4000) => {
    const [visibleMessages, setVisibleMessages] = useState([]);

    useEffect(() => {
        const showNextMessage = () => {
            const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];
            const newMessage = {
                ...randomMessage,
                key: Date.now(),
                position: {
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`
                }
            };

            setVisibleMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage];
                if (updatedMessages.length > 3) {
                    updatedMessages.shift();
                }
                return updatedMessages;
            });

            const nextDelay =
                Math.floor(Math.random() * (maxDelay - minDelay + 1)) +
                minDelay;

            setTimeout(showNextMessage, nextDelay);
        };

        const initialDelay = Math.floor(Math.random() * 2000) + 1000; // Reduced initial delay
        const timer = setTimeout(showNextMessage, initialDelay);

        return () => clearTimeout(timer);
    }, [messages, minDelay, maxDelay]);

    return visibleMessages;
};

export default function Landing({ collections }) {
    const theme = useTheme();

    // Chat messages array
    const chatMessages = [
        {
            user: 'Alice',
            message: 'Just bought my first XRP NFT!',
            avatar: '👩'
        },
        {
            user: 'Bob',
            message: "That's awesome! Which collection?",
            avatar: '👨'
        },
        {
            user: 'Charlie',
            message: "I'm loving the variety here!",
            avatar: '🧑'
        },
        { user: 'Diana', message: 'XRP NFTs are the future!', avatar: '👩‍🦰' },
        {
            user: 'Ethan',
            message: "Can't wait to start creating!",
            avatar: '👨‍🦱'
        }
    ];

    // Use the updated hook with new min and max delay values
    const visibleMessages = useRandomMessages(chatMessages, 2000, 4000);

    // Add this new state and effect for text animation
    const [animatedText, setAnimatedText] = useState('with No Barriers');
    const phrases = ['with No Barriers', 'on Layer 1', 'with No Brokers'];

    useEffect(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % phrases.length;
            setAnimatedText(phrases[currentIndex]);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ position: 'relative', minHeight: '100vh' }}>
                {/* Chat message container */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}
                >
                    {visibleMessages.map((message) => (
                        <ChatMessage
                            key={message.key}
                            elevation={1}
                            sx={{
                                top: message.position.top,
                                left: message.position.left
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 24,
                                    height: 24,
                                    mr: 1,
                                    fontSize: '0.8rem'
                                }}
                            >
                                {message.avatar}
                            </Avatar>
                            <Typography variant="body2">
                                {message.message}
                            </Typography>
                        </ChatMessage>
                    ))}
                </Box>

                <Grid
                    container
                    spacing={4}
                    sx={{
                        mt: { xs: 0, sm: 0, md: 1 }, // Top margin remains the same
                        mb: { xs: 2, md: 6 }, // Bottom margin remains the same
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Grid item xs={12} md={1} />{' '}
                    {/* Empty grid item for spacing */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            pl: { xs: 0, md: 4 }
                        }}
                    >
                        <AutoStack
                            spacing={4}
                            sx={{
                                maxWidth: { xs: '100%', md: '90%' }
                            }}
                        >
                            <GradientTypography
                                variant="h1"
                                fontWeight="bold"
                                sx={{
                                    fontSize: {
                                        xs: '2rem',
                                        sm: '2.5rem',
                                        md: '3rem',
                                        lg: '3.5rem'
                                    },
                                    textAlign: { xs: 'center', md: 'left' },
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                XRP NFT Marketplace
                            </GradientTypography>

                            <Typography
                                variant="h5"
                                color="text.secondary"
                                sx={{
                                    fontSize: {
                                        xs: '1.25rem',
                                        sm: '1.5rem',
                                        md: '1.75rem'
                                    },
                                    textAlign: { xs: 'center', md: 'left' }
                                }}
                            >
                                Trade XRP NFTs{' '}
                                <AnimatedText component="span">
                                    {animatedText}
                                </AnimatedText>
                            </Typography>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                sx={{ mt: 4, width: '100%' }}
                            >
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/collections`}
                                    rel="noreferrer noopener nofollow"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    <HeroButton variant="contained" fullWidth>
                                        Explore Collections
                                    </HeroButton>
                                </Link>

                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    <HeroButton variant="outlined" fullWidth>
                                        Create NFT
                                    </HeroButton>
                                </Link>
                            </Stack>

                            {/* Updated Supported Marketplaces section */}
                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: {
                                        xs: 'center',
                                        md: 'flex-start'
                                    }
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.7rem' }}
                                >
                                    Supported Marketplaces: xrp.cafe, bidds, Art
                                    Dept
                                </Typography>
                            </Box>
                        </AutoStack>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '500px',
                                aspectRatio: '1 / 1',
                                mx: 'auto' // Center the preview
                            }}
                        >
                            <CollectionPreview
                                collections={
                                    collections.length > 0
                                        ? [collections[0]]
                                        : []
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Modify this Box component */}
                <Box sx={{ mt: { xs: 8, md: 12 }, mb: { xs: 4, md: 8 } }}> {/* Increased top margin */}
                    <CollectionList collections={collections} />
                </Box>

                <Box sx={{ height: { xs: 24, md: 48 } }} /> {/* Further increased height for bottom spacing */}
            </Box>
        </Container>
    );
}
