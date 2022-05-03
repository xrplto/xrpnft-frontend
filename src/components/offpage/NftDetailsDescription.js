import {
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Typography,
} from '@mui/material'

export default function NFTDetailsDescription({
    description,
}) {

    return (
        description ?
            <List>
                {
                    Object.keys(description).map((item, index) => (
                        <ListItem disablePadding key={item + '-' + index}>
                            <ListSubheader>
                                {item}
                            </ListSubheader>
                            <ListItemText
                                primary={
                                    JSON.stringify(description[item])
                                    // .replace('"', '')
                                } />
                        </ListItem>
                    ))
                }
            </List>
            :
            <Typography sx={{textAlign: 'center'}}>No description for this item</Typography>
    );
}
