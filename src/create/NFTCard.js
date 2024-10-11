import axios from 'axios';

// Context
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { styled, Card, Stack, Typography, Button, Box } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 72px;
        height: 52px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
        overflow: hidden;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 70px;
        height: 50px;
        &:hover, &.Mui-focusVisible {
            z-index: 1;
            & .MuiImageBackdrop-root {
                opacity: 0.1;
            }
            & .MuiIconEditButton-root {
                opacity: 1;
            }
        }
  `
);

const IconImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
  `
);

export default function NFTCard({ onCreate }) {
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [collections, setCollections] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const handleExpand = async () => {
        if (expanded === false && collections.length === 0) {
            openSnackbar(
                'You must first create a collection for NFTs.',
                'error'
            );
            return;
        }
        setExpanded(!expanded);
    };

    const loadCollections = () => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        const BASE_URL = 'https://api.xrpnft.com/api';
        axios
            .get(`${BASE_URL}/collection/query?account=${account}`, {
                headers: { 'x-access-token': accountToken }
            })
            .then((res) => {
                try {
                    if (res.status === 200 && res.data) {
                        const ret = res.data;
                        console.log('Collections returned by XRPNFT API:', ret.collections);
                        if (ret.collections.length > 0) {
                            // Filter out collections with type: "bulk", "random", or "sequence"
                            const filteredCollections = ret.collections.filter(collection => 
                                !["bulk", "random", "sequence"].includes(collection.type)
                            );
                            setCollections(filteredCollections);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((err) => {
                console.log('err->>', err);
            });
    };

    useEffect(() => {
        loadCollections();
    }, [account]);

    return (
        <Card
            sx={{
                p: 4,
                width: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: (theme) => `0 8px 30px ${theme.palette.secondary.main}33`,
                },
            }}
            onClick={handleExpand}
        >
            <Stack
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme) => theme.palette.secondary.main,
                        borderRadius: '50%',
                        p: 3,
                        mb: 3,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'rotate(15deg)',
                        },
                    }}
                >
                    <UploadIcon
                        sx={{
                            fontSize: 48,
                            color: (theme) => theme.palette.secondary.contrastText,
                        }}
                    />
                </Box>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Create a single NFT
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                    Mint a unique NFT in your collection
                </Typography>
            </Stack>
            {expanded && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Select a collection:
                    </Typography>
                    {collections.map(({ name, logoImage }, index) => (
                        <Stack
                            key={index}
                            direction="row"
                            sx={{
                                alignItems: 'center',
                                mb: 2,
                                p: 2,
                                borderRadius: 1,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: (theme) => theme.palette.action.hover,
                                    transform: 'translateX(5px)',
                                },
                            }}
                            onClick={() => onCreate(name)}
                        >
                            <IconCover>
                                <IconWrapper>
                                    <IconImage
                                        src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                    />
                                </IconWrapper>
                            </IconCover>
                            <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 'medium' }}>
                                {name}
                            </Typography>
                        </Stack>
                    ))}
                </Box>
            )}
        </Card>
    );
}