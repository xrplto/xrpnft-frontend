import { useState, useEffect } from 'react';
import axios from 'axios';
import { styled, alpha } from '@mui/material/styles';

// Material
import { Box, Button, Paper, Stack, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Components
import TransferredNFTs from './TransferredNFTs';
import OffersList from './OffersList';
import StyledBadge from '../StyledBadge';

const BASE_URL = 'https://api.xrpnft.com/api';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.15),
    backdropFilter: 'blur(20px)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: 'none',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 }
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    minHeight: 48,
    '&.Mui-expanded': { minHeight: 48 },
    '& .MuiAccordionSummary-content': {
        margin: 0,
        '&.Mui-expanded': { margin: 0 }
    }
}));

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
        <Stack spacing={2}>
            {[
                { key: 'transfers', label: 'Transfers', count: acceptNfts, isOpen: openCollected, toggle: handleClickCollected, component: <TransferredNFTs account={account} setTotalOffers={setAcceptNfts} /> },
                { key: 'sell', label: 'Sell Offers', count: sellOffers, isOpen: openSell, toggle: handleClickSell, component: <OffersList account={account} type="sells" setTotalOffers={setSellOffers} /> },
                { key: 'buy', label: 'Buy Offers', count: buyOffers, isOpen: openBuy, toggle: handleClickBuy, component: <OffersList account={account} type="buys" setTotalOffers={setBuyOffers} /> },
                { key: 'orphaned', label: 'Orphaned Offers', count: orphanedOffers, isOpen: openOrphaned, toggle: handleClickOrphaned, component: <OffersList account={account} type="orphaned" setTotalOffers={setOrphanedOffers} /> },
                { key: 'received', label: 'Offers Received', count: receivedOffers, isOpen: openReceived, toggle: handleClickReceived, component: <OffersList account={account} type="received" setTotalOffers={setReceivedOffers} /> }
            ].map(({ key, label, count, isOpen, toggle, component }) => (
                <StyledAccordion key={key} expanded={isOpen} onChange={toggle}>
                    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" sx={{ pr: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                                {label}
                            </Typography>
                            {count > 0 && (
                                <StyledBadge color="primary" badgeContent={count} />
                            )}
                        </Stack>
                    </StyledAccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <Box sx={{ p: 2 }}>
                            {component}
                        </Box>
                    </AccordionDetails>
                </StyledAccordion>
            ))}
        </Stack>
    );
}
