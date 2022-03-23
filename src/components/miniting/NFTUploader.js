import { Card, Divider } from "@mui/material";
import styled from "styled-components";
import { useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import Fab from '@mui/material/Fab'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

export const NFTUploader = () => {

    const [selectedFile, setSelectedFile] = useState(null)

    const handleUploadClick = (e) => {
        var file = e.target.files[0]
        const reader = new FileReader()
        if (file) {

            var url = reader.readAsDataURL(file)
            // console.log('acd')

            reader.onloadend = function (e) {
                setSelectedFile([reader.result])
            }

            setSelectedFile(e.target.files[0])
            console.log('url:', url)
        }
    }
    return (
        <CardWrapper>
            <Card sx={{ maxWidth: 300, justifyContent:'center' }} >
                <img src={selectedFile} />
                <input
                    style={{display: 'none'}}
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={handleUploadClick}
                />
                <Divider />
                <label htmlFor="contained-button-file">
                    <Fab component="span" >
                        <AddPhotoAlternateIcon />
                    </Fab>
                </label>
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