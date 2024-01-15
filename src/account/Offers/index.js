import { useState } from 'react';

// Material
import { Box, Button, Paper, Stack } from '@mui/material';

// Components
import TransferredNFTs from './TransferredNFTs';
import OffersList from './OffersList';
import StyledBadge from '../StyledBadge';

export default function Offers({ account, acceptNfts, orphanedOffers }) {
    const [openCollected, setOpenCollected] = useState(false);
    const [openSell, setOpenSell] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);
    const [openOrphaned, setOpenOrphaned] = useState(false);

    const handleClickCollected = () => {
        setOpenCollected((state) => !state);
    };

    const handleClickSell = () => {
        setOpenSell((state) => !state);
    };

    const handleClickBuy = () => {
        setOpenBuy((state) => !state);
    };

    const handleClickOrphaned = () => {
        setOpenOrphaned((state) => !state);
    };

    return (
        <Stack rowGap={2}>
            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickCollected}>
                    <StyledBadge color="primary" badgeContent={acceptNfts}>
                        Transfers
                    </StyledBadge>
                </Button>
                <Box m={2} sx={{ display: openCollected ? 'block' : 'none' }}>
                    <TransferredNFTs account={account} />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickSell}>
                    Sell Offers
                </Button>
                <Box m={2} sx={{ display: openSell ? 'block' : 'none' }}>
                    <OffersList account={account} type="sells" />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickBuy}>
                    Buy Offers
                </Button>
                <Box m={2} sx={{ display: openBuy ? 'block' : 'none' }}>
                    <OffersList account={account} type="buys" />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickOrphaned}>
                    <StyledBadge color="primary" badgeContent={orphanedOffers}>
                        Orphaned Offers
                    </StyledBadge>
                </Button>
                <Box m={2} sx={{ display: openOrphaned ? 'block' : 'none' }}>
                    <OffersList account={account} type="orphaned" />
                </Box>
            </Paper>
        </Stack>
    );
}
