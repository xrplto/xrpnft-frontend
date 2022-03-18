import * as React from 'react';
import List from '@mui/material/List';
import { useSelector } from 'react-redux'
import { toggleBurnable, toggleOnlyXrp, toggleTrustline, toggleTransferable } from '../../app/slices/filterSlice'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { Container, Grid, Typography, Link } from '@mui/material'
import { IconBurnable } from '../icons'
import { IconOnlyXRP } from '../icons'
import { IconTrustline } from '../icons'
import { IconTransferable } from '../icons'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledBtn } from '../StyledComponents';
import TimePeriods from 'components/offpage/TimePeriodsDropdown';
import styled from "styled-components";
import { current } from '@reduxjs/toolkit';


export default function NFTDescription() {
    const currentToken = useSelector((state) => state.nfts.currenToken)
    console.log('currentToken:',currentToken)

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
                <Divider/>
                {/* // 000000000272ECED526CB9FB90275EC6196EC6C522CFFB938962EFA100000006
                // 6D796E34333433667420637573746F6D206461746120455652 */}
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
                            Account address
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
                <Divider/>
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
                <Divider/>
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
                <Divider/>
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
                <Divider/>
                <AccordionDetails>
                    <Typography sx={{ margin: 3, textAlign: 'center' }}>
                        No Offers yet
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
        // <List
        //     sx={{ width: '100%', bgcolor: 'background.paper', padding: 2 }}
        //     component="nav"
        //     aria-labelledby="nested-list-subheader"
        // >
        //     <Accordion>
        //         <AccordionSummary
        //             expandIcon={<ExpandMoreIcon />}
        //             aria-controls="panel1a-content"
        //             id="panel1a-header"
        //         >
        //             <Typography>Accordion 1</Typography>
        //         </AccordionSummary>
        //         <AccordionDetails>
        //             <Typography>
        //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        //                 malesuada lacus ex, sit amet blandit leo lobortis eget.
        //             </Typography>
        //         </AccordionDetails>
        //     </Accordion>
        //     <Divider />
        //     <ListItemButton onClick={handleStatusClick}>
        //         <ListItemIcon>
        //             <InboxIcon />
        //         </ListItemIcon>
        //         <ListItemText primary="Description" />
        //         {/* {openStatus ? <ExpandLess /> : <ExpandMore />} */}
        //     </ListItemButton>
        //     <Grid container justifyContent='center' direction='row' spacing={1} margin={2} marginTop={1} width='auto'>
        //         <Typography variant="string" gutterBottom>
        //             Until the two thousandth year, no one will even think about what is there and how it is on. Who is interested in this Mars? Only heroes. — Raise your hand and say, I swear!
        //         </Typography>
        //     </Grid>
        //     <Divider />
        //     <ListItemButton onClick={handlePriceClick}>
        //         <ListItemIcon>
        //             <InboxIcon />
        //         </ListItemIcon>
        //         <ListItemText primary="Properties" />
        //         {openPrice ? <ExpandLess /> : <ExpandMore />}
        //     </ListItemButton>
        //     <Collapse in={openPrice} timeout="auto" unmountOnExit>
        //         <List component="div" disablePadding>
        //         </List>
        //     </Collapse>
        //     <Divider />
        //     <ListItemButton onClick={handleCollectionsClick}>
        //         <ListItemIcon>
        //             <InboxIcon />
        //         </ListItemIcon>
        //         <ListItemText primary="Details" />
        //         {openCollections ? <ExpandLess /> : <ExpandMore />}
        //     </ListItemButton>
        //     <Collapse in={openCollections} timeout="auto" unmountOnExit>
        //         <List component="div" disablePadding>
        //             <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        //                 <Typography variant="string" gutterBottom>
        //                     Account Address
        //                 </Typography>
        //                 <Typography variant="string" gutterBottom>
        //                     rH6j...YavH
        //                 </Typography>
        //             </Container>
        //             <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        //                 <Typography variant="string" gutterBottom>
        //                     TokenId
        //                 </Typography>
        //                 <Typography variant="string" gutterBottom>
        //                     0...0272ECE...
        //                 </Typography>
        //             </Container>
        //             <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        //                 <Typography variant="string" gutterBottom>
        //                     Metadata
        //                 </Typography>
        //                 <Typography variant="string" gutterBottom>
        //                     <div>
        //                         <IconBurnable />
        //                         <IconOnlyXRP />
        //                         <IconTransferable />
        //                     </div>
        //                 </Typography>
        //             </Container>
        //         </List>
        //     </Collapse>
        // </List>
    );
}

const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
`