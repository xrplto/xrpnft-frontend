// import { useEffect } from 'react';
// import { resetFlags } from 'app/slices/filterSlice';
// import { useDispatch } from 'react-redux'
// import { resetNFTs } from 'app/slices/nftsSlice'
// import PersistentDrawerLeft from 'components/layouts/Drawer';
// import { AllNFTs } from 'components/NFTLists/AllNFTs';
import { Navigate, useNavigate } from 'react-router-dom';
import "./styles/Hero.css";
import {
  Button,
  Toolbar,
  IconButton,
  Box,
  Link,
  Grid,
  
} from '@mui/material';
import { hotDropsData } from "./base/MockupData";
import CardList from "./CardList";
import Card from "./base/Card";

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
  const Hero = () =>{
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
      <Grid container spacing={3} sx={{p:0}}  justifyContent="center" alignItems="center">
          <Grid item xs={12} md={7} lg={7} sx={{pl:0}}>
            <div id="hero">
              {/* <img id='hero-background' src={list[0].src}/> */}

              {/* <Header /> */}

              <h1 id="text-first"> Discover, collect, and sell </h1>
              <h1 id="text-second"> extraordinary NFTs</h1>
              <h5 id="subtext">This is the world's first and largest XRPLNFT Marketplace.</h5>

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
          <Grid item xs={12} md={5} lg={5} >
          <div id='preview'>
            {/* <div style=''> */}
            <Card child={
              <img src="/static/nfts/fractals.png" height="90%"/>
            } width="510px" height="550px">
              {/* <div>
              <img alt="Featured creator" src="https://lh3.googleusercontent.com/UW-Aqhd0PhvKeTz2Lqev7a3obxAfZ6Nq3VXoim4k7_IquiaHAJaX4kk2MeBFv3Ff0ysdczjXxtY0R87VI_5brUjU69_2YMNC1_FbXw=s80" size='40'/>
              </div> */}
              <div>
                <span font-size='14px'>FRACTALS</span>
                <span font-size='14'>Fractal Collection</span>
              </div>
            </Card>
              {/* </div> */}
              {/* <footer>
                <div size="40">
                </div>
                <div>
                  <button aria-label='Get featured' type='button'>
                    <i color='gray' cusor='pointer' value='info' size='24'>info</i>
                  </button>
                </div>
              </footer> */}
              </div>

          </Grid>
      </Grid>
      {/* </div> */}

    
    <p id="card-list-header-text"> Hot Drops </p>
    <div id="list-container">
      <CardList list={hotDropsData} />
    </div>
    </div>
     
    // <div id="home">
    //   <Hero list={hotDropsData} />

    //   <p id="card-list-header-text"> Hot Drops </p>
    //   <div id="list-container">
    //     <CardList list={hotDropsData} />
    //   </div>
    // </div>
    // <PersistentDrawerLeft>
    //   <AllNFTs />
    // </PersistentDrawerLeft>

    // <Grid item xs={12} >
    //   <ButtonGroup variant="outlined">
    //       <Button aria-label="Explore"
    //           onClick={() => handleExplore()}
    //           color="success"
              
    //           sx={{ borderRadius: 10 }}
    //           startIcon={<Icon icon='akar-icons:check' />}
    //       >
    //           Explore
    //       </Button>
    //       <Button aria-label="Creat"
    //           onClick={() => handleCreate()}
    //           color="error"
              
    //           sx={{ borderRadius: 10 }}
    //           >
    //           Create
    //       </Button>
    //   </ButtonGroup>
    // </Grid>

  )
};
export default Hero;
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

