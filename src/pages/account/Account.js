import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import axios from 'axios'
import {
  Backdrop,
  Container,
  Grid,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import NftCard from "components/nftList/NftCard";
import { BASE_URL } from "utils/constants";
import Page from "components/Page";
import AccountNfts from "components/account/AccountNfts";

const drawerWidth = 300;
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

export default function Account(props) {
  const [loading, setLoading] = useState(false);
  const token = useParams()
  const account = 'rH6jr16vArKBneg2Hzy1bgC9ewdMReYavH'
  const [userNfts, setUserNfts] = useState([])

  const fetchImages = () => {
    axios
      .get(`${BASE_URL}/account/nfts/${account}`)
      .then(res => {
        console.log(res.data)
        setUserNfts(res.data.nfts)
      });
  };

  useEffect(() => {
    fetchImages()
  }, [])
  return (
    <Page title="My NFTs">
      <Backdrop
        sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <HashLoader color={"#00AB55"} size={50} />
      </Backdrop>
      <Container maxWidth="lg" >
        {/* <Filter isMarket={false} /> */}
        <Main open={true}>
          <AccountNfts />
        </Main>
      </Container>
    </Page>
  );
}
