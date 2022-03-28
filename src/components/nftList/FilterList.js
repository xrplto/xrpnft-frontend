import * as React from 'react';
import List from '@mui/material/List';
import { useDispatch, useSelector } from 'react-redux'
import { changeFilter } from 'app/slices/filterSlice'
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
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpokeIcon from '@mui/icons-material/Spoke';

export default function FilterList() {
    const dispatch = useDispatch()
    const [openStatus, setOpenStatus] = React.useState(true);
    const [openPrice, setOpenPrice] = React.useState(true);
    const [openCollections, setOpenCollections] = React.useState(true);

    const flag = useSelector(state => state.filter.flag)

    const handleFilterClick = (id) => {
        dispatch(changeFilter(id))
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
            sx={{ width: '100%', maxWidth: 360, padding: 0 }}
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
                            onClick={ () => handleFilterClick(0x0001)}
                            variant={flag & 0x0001 ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<LocalFireDepartmentIcon />}
                        >
                            Burnable
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Button
                            onClick={() => handleFilterClick(0x0002)}
                            variant={flag & 0x0002 ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<SpokeIcon />}
                        >
                            Only XRP
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Button
                            onClick={() => handleFilterClick(0x0004)}
                            variant={flag & 0x0004 ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<VerifiedUserIcon />}
                        >
                            Trustline
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Button
                            onClick={() => handleFilterClick(0x0008)}
                            variant={flag & 0x0008 ? 'contained' : 'outlined'}
                            sx={{ width: '100%' }}
                            startIcon={<TransferWithinAStationIcon />}
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
                        <ListItemText primary="Incoming contents" />
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
                        <ListItemText primary="Incoming contents" />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}
