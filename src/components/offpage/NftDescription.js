import * as React from 'react';
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider';
import { Typography, Link } from '@mui/material'
import { IconBurnable } from '../icons'
import { IconOnlyXRP } from '../icons'
import { IconTrustline } from '../icons'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledBtn } from '../StyledComponents';
import TimePeriods from 'components/offpage/TimePeriodsDropdown';
import styled from "styled-components";
import { parseNFT } from 'utils';


export default function NFTDescription() {
    // const currentToken = useSelector((state) => state.nfts.currenToken)
    const currentToken = {
        tokenID: 'abd',
        URI:'abc'
    }
    const nft = parseNFT(currentToken.tokenID, currentToken.URI);


    const [openStatus, setOpenStatus] = React.useState(true);
    const [openPrice, setOpenPrice] = React.useState(false);
    const [openCollections, setOpenCollections] = React.useState(true);

    return (
        <div>
            <Accordion expanded={true}>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant='h6'>Details</Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <DetailRow>
                        <Typography variant="subtitle" gutterBottom>
                            Owned by
                        </Typography>
                        <Link>
                            NFTKingCreator
                        </Link>
                    </DetailRow>
                    <DetailRow>
                        <Typography variant='subtitle' gutterBottom>
                            Account
                        </Typography>
                        <Link >6D796E34333433667420637573746F6D206461746120455652</Link>
                    </DetailRow>
                    <DetailRow>
                        <Typography variant='subtitle' gutterBottom>
                            Token ID
                        </Typography>
                        <Link >{currentToken.tokenID.slice(0, 30)}...</Link>
                    </DetailRow>
                    <DetailRow>
                        <Typography variant='subtitle'>
                            Status
                        </Typography>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                            <IconBurnable />
                            <IconOnlyXRP />
                            <IconTrustline />
                        </div>
                    </DetailRow>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant='h6' >Current Price</Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <Typography variant='h4' gutterBottom>
                        20.5 XRP
                        <Typography variant='caption'>({20.5 * 0.7973} USD)</Typography>
                    </Typography>
                    <StyledBtn variant="contained">Buy Now</StyledBtn>
                    <StyledBtn variant="outlined" sx={{ marginLeft: 3 }}>Make Offer</StyledBtn>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography variant='h6'>Price History</Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <TimePeriods />
                    <Typography sx={{ margin: 3, textAlign: 'center' }}>
                        No item activity yet
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography variant='h6'>Listings</Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <Typography sx={{ margin: 3, textAlign: 'center' }}>
                        No Listing yet
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography variant='h6'>Offers</Typography>
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

const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
`