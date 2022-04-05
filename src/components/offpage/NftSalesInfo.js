import * as React from 'react';
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider';
import { Typography, Stack } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { StyledBtn } from '../atoms/StyledComponents';
import TimePeriods from 'components/offpage/TimePeriodsDropdown';
import { parseNFT } from 'utils';
import { StyledLink } from 'components/atoms/StyledComponents'
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimelineIcon from '@mui/icons-material/Timeline';
import { CountdownTimer } from './CountDownTimer';
import {NFTokenProps} from 'types/types'
import ListIcon from '@mui/icons-material/List';


const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    borderRadius: 5,
    marginTop: theme.spacing(2),
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        //   expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


NFTDescription.propTypes = NFTokenProps

export default function NFTDescription({tokenID, URI}) {
    const nft = parseNFT(tokenID, URI);
    const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000
    const NOW_IN_MS = new Date().getTime()

    const [expanded, setExpanded] = React.useState('panel1')
    const [expandedPrice, setExpandedPrice] = React.useState(true)
    const [expandedListing, setExpandedListing] = React.useState(true)
    const [expandedOffers, setExpandedOffers] = React.useState(true)

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <div>
            <Stack spacing={2} marginTop={1}>
                <StyledLink underline='none'>
                    NFTKings
                </StyledLink>
                <Typography variant="subtitle" gutterBottom fontSize={30} overflow='hidden' fontWeight={600}>
                    Peaceful Ape
                </Typography>
                <Stack direction='row' alignItems='center' spacing={1}>
                    <Typography variant="string" >
                        <span>{'Owned'}</span>
                    </Typography>
                    <Typography variant="string" >
                        <span>{'by'}</span>
                    </Typography>
                    <StyledLink>
                        NFTKingCreator
                    </StyledLink>
                </Stack>
            </Stack>
            <Accordion expanded={true} >
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Stack spacing={2}>
                        <Typography>Sale ends {new Date(THREE_DAYS_IN_MS + NOW_IN_MS).toUTCString()}</Typography>
                        <CountdownTimer targetDate={THREE_DAYS_IN_MS + NOW_IN_MS} />
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails >
                    <Typography variant='string'>Current Price</Typography>
                    <Typography variant='h4' gutterBottom margin={2}>
                        20.5 XRP
                        <Typography variant='caption'>({20.5 * 0.7973} USD)</Typography>
                    </Typography>
                    <StyledBtn variant="contained" startIcon={<AccountBalanceWalletIcon />}>Buy Now</StyledBtn>
                    <StyledBtn variant="outlined" sx={{ marginLeft: 3 }} startIcon={<LocalOfferIcon />}>Make Offer</StyledBtn>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedPrice} onChange={() => setExpandedPrice(!expandedPrice)} >
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Stack direction='row' spacing={2}>
                        <TimelineIcon />
                        <Typography variant='string' >Price History</Typography>
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <TimePeriods />
                    {/* <img src={activity} /> */}
                    <Typography sx={{ margin: 3, textAlign: 'center' }}>
                        No item activity yet
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedListing} onChange={() => setExpandedListing(!expandedListing)}>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Stack direction='row' spacing={2}>
                        <LocalOfferIcon />
                        <Typography variant='string' >Listings</Typography>
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <Typography sx={{ margin: 3, textAlign: 'center' }}>
                        No Listing yet
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedOffers} onChange={() => setExpandedOffers(!expandedOffers)}>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Stack direction='row' spacing={2}>
                        <ListIcon />
                        <Typography variant='string' >Offers</Typography>
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <Typography sx={{ margin: 3, textAlign: 'center' }}>
                        No Offers yet
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

