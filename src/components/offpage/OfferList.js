import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { deepOrange } from '@mui/material/colors';


export default function OfferList({ props }) {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                props.offers ?
                    props.offers.map((offer) => (
                        <div key={offer.index}>
                            <ListItem alignItems="flex-start" >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: deepOrange[500] }}>{offer.index.slice(0,2)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{ overflowWrap: 'break-word' }}
                                    primary={'Price: ' + offer.amount / (10 ** 6) + ' XRP'}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="subtitle1"
                                                color="text.primary"
                                            >
                                                Owner:
                                            </Typography>
                                            <br />
                                            {offer.owner}
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="subtitle1"
                                                color="text.primary"
                                            >
                                                Index:
                                            </Typography>
                                            <br />
                                            {offer.index}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>
                    ))
                    :
                    <Typography>No offers yet</Typography>
            }
        </List>
    );
}
