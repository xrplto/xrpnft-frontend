import { Button, Card, Divider, Stack } from "@mui/material";
import styled from "styled-components";
import { useDispatch } from 'react-redux'
import { useState, useRef } from 'react'
import { create } from 'ipfs-http-client'
import Fab from '@mui/material/Fab'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { setImgUrl } from 'app/slices/ipfSlice'
import { LoadingButton } from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';
import ButtonGroup from '@mui/material/ButtonGroup';

const client = create('https://ipfs.infura.io:5001/api/v0')

export const NFTUploader = () => {

    const fileRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null)
    const dispatch = useDispatch()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleUploadClick = (e) => {
        var file = e.target.files[0]
        const reader = new FileReader()
        if (file) {
            setFile(file)

            reader.readAsDataURL(file)
            reader.onloadend = function (e) {
                setSelectedFile([reader.result])
            }

            setSelectedFile(e.target.files[0])

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

    return (
        <CardWrapper>
            <Card sx={{ width: 300, maxHeight: 400, justifyContent: 'space-between', overflowY: 'auto' }} >
                <img src={selectedFile} style={{ maxHeight: 300 }} />
                <Divider />
                <Stack direction='row' justifyContent='space-evenly'>
                    <input
                        ref={fileRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleUploadClick}
                    />
                    <ButtonGroup variant="text" fullWidth aria-label="outlined primary button group">

                        {/* <label htmlFor="contained-button-file"> */}
                        <Button onClick={() => fileRef.current.click()} fullWidth startIcon={<AddPhotoAlternateIcon />}>
                            Add
                        </Button>
                        {/* </label> */}
                        <LoadingButton
                            loading={loading}
                            loadingPosition="start"
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
    width: fit-content;
    &:hover {
        cursor: pointer;
    }
`