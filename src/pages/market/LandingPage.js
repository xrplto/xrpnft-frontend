import { useEffect } from 'react';
import { resetFlags } from 'app/slices/filterSlice';
import { useDispatch } from 'react-redux'
import { resetNFTs } from 'app/slices/nftsSlice'
import PersistentDrawerLeft from 'components/layouts/Drawer';
import { AllNFTs } from 'components/NFTLists/AllNFTs';
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

export default function LedgerNFTList() {
  const dispatch = useDispatch()

  useEffect(() => {
    // reset filter, nfts redux states
    dispatch(resetFlags())
    dispatch(resetNFTs())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleExplorer = async() => {
    return(
      <AllNFTs />
    )
  }
  const handleCreate = async()=>{
    return(null)
  }
  
  return (
    // <div id="home">
    //   <Hero list={hotDropsData} />

    //   <p id="card-list-header-text"> Hot Drops </p>
    //   <div id="list-container">
    //     <CardList list={hotDropsData} />
    //   </div>
    // </div>

    <Grid item xs={12} >
      <ButtonGroup variant="outlined">
          <Button aria-label="Explore"
              onClick={() => handleExplorer()}
              color="success"
              
              sx={{ borderRadius: 10 }}
              startIcon={<Icon icon='akar-icons:check' />}
          >
              Explorer
          </Button>
          <Button aria-label="Creat"
              onClick={() => handleCreate()}
              color="error"
              
              sx={{ borderRadius: 10 }}
              >
              Create
          </Button>
      </ButtonGroup>
    </Grid>

  );
}
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
