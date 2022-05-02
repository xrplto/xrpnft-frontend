import { useEffect } from "react";
import { useSelector } from 'react-redux'
import Page from "components/Page";
import AccountNfts from "components/nftList/AccountNfts";
import { useNavigate } from 'react-router-dom'

export default function Account(props) {
  const login = useSelector(state => state.account.login)
  const navigate = useNavigate()

  useEffect(() => {
    if (!login)
      navigate('/');
  })
  return (
    <Page title="My NFTs">
      <AccountNfts />
    </Page>
  );
}
