import ModalImage from "react-modal-image";
// Material
import {
    CardMedia,
    IconButton,
    Link,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import StorefrontIcon from '@mui/icons-material/Storefront';
import FlagsContainer from 'src/components/Flags';
import { useCallback, useEffect, useState } from "react";
import { getImgUrl, getMetadata } from "src/utils/parse";
import { formatDateTime } from "src/utils/formatTime";
// ----------------------------------------------------------------------

export default function CollectedNFTPreview({ meta, URI, NFTokenID, collection, time, flag, taxon, transferFee, name }) {

    const [metadata, setMetadata] = useState(null)
    const [imgUrl, setImgUrl] = useState('')

    const fetchMetadata = useCallback(async (URI) => {
        const data = await getMetadata(URI);

        setMetadata(data);
    }, [URI])


    useEffect(() => {

        if (meta) {
            setMetadata(meta)
        } else if (URI) {
            // When meta == null, but URI != null, then fetch NFT metadata from URI field.
            fetchMetadata(URI)
        } else setMetadata(null)
    }, [meta, URI])

    useEffect(() => {
        if (metadata) {
            const imgUrl = getImgUrl(metadata)
            setImgUrl(imgUrl)
        }
    }, [metadata])

    return (
        <TableRow
            // hover
            sx={{
                [`& .${tableCellClasses.root}`]: {
                    // color: (error ? '#B72136' : '#B72136')
                }
            }}
        >
            {

                <TableCell align="left">
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        {metadata && metadata.video ?
                            <CardMedia
                                component="video"
                                image={imgUrl}
                                title='title'
                                controls
                                style={{
                                    width: 128,
                                    height: 128,
                                    filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                }}
                            />
                            :
                            <ModalImage
                                className='nftpreview1'
                                small={imgUrl}
                                large={imgUrl}
                                alt={name}
                                hideDownload
                                hideZoom
                                style={{
                                    width: 128,
                                    height: 128,
                                    filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                }}
                            />
                        }
                        <Stack spacing={0.5}>
                            <Stack direction="row" justifyContent="space-between">
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    href={`/nft/${NFTokenID}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography variant="h3" color="#33C2FF">{name === 'No Name' ? metadata?.name : name}</Typography>
                                </Link>

                                <Link
                                    underline="none"
                                    color="inherit"
                                    target="_blank"
                                    href={`/nft/${NFTokenID}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Tooltip title="Make Sell on this NFT">
                                        <IconButton edge="end" aria-label="store" size="small">
                                            <StorefrontIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="s7">Collection: </Typography>
                                <Typography variant="s6">{collection}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="s7">Accepted On: </Typography>
                                <Typography variant="s6">{formatDateTime(time)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="s7">Flags: </Typography>
                                <FlagsContainer Flags={flag} />
                                {/* <Typography variant="s6">{strDateTime}</Typography> */}
                                <Typography variant='s7'>Taxon </Typography>
                                <Typography variant='s6'>{taxon}</Typography>
                                <Typography variant="s7">Transfer Fee</Typography>
                                <Typography variant="s6">{transferFee} %</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="s7">NFTokenID: </Typography>
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    href={`https://bithomp.com/explorer/${NFTokenID}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography variant="s6">{NFTokenID}</Typography>
                                </Link>
                            </Stack>
                        </Stack>
                    </Stack>
                </TableCell>
            }
        </TableRow>
    );
}
