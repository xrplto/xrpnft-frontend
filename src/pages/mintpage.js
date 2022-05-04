import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import React from 'react';
import { Icon } from '@iconify/react';
import {
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Page from 'components/Page';
import { NFTUploader } from 'components/miniting/NFTUploader';
import { SUPPORTED_FILE_TYPES, XRPNFT_DOMAIN } from 'utils/constants';
import { LoadingButton } from '@mui/lab';
import { mintToken } from 'utils/tokenActions'
import { testPinata, pinJsonToIPFS } from 'utils/pinata'
import { useNavigate } from 'react-router-dom'
import TokenFlagsForm from 'components/miniting/TokenFlagsForm';
import XSnackbar from 'components/common/Snackbar';
import { useSnackbar } from 'hooks/useSnackbar';
import CollectionAndProperties from 'components/miniting/CollectionAndProperties';

export default function Minting() {

  const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
  const account = useSelector(state => state.account.account)
  const pinnedFileHash = useSelector(state => state.ipfs.pinnedFileHash)
  const login = useSelector(state => state.account.login)
  const flags = useSelector(state => state.ipfs.flags)
  const [loading, setLoading] = useState(false);
  const [nftName, setNftName] = useState('')
  const [extLink, setExtLink] = useState('xrpnft.com')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

  const handleNameFieldChange = (e) => {
    setNftName(e.target.value)
  }

  const handleExtLinkFieldChange = (e) => {
    setExtLink(e.target.value)
  }

  const handleDescriptionFieldChange = (e) => {
    setDescription(e.target.value)
  }

  const handleCreate = async () => {
    setLoading(true)

    const metadata = {
      image: XRPNFT_DOMAIN + pinnedFileHash,
      name: nftName,
      type: 'image',
      description: description,
      externalLink: extLink
    }

    console.log({metadata})
    // const res = await pinJsonToIPFS(metadata)
    // if (res.success) {
    //   const nftMetadataUrl = XRPNFT_DOMAIN + res.response.IpfsHash
    //   try {
    //     const nfts = await mintToken(account.secret, nftMetadataUrl, flags)
    //     openSnackbar(nfts.result.account, 'success')
    //     // TODO: reset ipfs slice when minting succeed

    //   } catch (e) {
    //     console.log('Error on Minting: ', e)
    //     openSnackbar(e.message, 'error')
    //   }
    // } else {
    //   console.log('Json Not pinned to Pinata.')
    //   openSnackbar('Json Not pinned to Pinata.', 'error')
    // }
    setLoading(false)
  }

  useEffect(() => {
    if (!login)
      navigate('/');
    testPinata()
  }, [login, navigate])
  return (
    <Page title='Create - XRPL NFT'>
      <Container maxWidth='md' sx={{ marginBottom: '3vh' }}>
        <Stack spacing={2} marginBottom={3}>
          <Typography variant="h4" >
            Create New Item
          </Typography>
          <Typography variant='caption'>
            Image, Video, Audio, or 3D Model
          </Typography>
          <Typography variant='body1'>
            File types supported: {SUPPORTED_FILE_TYPES.join(', ')}. Max size: 100MB
          </Typography>
          <NFTUploader />
          <Typography variant='body1'>
            Image on IPFS:  {pinnedFileHash}
          </Typography>
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Typography variant='caption' >
            Set Flags
          </Typography>
          <TokenFlagsForm />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Typography variant='caption'>Name</Typography>
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
          <Typography variant='caption'>External link</Typography>
          <Typography variant='body1'>
            {'This site will include a link to this URL on this item\'s detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.'}
          </Typography>
          <TextField
            placeholder={extLink}
            margin='dense'
            onChange={handleExtLinkFieldChange}
            value={extLink}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Typography variant='caption' >Description</Typography>
          <Typography variant='body1'>
            {'The description will be included on the item\'s detail page underneath its image. Markdown syntax is supported.'}
          </Typography>
          <TextField
            placeholder='Provide a detailed description of your item'
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
        <CollectionAndProperties />
        <LoadingButton
          sx={{ margin: 1, padding: 1 }}
          loading={loading}
          loadingPosition='start'
          startIcon={<Icon icon="logos:linux-mint" />}
          onClick={handleCreate}
          variant='contained'
        >
          Create
        </LoadingButton>
        {/* </Stack> */}
        <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
      </Container>
    </Page >
  );
}
