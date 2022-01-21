import * as React from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  } from '@mui/material';
//import IconButton from '@mui/material/IconButton';
//import Input from '@mui/material/Input';
//import FilledInput from '@mui/material/FilledInput';
//import OutlinedInput from '@mui/material/OutlinedInput';
//import InputLabel from '@mui/material/InputLabel';
//import InputAdornment from '@mui/material/InputAdornment';
//import FormHelperText from '@mui/material/FormHelperText';
//import FormControl from '@mui/material/FormControl';
//import TextField from '@mui/material/TextField';
//import Visibility from '@mui/icons-material/Visibility';
//import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom';

export default function TesterControls() {
  const [values, setValues] = React.useState({
    tokenUrl: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
    flags: '1',
    amount: '1000000'
  });

  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  // const handleClickShowPassword = () => {
  //   setValues({
  //     ...values,
  //     showPassword: !values.showPassword,
  //   });
  // };

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };

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
            sx={{ m: 1, width: '40ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Secret"
            id="standard-start-adornment"
            sx={{ m: 1, width: '40ch' }}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="Token URL"
            id="standard-start-adornment"
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