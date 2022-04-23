import { useEffect } from 'react';
import { resetFlags } from 'app/slices/filterSlice';
import { useDispatch } from 'react-redux'
import { resetNFTs } from 'app/slices/nftsSlice'
import PersistentDrawerLeft from 'components/common/Drawer';
import { NFTList } from 'components/nftList/NFTList';


export default function XrplNFTList() {
  const dispatch = useDispatch()

  useEffect(() => {
    // @description : reset filter, nfts redux states
    dispatch(resetFlags())
    dispatch(resetNFTs())
  }, [])

  return (
    <PersistentDrawerLeft>
      <NFTList />
    </PersistentDrawerLeft>
  );
}
