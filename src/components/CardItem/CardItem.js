import { Card, CardActionArea, CardContent, CardMedia, Fade,  Typography } from '@mui/material';
import React from 'react';

const CardItem = ( props ) => {
    const { asset } = props;
    let image_url = "https://lh3.googleusercontent.com/LeBZH9d1TjRgVDSBw9V4JOt98jVEDLJ8LxG0AlaYYRB6ZZai71hERd2yQ5h713w9DSSoRJWBV9GmN1xmzXsWaaIEyV1C_oHlxRCL0GM"
    return(
        <Fade in timeout={ {enter: 1500, exit: 1000,}}>
            <Card onClick={()=>window.open(asset.permalink, "_blank")}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt={asset.name}
                        //image={asset.image_url}
                        image={image_url}
                        height="400"
                        title={asset.description}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                        {asset.name}
                        </Typography>           
                    </CardContent>
                </CardActionArea>
            </Card>
        </Fade>
    )
}

export default CardItem;