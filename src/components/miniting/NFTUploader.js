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
import { resetPickedFile, setPickedFile } from 'app/slices/ipfSlice';

const client = create('https://ipfs.infura.io:5001/api/v0')

export const NFTUploader = () => {

    const fileRef = useRef();
    const [fileUrl, setFileUrl] = useState(null)
    const dispatch = useDispatch()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)


    const handleFileSelect = (e) => {
        const pickedFile = e.target.files[0]

        const reader = new FileReader()
        if (pickedFile) {
            console.log('Picked File',pickedFile)
            // setFile(pickedFile)
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
                const added = await client.add(file)
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                dispatch(setImgUrl(url))
                console.log('ipfs-upload:', url)
            } catch (error) {
                console.log('Error uploading files:', error)
            }
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
                    sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh'} : { display: 'none' }}
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
                    overflow: 'hidden',
                }}
                onClick={() => fileRef.current.click()}
            >
                <img src={fileUrl} />
                <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {}} />
                <Stack direction='row' justifyContent='space-evenly'>
                    <ButtonGroup variant='text' fullWidth aria-label='outlined primary button group' sx={{ display: 'none' }}>
                        <Button fullWidth startIcon={<AddPhotoAlternateIcon />}>
                            Add
                        </Button>
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
            </Card>
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