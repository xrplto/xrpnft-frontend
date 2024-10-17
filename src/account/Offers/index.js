import { useState, useEffect } from 'react';
import axios from 'axios';

// Material
import { Box, Button, Paper, Stack } from '@mui/material';

// Components
import TransferredNFTs from './TransferredNFTs';
import OffersList from './OffersList';
import StyledBadge from '../StyledBadge';

export default function Offers({ account, acceptNfts, setAcceptNfts, orphanedOffers, setOrphanedOffers, buyOffers, setBuyOffers, sellOffers, setSellOffers, receivedOffers, setReceivedOffers, updateNotificationCount }) {
    const [openCollected, setOpenCollected] = useState(false);
    const [openSell, setOpenSell] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);
    const [openOrphaned, setOpenOrphaned] = useState(false);
    const [openReceived, setOpenReceived] = useState(false);

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

    const handleClickReceived = () => {
        setOpenReceived((state) => !state);
    };

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.post(`${BASE_URL}/account/offers`, { account });
                if (response.status === 200) {
                    const data = response.data;
                    setAcceptNfts(data.acceptNfts?.length || 0);
                    setOrphanedOffers(data.orphanedOffers?.length || 0);
                    setBuyOffers(data.buyOffers?.length || 0);
                    setSellOffers(data.sellOffers?.length || 0);
                    setReceivedOffers(data.receivedOffers?.length || 0);
                }
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, [account, updateNotificationCount]);

    return (
        <Stack rowGap={2}>
            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickCollected}>
                    <StyledBadge color="primary" badgeContent={acceptNfts}>
                        Transfers
                    </StyledBadge>
                </Button>
                <Box m={2} sx={{ display: openCollected ? 'block' : 'none' }}>
                    <TransferredNFTs account={account} setTotalOffers={setAcceptNfts} />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickSell}>
                    <StyledBadge color="primary" badgeContent={sellOffers}>
                        Sell Offers
                    </StyledBadge>
                </Button>
                <Box m={2} sx={{ display: openSell ? 'block' : 'none' }}>
                    <OffersList account={account} type="sells" setTotalOffers={setSellOffers} />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickBuy}>
                    <StyledBadge color="primary" badgeContent={buyOffers}>
                        Buy Offers
                    </StyledBadge>
                </Button>
                <Box m={2} sx={{ display: openBuy ? 'block' : 'none' }}>
                    <OffersList account={account} type="buys" setTotalOffers={setBuyOffers} />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickOrphaned}>
                    <StyledBadge color="primary" badgeContent={orphanedOffers}>
                        Orphaned Offers
                    </StyledBadge>
                </Button>
                <Box m={2} sx={{ display: openOrphaned ? 'block' : 'none' }}>
                    <OffersList account={account} type="orphaned" setTotalOffers={setOrphanedOffers} />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickReceived}>
                    <StyledBadge color="primary" badgeContent={receivedOffers}>
                        Offers Received
                    </StyledBadge>
                </Button>
                <Box m={2} sx={{ display: openReceived ? 'block' : 'none' }}>
                    <OffersList account={account} type="received" setTotalOffers={setReceivedOffers} />
                </Box>
            </Paper>
        </Stack>
    );
}
