import { useEffect } from 'react';
import { resetFlags } from 'app/slices/filterSlice';
import { useDispatch } from 'react-redux'
import { resetNFTs } from 'app/slices/nftsSlice'
import PersistentDrawerLeft from 'components/layouts/Drawer';
import { AllNFTs } from 'components/nftList/AllNFTs';


export default function LedgerNFTList() {
  const dispatch = useDispatch()

  useEffect(() => {
    // @description : reset filter, nfts redux states
    dispatch(resetFlags())
    dispatch(resetNFTs())
  }, [])

  return (
    <PersistentDrawerLeft>
      <AllNFTs />
    </PersistentDrawerLeft>
  );
}
