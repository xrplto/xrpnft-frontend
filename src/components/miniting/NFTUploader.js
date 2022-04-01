import { Button, Card, Stack } from '@mui/material';
import styled from 'styled-components';
import { useState, useRef } from 'react'
import { create } from 'ipfs-http-client'
import ImageIcon from '@mui/icons-material/Image';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { setImgUrl } from 'app/slices/ipfSlice'
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import ButtonGroup from '@mui/material/ButtonGroup';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux'
import { resetPickedFile, setPickedFile, setPinnedFileHash } from 'app/slices/ipfSlice';
import { testPinata, pinFileToIPFS } from 'utils/pinata'
import axios from 'axios'
import FormData from 'form-data';
import { PINATA_PINNING_FILE_URL } from 'utils/constants';

const client = create('https://ipfs.infura.io:5001/api/v0')

export const NFTUploader = () => {

    const fileRef = useRef();
    const [fileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()
    const [file, setFile] = useState(null)
    const [ipfsHash, setIpfsHash] = useState('')
    const [fileReadableStream, setFileReadableStream] = useState(null)
    const [loading, setLoading] = useState(false)



    const handleFileSelect = (e) => {
        const pickedFile = e.target.files[0]

        const reader = new FileReader()
        if (pickedFile) {
            console.log('type of pickedFile:', typeof pickedFile)
            setFileReadableStream(pickedFile.stream())
            console.log('streamm:', pickedFile.stream())
            console.log('Picked File', pickedFile)
            console.log('name: ', pickedFile.name)
            setFile(pickedFile)
            reader.readAsDataURL(pickedFile)
            reader.onloadend = function (e) {
                setFileUrl(reader.result)
                dispatch(setPickedFile(reader.result))
            }
        }
    }

    const upLoadIPFS = async () => {
        setLoading(true)
        if (file) {
            try {
                const formData = new FormData()
                formData.append("file", file)
                const response = await axios.post(
                    PINATA_PINNING_FILE_URL,
                    formData,
                    {
                        maxContentLength: "Infinity",
                        headers: {
                            "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
                            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                            'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_KEY

                        }
                    }
                )

                console.log(response)

                setIpfsHash(response.data.IpfsHash)
                dispatch(setPinnedFileHash(response.data.IpfsHash))

            } catch (e) {
                console.log(e)
            }
            //     try {
            //         const added = await client.add(file)
            //         const url = `https://ipfs.infura.io/ipfs/${added.path}`
            //         dispatch(setImgUrl(url))
            //         console.log('ipfs-upload:', url)
            //     } catch (error) {
            //         console.log('Error uploading files:', error)
            //     }
            //     console.log('pinning to ipfs....', file)
            // console.log('fileReadableStream', fileReadableStream)
            // await pinFileToIPFS(fileReadableStream)

        }
        setLoading(false)
    }

    const handleResetImage = (e) => {
        e.stopPropagation()
        setFileUrl(null)
        dispatch(resetPickedFile())
        fileRef.current.value = null
    }

    return (
        <CardWrapper>
            <CardOverlay
                onClick={() => fileRef.current.click()}
            >
                <IconButton
                    aria-label='close' onClick={(e) => handleResetImage(e)}
                    sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                >
                    <CloseIcon color='white' />
                </IconButton>
                {/* <ImageIcon fontSize='large' sx={fileUrl ? { position: 'absolute' } : {}} /> */}
            </CardOverlay>
            <input
                ref={fileRef}
                style={{ display: 'none' }}
                // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                accept='image/*'
                id='contained-button-file'
                multiple
                type='file'
                onChange={handleFileSelect}
            />
            <Card
                sx={{
                    display: 'flex',
                    width: 320,
                    height: 240,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'auto',
                }}
                onClick={() => fileRef.current.click()}
            >
                <img src={fileUrl} />
                <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {}} />

            </Card>
            <Stack direction='row' justifyContent='space-evenly'>
                <ButtonGroup variant='text' fullWidth aria-label='outlined primary button group' sx={{ zIndex: 10 }}>
                    {/* <Button fullWidth startIcon={<AddPhotoAlternateIcon />}>
                            Add
                        </Button> */}
                    <LoadingButton
                        loading={loading}
                        loadingPosition='start'
                        startIcon={<SendIcon />}
                        onClick={upLoadIPFS}
                    >
                        Upload
                    </LoadingButton>
                </ButtonGroup>
            </Stack>
        </CardWrapper>
    )
}

const CardWrapper = styled.div`
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    position: relative;
    width: fit-content;
    &:hover {
        cursor: pointer;
    }
`

const CardOverlay = styled.div`
display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: black;
  inset: 0;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.6;
  }
  }
`