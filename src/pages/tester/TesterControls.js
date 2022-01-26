//import {useState, useEffect} from 'react';
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

export default function TesterControls({values, setValues}) {
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
                id="id_tester_account"
                value={values.account}
                onChange={handleChange('account')}
                sx={{ m: 1, width: '40ch' }}
                variant="standard"
                InputProps={{endAdornment:<IconButton onClick={handleClickShowAccountInfo}><AccountBalanceWalletOutlinedIcon/></IconButton>}}
            />
        </div>
        <div>
          <TextField
            label="Secret"
            id="id_tester_secret"
            type={values.showSecret ? 'text' : 'password'}
            value={values.secret}
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
            id="id_tester_token_url"
            value={values.tokenUrl}
            onChange={handleChange('tokenUrl')}
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Flags"
            id="id_tester_flags"
            value={values.flags}
            onChange={handleChange('flags')}
            sx={{ m: 1, width: '10ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Token ID"
            id="id_tester_token_id"
            value={values.tokenId}
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Amount"
            id="id_tester_amount"
            value={'account.key'}
            onChange={handleChange('amount')}
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Token Offer Index"
            id="id_tester_token_offer_index"
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Owner"
            id="id_tester_owner"
            sx={{ m: 1, width: '80ch' }}
            variant="standard"
          />
        </div>
      </Box>
    </Container>
  );
}