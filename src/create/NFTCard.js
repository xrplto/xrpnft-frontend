import axios from 'axios';

// Context
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { styled, Card, Stack, Typography, Button } from '@mui/material';
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
        // https://api.xrpnft.com/api/collection/query?filter=
        axios
            .get(`${BASE_URL}/collection/query?account=${account}`, {
                headers: { 'x-access-token': accountToken }
            })
            .then((res) => {
                try {
                    if (res.status === 200 && res.data) {
                        const ret = res.data;
                        if (ret.collections.length > 0)
                            setCollections(ret.collections);
                    }
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((err) => {
                console.log('err->>', err);
            })
            .then(function () {
                // Always executed
            });
    };

    useEffect(() => {
        loadCollections();
    }, [account]);

    return (
        <Card
            sx={{
                px: 4,
                width: 1,
                height: 1
            }}
            onClick={handleExpand}
        >
            <Stack
                sx={{
                    height: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    height: '200px'
                }}
            >
                <UploadIcon sx={{ fontSize: 72, mb: 1 }} />
                <Typography variant="p2">Create a single NFT</Typography>
            </Stack>
            {expanded &&
                collections.map(({ name, logoImage }, index) => (
                    <Stack
                        key={index}
                        direction="row"
                        sx={{ alignItems: 'center', mb: 2 }}
                        onClick={() => onCreate(name)}
                    >
                        <Button>
                            <IconCover>
                                <IconWrapper>
                                    <IconImage
                                        src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                    />
                                </IconWrapper>
                            </IconCover>
                            <Typography variant="h8" sx={{ ml: 2 }}>
                                {name}
                            </Typography>
                        </Button>
                    </Stack>
                ))}
        </Card>
    );
}
