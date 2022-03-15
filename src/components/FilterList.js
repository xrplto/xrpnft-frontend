import * as React from 'react';
import List from '@mui/material/List';
import { useDispatch } from 'react-redux'
import { toggleBurnable, toggleOnlyXrp, toggleTrustline, toggleTransferable } from '../app/slices/filterSlice'
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
import { Grid } from '@mui/material'
import { IconBurnable } from './icons'
import { IconOnlyXRP } from './icons'
import { IconTrustline } from './icons'
import { IconTransferable } from './icons'

export default function FilterList() {
    const dispatch = useDispatch()
    const [openStatus, setOpenStatus] = React.useState(true);
    const [openPrice, setOpenPrice] = React.useState(false);
    const [openCollections, setOpenCollections] = React.useState(false);

    const [isBurnable, setBurnable] = React.useState(false)
    const [isOnlyXrp, setOnlyXrp] = React.useState(false)
    const [isTrustline, setTrustline] = React.useState(false)
    const [isTransferable, setTransferable] = React.useState(false)

    // set filters
    const handleBurnableBtnClick = () => {
        setBurnable(!isBurnable)
        dispatch(toggleBurnable())
    }
    const handleOnlyXrpBtnClick = () => {
        setOnlyXrp(!isOnlyXrp)
        dispatch(toggleOnlyXrp())
    }
    const handleTrustlineBtnClick = () => {
        setTrustline(!isTrustline)
        dispatch(toggleTrustline())
    }
    const handleTransferableBtnClick = () => {
        setTransferable(!isTransferable)
        dispatch(toggleTransferable())
    }

    // dropdown filters
    const handleStatusClick = () => {
        setOpenStatus(!openStatus);
    };
    const handlePriceClick = () => {
        setOpenPrice(!openPrice);
    };
    const handleCollectionsClick = () => {
        setOpenCollections(!openCollections);
    };

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <Divider />
            <ListItemButton onClick={handleStatusClick}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Status" />
                {openStatus ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStatus} timeout="auto" unmountOnExit>
                {/* <List component="div" disablePadding> */}
                <Grid container justifyContent='center' direction='row' spacing={1} margin={2} marginTop={1} width='auto'>
                    <Grid item md={6}>
                        <Button
                            onClick={ handleBurnableBtnClick}
                            variant={isBurnable ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<IconBurnable />}
                        >
                            Burnable
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Button
                            onClick={handleOnlyXrpBtnClick}
                            variant={isOnlyXrp ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<IconOnlyXRP />}
                        >
                            Only XRP
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Button
                            onClick={handleTrustlineBtnClick}
                            variant={isTrustline ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<IconTrustline />}
                        >
                            Trustline
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Button
                            onClick={handleTransferableBtnClick}
                            variant={isTransferable ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<IconTransferable />}
                        >
                            Transferable
                        </Button>
                    </Grid>
                </Grid>
                {/* </List> */}
            </Collapse>
            <Divider />
            <ListItemButton onClick={handlePriceClick}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Price" />
                {openPrice ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openPrice} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItemButton>
                </List>
            </Collapse>
            <Divider />
            <ListItemButton onClick={handleCollectionsClick}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Collections" />
                {openCollections ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCollections} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}
