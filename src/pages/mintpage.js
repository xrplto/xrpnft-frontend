import { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client'
import React from 'react';
import { resetIpfsState } from 'app/slices/ipfSlice'
import { Dialog, Alert, AlertTitle } from '@mui/material';
import {
  Backdrop,
  Container,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import { HashLoader } from 'react-spinners';
import Page from 'components/Page';
import { Heading } from 'components/atoms/Heading';
import { NFTUploader } from 'components/miniting/NFTUploader';
import { Caption } from 'components/atoms/Caption';
import { TypoDescription } from 'components/atoms/Description';
import { SUPPORTED_FILE_TYPES } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { mintToken } from 'utils/tokenActions'
import { testPinata } from 'utils/pinata'

const client = create('https://ipfs.infura.io:5001/api/v0')

export default function Minting(props) {
  const dispatch = useDispatch()

  const [result, setResult] = useState(null)
  // const [pinataActive, setPinataActive] = useState(false)

  const [account, setAccount] = useState({
    key: "rGS2zSMwHP3j6Rqm9D5r4iTwoucHwAfAM9",
    secret: "ssUPpTPeNFUUgUkHS46WY6tXgKgxK",
  })
  const [flags, setFlags] = useState(12)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [nftName, setNftName] = useState('')
  const [extLink, setExtLink] = useState('')
  const [description, setDescription] = useState('')
  const [tokenUrl, seTokenUrl] = useState('')
  const ipfs = useSelector(state => state.ipfs)

  const handleNameFieldChange = (e) => {
    setNftName(e.target.value)
  }

  const handleExtLinkFieldChange = (e) => {
    setExtLink(e.target.value)
  }

  const handleDescriptionFieldChange = (e) => {
    setDescription(e.target.value)
  }

  const getMetadata = () => {
    return {
      imageUrl: ipfs.metadata.imageUrl,
      name: nftName,
      description: description,
      externalLink: extLink
    }
  }

  const sendNftMetadata = async () => {
    setLoading(true)

    const metadata = getMetadata()
    try {
      const added = await client.add(JSON.stringify(metadata))
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log('url:', url)
      // seTokenUrl(url)
      const nfts = await mintToken(account.secret, url, 12)
      setResult(nfts)
      setOpen(true)
    } catch (e) {
      console.log('error while uploading file to ipfs:', e)
    }
    setLoading(false)

  }


  const mintNft = async (secret, tokenUrl) => {
    try {
      await sendNftMetadata()
      const nfts = await mintToken(account.secret, tokenUrl, flags)
      console.log(nfts)
      setResult(nfts)
      setOpen(true)
    } catch (e) {
      console.log('error on minting:', e)
    }
  }


  useEffect(() => {

    testPinata()
    // setPinataActive(testPinata().authenticated)
    dispatch(resetIpfsState())
  }, [])
  return (
    <Page title='Create - XRPL NFT'>
      <Backdrop
        sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <HashLoader color={'#00AB55'} size={50} />
      </Backdrop>
      <Container maxWidth='md' sx={{ marginTop: '3vh' }}>
        <Stack spacing={2} marginBottom={3}>
          <Heading title={'Create New Item'} />
          <Caption caption={'Image, Video, Audio, or 3D Model'} />
          <TypoDescription description={'File types supported: ' + SUPPORTED_FILE_TYPES.join(', ') + '. Max size: 100MB'} />
          <NFTUploader />
          <TypoDescription description={'Image on IPFS: ' + ipfs.metadata.imageUrl} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Caption caption={'Name'} />
          <TextField required placeholder='Item name' margin='dense'
            onChange={handleNameFieldChange}
            value={nftName}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Caption caption={'External link'} />
          <TypoDescription description={'This site will include a link to this URL on this item\'s detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.'} />
          <TextField placeholder='https://yoursite.com/item/123' margin='dense'
            onChange={handleExtLinkFieldChange}
            value={extLink}
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
            placeholder='provide a detailed description of your item'
            margin='dense'
            multiline
            maxRows={4}
            value={description}
            onChange={handleDescriptionFieldChange}
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
        <Stack>
          <TypoDescription description={'Metadata on IPFS: ' + tokenUrl} />
          <LoadingButton
            loading={loading}
            loadingPosition='start'
            startIcon={<SendIcon />}
            onClick={sendNftMetadata}
            variant='contained'
          >
            Create
          </LoadingButton>
          <Divider />
          {/* <LoadingButton
            sx={{ marginTop: 1 }}
            loading={loading}
            loadingPosition='start'
            startIcon={<SendIcon />}
            onClick={mintNft}
            variant='contained'
          >
            Mint
          </LoadingButton> */}
          <Dialog onClose={handleClose} open={open}>
            {result === null
              ? <Alert severity="error" variant="outlined">
                <AlertTitle>Error</AlertTitle>
                Please check your address
              </Alert>
              : <Alert
                variant="outlined"
                severity="success">
                <AlertTitle>{result.result.account}</AlertTitle>
                <AlertTitle>Your nfts are:</AlertTitle>
                {
                  result.result.account_nfts ?
                    result.result.account_nfts.map((nft) => (
                      <>
                        <p>Issure:</p>
                        <p>{nft.Issuer}</p>
                        <p>TokenId</p>
                        <p>{nft.TokenID}</p>
                        <p>TokenUri</p>
                        <p>{nft.URI}</p>
                      </>
                    )) : <p>No data</p>
                }
                <br />
                Minting successful!
                <br />
              </Alert>
            }
          </Dialog>
        </Stack>
      </Container>
    </Page>
  );
}
