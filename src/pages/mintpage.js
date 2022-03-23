import { useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import {
  Backdrop,
  Button,
  Container,
  CssBaseline,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import Page from "../components/Page";
import { Heading } from "components/atoms/Heading";
import { NFTUploader } from "components/miniting/NFTUploader";
import { Caption } from "components/atoms/Caption";
import { TypoDescription } from "components/atoms/Description";
import { SUPPORTED_FILE_TYPES } from "../constants";

// Input form related
import FormHelperText from '@mui/material/FormHelperText';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

function MyFormHelperText() {
  const { required } = useFormControl() || {};

  const helperText = React.useMemo(() => {
    if (required) {
      return 'This field is being focused';
    }

    return 'Helper text';
  }, [required]);

  return <FormHelperText>{helperText}</FormHelperText>;
}

export default function Minting(props) {
  const [loading, setLoading] = useState(false);
  return (
    <Page title="Create - XRPL NFT">
      <Backdrop
        sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <HashLoader color={"#00AB55"} size={50} />
      </Backdrop>
      <Container maxWidth="md" sx={{ marginTop: '3vh' }}>
        <Stack spacing={2} marginBottom={3}>
          <Heading title={'Create New Item'} />
          <Caption caption={'Image, Video, Audio, or 3D Model'} />
          <TypoDescription description={'File types supported: ' + SUPPORTED_FILE_TYPES.join(', ') + '. Max size: 100MB'} />
          <NFTUploader />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Caption caption={'Name'} />
          {/* <FormControl >
            <OutlinedInput placeholder="Please enter text" required={true} />
            <MyFormHelperText />
          </FormControl> */}
          <TextField required placeholder="Item name" margin='dense'
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Caption caption={'External link'} />
          {/* <Divider /> */}
          <TypoDescription description={'This site will include a link to this URL on this item\'s detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.'} />
          <TextField placeholder="https://yoursite.com/item/123" margin='dense'
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Caption caption={'Description'} />
          {/* <Divider /> */}
          <TypoDescription description={'The description will be included on the item\'s detail page underneath its image. Markdown syntax is supported.'} />
          <TextField
            placeholder="provide a detailed description of your item"
            margin='dense'
            multiline
            maxRows={4}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1,
                minHeight: 10
              },
              '& .MuiOutlinedInput-root': {
                height: 100,
                alignItems: 'start'
              }
            }} />
        </Stack>
        <Button variant="contained">Create</Button>
      </Container>
    </Page>
  );
}
