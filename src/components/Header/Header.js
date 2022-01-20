import React, { useEffect, useState } from 'react';
import {AppBar, Toolbar, IconButton, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { withStyles } from '@mui/styles';
import Web3 from 'web3';

const styles = theme => ({
  toolbarRoot: {
    paddingRight: 24
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  title: {
    flexGrow: 1
  }
});

const Header = props => {
  const { classes, handleToggleDrawer } = props;
  const [ account, setAccount ] = useState("");

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setAccount(accounts[0]);
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  useEffect(() => {
    loadWeb3();
  }, [])
  return (
    <AppBar position="fixed">
      <Toolbar disableGutters={true} classes={{ root: classes.toolbarRoot }}>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Dashboard
        </Typography>
        {account === "" ? 
          <IconButton onClick={loadWeb3} color="inherit">
            <PersonIcon />
          </IconButton> : 
          account
        }
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
