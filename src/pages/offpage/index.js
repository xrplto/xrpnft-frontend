import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Backdrop,
  Container,
  Grid,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import Page from "../../components/Page";
import NFTDescription from "components/offpage/NftSalesInfo";
import NFTDetails from "components/offpage/NftDetails";

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
      <Container maxWidth="lg" sx={{ marginTop: '1vh' }}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item md={5}>
            <NFTDetails />
          </Grid>
          <Grid item md={7}>
            <NFTDescription />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
