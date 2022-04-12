import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux'
import {
  Backdrop,
  Container,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import Page from "components/Page";
import AccountNfts from "components/account/AccountNfts";
import { useNavigate } from 'react-router-dom'

const drawerWidth = 300;
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: `-${drawerWidth}px`,
//     ...(open && {
//       transition: theme.transitions.create('margin', {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       marginLeft: 0,
//     }),
//   }),
// );

export default function Account(props) {
  const login = useSelector(state => state.account.login)
  const navigate = useNavigate()

  useEffect(() => {
    if (!login)
      navigate('/');
  })
  return (
    <Page title="My NFTs">
      {/* <Main open={true}> */}
      <AccountNfts />
      {/* </Main> */}
    </Page>
  );
}
