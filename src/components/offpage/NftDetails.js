import * as React from 'react';
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider';
import { Typography, Link, Stack } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import TimePeriods from 'components/offpage/TimePeriodsDropdown';
// import styled from "styled-components";
import { parseNFT } from 'utils';
import { StyledLink, DetailRow } from 'components/atoms/StyledComponents'
import { styled } from '@mui/material/styles';
import NFTImgCard from './NFTImgCard';
import InfoIcon from '@mui/icons-material/Info';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpokeIcon from '@mui/icons-material/Spoke';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
        borderRadius: 0,
    },
    borderRadius: '0 0 5px 5px',
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
    height: '1vh',
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
    maxHeight: 200,
    // overflowY: 'scroll',
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function NFTDetails() {
    const currentToken = useSelector((state) => state.nfts.currenToken)
    const nft = parseNFT(currentToken.tokenID, currentToken.URI);

    const [expanded, setExpanded] = React.useState('panel1')

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <div>
            <NFTImgCard />
            <Accordion expanded={true}>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Stack spacing={2} direction='row'>
                        <DescriptionIcon />
                        <Typography variant='string' >Description</Typography>
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{overflowY: 'scroll'}}>
                    <Typography variant='string' gutterBottom>
                        Elite residential complex in Batumi (Georgia) at the excavation stage. Housing delivery is scheduled for January 3, 2024. Now you have the option of buying with cryptocurrency in the form of NFT
                        Our NFTs are tied to a real object. You get the title to the property (apartment, office, parking space). Each apartment is divided into NFTs = 1 nft = 1 sq.m. Let's say an apartment of 140 sq.m. consists of 140 NFTs. You can also buy the whole apartment, but unfortunately it will take time for us to prepare the documentation. The house is real, now at the stage of excavation in Georgia. The price of an apartment in Opensea is equal to 2/3 of the price of an apartment in Georgia. This is done so that we are counting on the % of repeat sales to cover the costs. If you are a citizen of Georgia, you can buy an apartment for Lari (GEL). There will be NFT staking, marketplace, and a lot of interesting things coming soon. - You will all be owners of this apartment. This NFT can then be put into a staking and receive rewards. It will also give airdrops and grow in value in the future. You can also fully buy the entire apartment - and you will own it. A completely real apartment.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Stack spacing={2} direction='row'>
                        <InfoIcon />
                        <Typography variant='string' >Properties</Typography>
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Stack spacing={2} direction='row'>
                        <DescriptionIcon />
                        <Typography variant='string' >Details</Typography>
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <DetailRow>
                        <Typography variant='subtitle' gutterBottom marginBottom={1}>
                            Issuer
                        </Typography>
                        <StyledLink >{nft.issuer}</StyledLink>
                    </DetailRow>
                    <DetailRow>
                        <Typography variant='subtitle' gutterBottom marginBottom={1}>
                            Token ID
                        </Typography>
                        <StyledLink >{currentToken.tokenID.slice(0, 30)}...</StyledLink>
                    </DetailRow>
                    <DetailRow>
                        <Typography variant='subtitle' marginBottom={1}>
                            Flags
                        </Typography>
                        <Stack direction='row' spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                            {nft.flags.tfBurnable && (<LocalFireDepartmentIcon />)}
                            {nft.flags.tfOnlyXRP && (<SpokeIcon />)}
                            {nft.flags.tfTrustLine && (<VerifiedUserIcon />)}
                            {nft.flags.tfTransferable && (<TransferWithinAStationIcon />)}
                            {nft.flags.tfNoFlag && <p>No flag</p>}
                        </Stack>
                    </DetailRow>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
