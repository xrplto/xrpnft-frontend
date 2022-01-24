import * as React from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Container
  } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function TesterControls() {
  const [values, setValues] = React.useState({
    account: 'rht9PFsHK2rds9dp5Nt9op4VWAceR63vWH',
    secret: 'snkPFbLVfK123mxH3SLGchmAAzd37',
    showSecret: false,
    tokenUrl: 'ipfs://QmXSSpHaG9DH5U7zQNkL4BZrBZioGG3xmG54mqPqTCpddQ',
    flags: '1',
    amount: '1000000'
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickshowSecret = () => {
    setValues({
      ...values,
      showSecret: !values.showSecret,
    });
  };

  const handleMouseDownSecret = (event) => {
    event.preventDefault();
  };

  const handleClickShowAccountInfo = () => {
    // setValues({
    //   ...values,
    //   showPassword: !values.showPassword,
    // });
  };

  // <Button
  //   variant="contained"
  //   component={RouterLink}
  //   to="#"
  //   startIcon={<Icon icon={plusFill} />}
  // >
  //   New
  // </Button>

  return (
    <Container>
      <Box>
        <div>
          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Mint Token
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Get Tokens
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Burn Token
          </Button>
        </div>

        <div>
          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Create Sell Offer
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Create Buy Offer
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Get Offers
          </Button>
        </div>

        <div>
          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Accept Sell Offer
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Accept Buy Offer
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            sx={{ m: 1 }}
            to="#" >
            Cancel Offer
          </Button>
        </div>
      </Box>
      <Box component="form"
      sx={{ flexWrap: 'wrap' }}
      noValidate
      autoComplete="off">
        <div>
            <TextField
                label="Account"
                id="standard-start-adornment"
                value={values.account}
                sx={{ m: 1, width: '40ch' }}
                variant="standard"
                InputProps={{endAdornment:<IconButton onClick={handleClickShowAccountInfo}><AccountBalanceWalletOutlinedIcon/></IconButton>}}
            />
        </div>
        <div>
          <TextField
            label="Secret"
            id="standard-start-adornment"
            type={values.showSecret ? 'text' : 'password'}
            value={values.secret}
            onChange={handleChange('secret')}
            sx={{ m: 1, width: '40ch' }}
            variant="standard"
            InputProps={{
                endAdornment:<IconButton
                    onClick={handleClickshowSecret}
                    onMouseDown={handleMouseDownSecret}>
                    {values.showSecret ? <VisibilityOff /> : <Visibility />}
                </IconButton>}}
          />
        </div>
        <div>
          <TextField
            label="Token URL"
            id="standard-end-adornment"
            value={values.tokenUrl}
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Flags"
            id="standard-start-adornment"
            value={values.flags}
            sx={{ m: 1, width: '10ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Token ID"
            id="standard-start-adornment"
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Amount"
            id="standard-start-adornment"
            value={values.amount}
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Token Offer Index"
            id="standard-start-adornment"
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Owner"
            id="standard-start-adornment"
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
      </Box>
    </Container>
  );
}