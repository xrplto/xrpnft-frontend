// import { useEffect } from 'react';
// import { resetFlags } from 'app/slices/filterSlice';
// import { useDispatch } from 'react-redux'
// import { resetNFTs } from 'app/slices/nftsSlice'
// import PersistentDrawerLeft from 'components/layouts/Drawer';
// import { AllNFTs } from 'components/NFTLists/AllNFTs';
import { Navigate, useNavigate } from 'react-router-dom';
import "./landing/styles/Hero.css";
import {
  Button,
  Toolbar,
  IconButton,
  Box,
  Link,
  Grid,
  
} from '@mui/material';
import { hotDropsData } from "./landing/base/MockupData";
import CardList from "./landing/CardList";
import Card from "./landing/base/Card";
import CollectionPreview from './CollectionPreview';

// import { create } from 'lodash';
// import create from 'create'

// ReactDOM.render(
//   <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<DAppProvider config={{}}><Home /></DAppProvider>} />
//         <Route path="/create" element={<DAppProvider><Create /></DAppProvider>} />
//         <Route path="/explore" element={<DAppProvider config={{}}><Explore /></DAppProvider>} />
//         <Route path="/detail" element={<DAppProvider config={{}}><NFTDetail /></DAppProvider>} />

//       </Routes>
//     </BrowserRouter>,
//   document.getElementById("root")
// );


// reportWebVitals();

// export default function LedgerNFTList() {
//   const dispatch = useDispatch()

//   useEffect(() => {
//     // reset filter, nfts redux states
//     dispatch(resetFlags())
//     dispatch(resetNFTs())

//     // eslint-disable-next-line react-hooks/exhaustive-deps

//   }, [])
  const LandingPage = () =>{
  //   let navigate = useNavigate();
  // const goExplore = () => {
  //   
  // }
  // const goCreate = async()=>{
  //   navigate('/mintpage')
  // }
  
  return (
    <div id="home">
        {/* <div style="background-image:src(/static/nfts/fractals.png)"> */}
      {/* <div display="flex">
        <div position="absolute" overflow="hidden" display="block">
          <div id="background"></div>
        </div> */}
      <Grid container spacing={3} sx={{p:0}}  justifyContent="center" alignItems="center" display="flex">
          <Grid item xs={12} md={7} lg={7} sx={{pl:0}}>
            <div id="hero">
              <h1 id="text-first"> Discover, collect, and sell </h1>
              <h1 id="text-second"> extraordinary NFTs</h1>
              <h5 id="subtext">XRPNFT.COM is the world's first and largest XRPL NFT Marketplace.</h5>

              <div id="hero-buttons">
              <Link href='/explore' underline='none'>
              <button id="explore">
                  Explore
                </button>
              </Link>
              <Link href='/create' underline='none'>
                <button id="create">Create</button>
              </Link>                 
            </div>
            </div>
          </Grid>
          <Grid item xs={12} md={5} lg={5} sx={{pl:0}} alignItems="center">
            <div id="preview">
            <Card child={
              <CollectionPreview />
            } width="500px" height="500px">
            <CollectionPreview />
            </Card>
            </div>
          </Grid>
      </Grid>
    <div>
    <p id="card-list-header-text"> Hot Drops </p>
    <div id="list-container">
      <CardList list={hotDropsData} />
    </div>
    </div>
    </div>
     
    
  )
};
export default LandingPage;
// const Home = () => {


//   return (
//     <div id="home">
//       <Hero list={hotDropsData} />

//       <p id="card-list-header-text"> Hot Drops </p>
//       <div id="list-container">
//         <CardList list={hotDropsData} />
//       </div>
//     </div>
//   );
// };

// export default Home;
// }

