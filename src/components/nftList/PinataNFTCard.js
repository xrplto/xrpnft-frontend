import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrenToken } from 'app/slices/nftsSlice';
// material
import { Box, Card, Link, Typography, Stack/*, Avatar*/ } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
//import { red, green, blue } from '@mui/material/colors';
import Label from '../Label';
//import ColorPreview from '../../components/ColorPreview';

// import {Icon} from '@mui/material'
import { Icon } from '@iconify/react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpokeIcon from '@mui/icons-material/Spoke';
import { parsePinataNFT, parsePinataNFTUrl } from 'utils/pinata';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PINATA_GATEWAY } from 'utils/constants';
import { ImgLoadingBg } from './ImgLoadingBg';


const TokenImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

PinataNFTCard.propTypes = {
    nftoken: PropTypes.object
};

export default function PinataNFTCard({ nftoken }) {
    const { tokenID, URI } = nftoken;
    const [imgUrl, setImgUrl] = useState('')
    const dispatch = useDispatch()
    // 000000000272ECED526CB9FB90275EC6196EC6C522CFFB938962EFA100000006
    // 6D796E34333433667420637573746F6D206461746120455652
    const nft = parsePinataNFT(tokenID, URI);
    const status = 'NEW';
    const name = nft.issuer;
    const navigate = useNavigate();
    const handleNFTClick = () => {
        navigate(`/offpage/${nftoken.tokenID}?tokenURI=${nftoken.URI}`);
        dispatch(setCurrenToken(nftoken))
    }

    const getNFTMetadata = async () => {
        const metadataUrl = parsePinataNFTUrl(nftoken.URI);
        try {
            const res = await axios.get(PINATA_GATEWAY + metadataUrl)
            setImgUrl(PINATA_GATEWAY + res.data.fileUrl)
            console.log('requestURL: ',PINATA_GATEWAY + metadataUrl,'metadataURL', res)

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getNFTMetadata()
    }, [])

    return (
        <Card onClick={handleNFTClick} sx={{
            borderRadius: 1,
            maxWidth: 300,
            '&:hover': {
                cursor: 'pointer'
            },
        }}>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                {status && (
                    <Label
                        variant="filled"
                        color={(status === 'sale' && 'error') || 'info'}
                        sx={{
                            zIndex: 9,
                            top: 16,
                            right: 16,
                            position: 'absolute',
                            textTransform: 'uppercase'
                        }}
                    >
                        {status}
                    </Label>
                )}
                {/* {!imgUrl && (
                    <TokenImgStyle id={tokenID} alt={name} src={'/static/cover.jpg'} />
                )} */}
                {imgUrl ? (
                    <TokenImgStyle id={tokenID} alt={name} src={imgUrl} />
                ):
                <ImgLoadingBg />
                }
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-around">
                    {nft.flags.tfBurnable && (<LocalFireDepartmentIcon width="32" height="32" />)}
                    {nft.flags.tfOnlyXRP && (<SpokeIcon width="32" height="32" />)}
                    {nft.flags.tfTrustLine && (<VerifiedUserIcon width="32" height="32" />)}
                    {nft.flags.tfTransferable && (<TransferWithinAStationIcon width="32" height="32" />)}
                    {nft.flags.tfNoFlag && (<Box sx={{ mx: "auto", width: 32, height: 32 }} />)}
                </Stack>

                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {name}
                    </Typography>
                </Link>
            </Stack>
        </Card>
    );
}
