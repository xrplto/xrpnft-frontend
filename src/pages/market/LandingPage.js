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
  Link
} from '@mui/material';
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
    <div id="hero">
      {/* <img id='hero-background' src={list[0].src}/> */}

      {/* <Header /> */}

      <h1 id="text-first"> XRPL </h1>
      <h1 id="text-second"> NFT Marketplace</h1>
      <h5 id="subtext">Trade NFT's in the XRPL</h5>

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

