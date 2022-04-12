import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import React from 'react';
import {
  Container,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import Page from 'components/Page';
import { Heading } from 'components/atoms/Heading';
import { NFTUploader } from 'components/miniting/NFTUploader';
import { Caption } from 'components/atoms/Caption';
import { TypoDescription } from 'components/atoms/Description';
import { SUPPORTED_FILE_TYPES, XRPNFT_DOMAIN } from 'utils/constants';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { mintToken } from 'utils/tokenActions'
import { testPinata, pinJsonToIPFS } from 'utils/pinata'
import { useNavigate } from 'react-router-dom'
import TokenFlagsForm from 'components/miniting/TokenFlagsForm';
import XSnackbar from 'components/common/Snackbar';
import { useSnackbar } from 'hooks/useSnackbar';

export default function Minting() {

  const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
  const account = useSelector(state => state.account.account)
  const pinnedFileHash = useSelector(state => state.ipfs.pinnedFileHash)
  const login = useSelector(state => state.account.login)
  const flags = useSelector(state => state.ipfs.flags)
  const [loading, setLoading] = useState(false);
  const [nftName, setNftName] = useState('')
  const [extLink, setExtLink] = useState('xrpnft.com')
  const [description, setDescription] = useState('You can create an NFTokenOffer to sell the NFToken, creating an entry to the XRP Ledger. Another account can accept the NFTokenOffer, transferring the NFToken to the accepting account’s NFTokenPage.')
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
      fileUrl: XRPNFT_DOMAIN + pinnedFileHash,
      name: nftName,
      type: 'image',
      description: description,
      externalLink: extLink
    }

    const res = await pinJsonToIPFS(metadata)
    if (res.success) {
      const nftMetadataUrl = XRPNFT_DOMAIN + res.response.IpfsHash
      try {
        const nfts = await mintToken(account.secret, nftMetadataUrl, flags)
        openSnackbar(nfts.result.account, 'success')
        // TODO: reset ipfs slice when minting succeed

      } catch (e) {
        console.log('Error on Minting: ', e)
        openSnackbar(e.message, 'error')
      }
    } else {
      console.log('Json Not pinned to Pinata.')
      openSnackbar('Json Not pinned to Pinata.', 'error')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!login)
      navigate('/');
    testPinata()
  }, [login])
  return (
    <Page title='Create - XRPL NFT'>
      <Container maxWidth='md' sx={{ marginTop: '3vh' }}>
        <Stack spacing={2} marginBottom={3}>
          <Heading title={'Create New Item'} />
          <Caption caption={'Image, Video, Audio, or 3D Model'} />
          <TypoDescription description={'File types supported: ' + SUPPORTED_FILE_TYPES.join(', ') + '. Max size: 100MB'} />
          <NFTUploader />
          <TypoDescription description={'Image on IPFS: ' + pinnedFileHash} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Caption caption={'Set Flags'} />
          <TokenFlagsForm />
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
          <Caption caption={'Description'} />
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
          <LoadingButton
            loading={loading}
            loadingPosition='start'
            startIcon={<SendIcon />}
            onClick={handleCreate}
            variant='contained'
          >
            Create
          </LoadingButton>
          <Divider />
        </Stack>
        <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
      </Container>
    </Page >
  );
}
