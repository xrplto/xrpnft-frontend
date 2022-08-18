import axios from 'axios'
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef } from 'react';

// Material
import {
    styled,
    Card,
    IconButton,
    Stack
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { PINATA_PINNING_FILE_URL } from 'src/utils/constants';

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';

const CardWrapper = styled('div')(
    ({ theme }) => `
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    width: fit-content;
    &:hover {
        cursor: pointer;
    }
`
);

const CardOverlay = styled('div')(
    ({ theme }) => `
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
`
);

export default function NFTUploader() {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const fileRef = useRef();
    const { accountProfile } = useContext(AppContext);
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const [fileUrl, setFileUrl] = useState(null)
    const [file, setFile] = useState(null)
    const [imgExt, setImgExt] = useState('');
    const [loading, setLoading] = useState(false)

    const onUploadNft = async () => {
        // POST https://api.xrpnft.com/api/mint
        setLoading(true);
        try {
            let res;
            const account = accountProfile.account;

            const data = {};
            data.fileExt = imgExt;

            const formdata = new FormData();
            formdata.append('nft', file);
            formdata.append('account', account);
            formdata.append('data', JSON.stringify(data));
            
            res = await axios.post(`${BASE_URL}/account/mint`, formdata, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    console.log(ret.link);
                    // window.location.href = ret.link;
                    
                    window.open(ret.link, '_blank');

                    openSnackbar('File upload successful!', 'success')
                    // setFile(null);
                } else {
                    // { status: false, data: null, err: 'ERR_URL_SLUG' }
                    const err = ret.err;
                }
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleFileSelect = (e) => {
        const pickedFile = e.target.files[0];
        if (pickedFile) {
            const fileName = pickedFile.name;
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(fileName)[1];
            if (ext)
                ext = ext.toLowerCase();
            if (ext === 'jpg' || ext === 'png') {
                setImgExt(ext);
                setFile(pickedFile);
                // This is used as src of image
                const reader = new FileReader();
                reader.readAsDataURL(pickedFile)
                reader.onloadend = function (e) {
                    setFileUrl(reader.result); // data:image/jpeg;base64
                }
            }
        }
    }

    const pinFileToIPFS = async () => {

        // TODO: Called only when the file is uploaded to site.
        setLoading(true)
        if (file) {
            try {
                const formData = new FormData()
                formData.append("file", file)
                console.log('uploading image to ipfs')
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
                // dispatch(setPinnedFileHash(response.data.IpfsHash))
                openSnackbar('IPFSHash: ' + response.data.IpfsHash, 'success')
            } catch (e) {
                console.log(e)
                openSnackbar(e.message, 'error')
            }
        }
        setLoading(false)
    }

    const handleResetFile = (e) => {
        e.stopPropagation()
        setFileUrl(null)
        fileRef.current.value = null
    }

    return (
        <>
            <CardWrapper>
                <input
                    ref={fileRef}
                    style={{ display: 'none' }}
                    // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                    // accept='image/*'
                    accept='.png, .jpg'
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
                        position: 'relative'
                    }}
                >
                    <CardOverlay
                        onClick={() => fileRef.current.click()}
                    >
                        <IconButton
                            aria-label='close' onClick={(e) => handleResetFile(e)}
                            sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                        >
                            <CloseIcon color='white' />
                        </IconButton>
                    </CardOverlay>
                    <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                    <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {width: 100, height: 100}} />
                </Card>
            </CardWrapper>
            <LoadingButton
                loading={loading}
                loadingPosition='start'
                startIcon={<SendIcon />}
                onClick={onUploadNft}
            >
                Upload
            </LoadingButton>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </>
    )
}
