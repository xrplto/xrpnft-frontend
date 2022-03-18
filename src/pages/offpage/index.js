import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Backdrop,
  Container,
  Grid,
  Link,
  Typography
} from "@mui/material";
import { HashLoader } from "react-spinners";
import Page from "../../components/Page";
import NFTDescription from "components/offpage/NftDescription";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const accounts = [
  {
    id: 1,
    key: "rH6jr16vArKBneg2Hzy1bgC9ewdMReYavH",
    secret: "shsUVURnRc6dC1Y2aqpkhu3dDG2eu",
  },
  {
    id: 2,
    key: "r3tuno9Nkd2zpEDBdSJMtyeQ6sZb9CXy88",
    secret: "ssWxNRgrAzECJzLpeUoL8dYvCixtn",
  },
  {
    id: 3,
    key: "rGS2zSMwHP3j6Rqm9D5r4iTwoucHwAfAM9",
    secret: "ssUPpTPeNFUUgUkHS46WY6tXgKgxK",
  },
  {
    id: 4,
    key: "r3cu51e1qWBVALPArjBmcHAwMyMrSWRREX",
    secret: "ssXfMEPz1wBvNv11CDVq6dfmXmCnP",
  },
  {
    id: 5,
    key: "rK7eKU18TgbMReccVDtkQu2kfLYmirdVS9",
    secret: "shsh6ty64sqNCu9bkCqUwqCCFbwss",
  },
];

export default function NFTInfo(props) {
  const [loading, setLoading] = useState(false);
  const token = useParams()
  return (
    <Page title="NFT Info">
      <Backdrop
        sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <HashLoader color={"#00AB55"} size={50} />
      </Backdrop>
      <Container maxWidth="lg" sx={{ marginTop: '3vh' }}>
        <Grid container spacing={1} justifyContent='center'>
          <Grid item md={5}>
            <Card sx={{ maxWidth: 440 }}>
              <CardMedia
                component="img"
                height="400"
                image="/static/cover.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000
                  species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large">Share</Button>
                <Button size="large">Learn More</Button>
              </CardActions>
            </Card>

          </Grid>
          <Grid item md={7}>
            <Typography variant="h2" gutterBottom>
              Peaceful Ape
            </Typography>
            <NFTDescription  />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
