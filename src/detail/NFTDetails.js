import { CopyToClipboard } from 'react-copy-to-clipboard';

// Material
import {
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
    useTheme // Add this import
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fVolume } from 'src/utils/formatNumber';
import { convertHexToString, parseNFTokenID } from 'src/utils/parse';

// Components
import NFTPreview from './NFTPreview';
import FlagsContainer from 'src/components/Flags';
import Properties from './Properties';
import Levels from 'src/minting/NFTLevels/Levels';

// Add these imports at the top of the file
import { alpha, styled } from '@mui/material/styles';
import Glass from '@mui/material/Paper';

// Create a styled component for the glass effect
const GlassPanel = styled(Glass)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`
}));

function getProperties(meta) {
    const properties = [];
    if (!meta) return [];

    // Attributes
    try {
        const attributes = meta.attributes;
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                const type = attr.type || attr.trait_type;
                const value = attr.value;
                properties.push({ type, value });
            }
        }
    } catch (e) {}

    // Other props
    const props = [
        'Rarity',
        'Signature',
        'Background',
        'Base',
        'Mouth',
        'Accessories',
        'Base Effects',
        // ==============
        'Blade Effect',
        'End Scene',
        'Music',
        'Blades In Video',
        // ==============
        'Special'
    ];

    try {
        for (const prop of props) {
            if (meta[prop]) {
                properties.push({ type: prop, value: meta[prop] });
            }
        }
    } catch (e) {}

    return properties;
}

export default function NFTDetails({ nft }) {
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const theme = useTheme(); // Add this line to get the theme

    const {
        uuid,
        name,
        collection,
        account,
        date,
        meta,
        dfile,
        URI,
        cslug,
        NFTokenID,
        props,
        total,
        volume,
        rarity,
        rarity_rank,
        files
    } = nft;

    const ParsedURI = convertHexToString(URI);

    const { flag, royalty, issuer, taxon, transferFee } =
        parseNFTokenID(NFTokenID);

    let strDateTime = '';
    if (date) {
        const dt = new Date(date); // .toLocaleDateString().split('.')[0].replace('T', ' ')
        const strDate = dt.toLocaleDateString();
        const strTime = dt.toLocaleTimeString();
        strDateTime = `${strDate} ${strTime}`;
    }

    const collectionName =
        collection || meta?.collection?.name || '[No Collection]';

    const properties = props || getProperties(meta);
    const hasProperties = properties && properties.length > 0;

    return (
        <GlassPanel elevation={0}>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <NFTPreview nft={nft} />
                <Stack>
                    <Accordion defaultExpanded={!hasProperties}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon color="primary" />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Stack
                                spacing={2}
                                direction="row"
                                borderRadius={20}
                            >
                                <DescriptionIcon color="primary" />
                                <Typography variant="s16" color="primary.main">
                                    Description
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            {meta?.description ? (
                                <Typography>{meta.description}</Typography>
                            ) : (
                                <Typography sx={{ textAlign: 'center' }}>
                                    No description for this item
                                </Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Stack>
                <Stack>
                    <Accordion defaultExpanded={hasProperties}>
                        <AccordionSummary
                            id="panel3bh-header"
                            expandIcon={<ExpandMoreIcon color="primary" />}
                            aria-controls="panel3bh-content"
                        >
                            <Stack spacing={2} direction="row">
                                <Icon
                                    icon="majesticons:checkbox-list-detail-line"
                                    fontSize={25}
                                    style={{
                                        color: theme.palette.primary.main
                                    }}
                                />
                                <Typography variant="s16" color="primary.main">
                                    Properties
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            {hasProperties ? (
                                <Properties
                                    properties={properties}
                                    total={total}
                                />
                            ) : (
                                <Stack alignItems="center">
                                    <Typography>No Properties</Typography>
                                </Stack>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Stack>
                <Stack>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon color="primary" />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Stack spacing={2} direction="row">
                                <ArticleIcon color="primary" />
                                <Typography variant="s16" color="primary.main">
                                    Details
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Typography variant="caption">Flags</Typography>
                                <FlagsContainer Flags={flag} />
                                <Typography variant="s6">
                                    {strDateTime}
                                </Typography>
                            </Stack>
                            {rarity_rank > 0 && (
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ mt: 2 }}
                                >
                                    <Typography variant="caption">
                                        Rarity Rank
                                    </Typography>
                                    <Typography variant="s6">
                                        # {rarity_rank}
                                    </Typography>
                                </Stack>
                            )}
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Typography variant="caption">Taxon</Typography>
                                <Typography variant="s6">{taxon}</Typography>
                                <Typography variant="caption">
                                    Transfer Fee
                                </Typography>
                                <Typography variant="s6">
                                    {transferFee} %
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    Collection
                                </Typography>
                                {cslug ? (
                                    <Link
                                        href={`/collection/${cslug}`}
                                        underline="none"
                                    >
                                        <Typography sx={{ pl: 1 }}>
                                            {collectionName}
                                        </Typography>
                                    </Link>
                                ) : (
                                    <Typography sx={{ pl: 1 }}>
                                        {collectionName}
                                    </Typography>
                                )}
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    Volume
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <Icon icon={rippleSolid} />
                                    <Typography variant="s6">
                                        {fVolume(volume || 0)}
                                    </Typography>
                                    <Tooltip
                                        title={
                                            <Typography variant="body2">
                                                Traded volume on XRPL
                                            </Typography>
                                        }
                                    >
                                        <Icon icon={infoFilled} />
                                    </Tooltip>
                                </Stack>
                            </Stack>
                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <Stack spacing={1}>
                                <Typography variant="caption">Owner</Typography>
                                <Stack
                                    direction="row"
                                    spacing={0.2}
                                    alignItems="center"
                                    sx={{
                                        display: 'inline-flex',
                                        overflowWrap: 'anywhere'
                                    }}
                                >
                                    <Link
                                        href={`/account/${account}`}
                                        underline="hover"
                                        // target="_blank"
                                        variant="info"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography sx={{ ml: 1 }}>
                                            {account}
                                        </Typography>
                                    </Link>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        target="_blank"
                                        href={`https://bithomp.com/explorer/${account}`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Tooltip title="Check on Bithomp">
                                            <IconButton
                                                edge="end"
                                                aria-label="bithomp"
                                                size="small"
                                            >
                                                <Avatar
                                                    alt="bithomp"
                                                    src="/static/bithomp.ico"
                                                    sx={{
                                                        width: 16,
                                                        height: 16
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                    <CopyToClipboard
                                        text={account}
                                        onCopy={() =>
                                            openSnackbar('Copied!', 'success')
                                        }
                                    >
                                        <Tooltip title="Click to copy">
                                            <IconButton size="small">
                                                <ContentCopyIcon
                                                    fontSize="small"
                                                    sx={{
                                                        width: 16,
                                                        height: 16
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </CopyToClipboard>
                                </Stack>
                            </Stack>
                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <Stack spacing={1}>
                                <Typography variant="caption">
                                    Issuer
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={0.2}
                                    alignItems="center"
                                    sx={{
                                        display: 'inline-flex',
                                        overflowWrap: 'anywhere'
                                    }}
                                >
                                    <Link
                                        href={`/account/${issuer}`}
                                        underline="hover"
                                        // target="_blank"
                                        variant="info"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography sx={{ ml: 1 }}>
                                            {issuer}
                                        </Typography>
                                    </Link>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        target="_blank"
                                        href={`https://bithomp.com/explorer/${issuer}`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Tooltip title="Check on Bithomp">
                                            <IconButton
                                                edge="end"
                                                aria-label="bithomp"
                                                size="small"
                                            >
                                                <Avatar
                                                    alt="bithomp"
                                                    src="/static/bithomp.ico"
                                                    sx={{
                                                        width: 16,
                                                        height: 16
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                    <CopyToClipboard
                                        text={issuer}
                                        onCopy={() =>
                                            openSnackbar('Copied!', 'success')
                                        }
                                    >
                                        <Tooltip title="Click to copy">
                                            <IconButton size="small">
                                                <ContentCopyIcon
                                                    fontSize="small"
                                                    sx={{
                                                        width: 16,
                                                        height: 16
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </CopyToClipboard>
                                </Stack>
                            </Stack>
                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <Stack spacing={1}>
                                <Typography variant="caption">
                                    NFTokenID
                                </Typography>
                                <Link
                                    href={`https://bithomp.com/explorer/${NFTokenID}`}
                                    target="_blank"
                                    variant="info"
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography
                                        sx={{ ml: 1 }}
                                        style={{ wordWrap: 'break-word' }}
                                    >
                                        {NFTokenID}
                                    </Typography>
                                </Link>
                            </Stack>
                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <Stack spacing={1} mt={1}>
                                <Typography variant="caption">
                                    {`Parsed media files${
                                        files?.filter((file) => file.isIPFS)
                                            .length
                                            ? ' (IPFS):'
                                            : ':'
                                    }`}
                                </Typography>
                                {files?.map((file, index) => {
                                    // Determine the href for the "Cached" link
                                    let cachedHref;
                                    if (file.isIPFS && file.IPFSPinned) {
                                        cachedHref = `https://gateway.xrpnft.com/ipfs/${file.IPFSPath}`;
                                    } else if (!file.isIPFS && file.dfile) {
                                        cachedHref = `https://s2.xrpnft.com/d1/${file.dfile}`;
                                    }

                                    return (
                                        <Stack
                                            key={file.type}
                                            spacing={1}
                                            alignItems="flex-start"
                                        >
                                            <Typography variant="caption">{`${file.type}:`}</Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: 'inline-flex',
                                                    overflowWrap: 'anywhere'
                                                }}
                                            >
                                                {/^https?:\/\//.test(
                                                    file.parsedUrl
                                                ) ? (
                                                    <Link
                                                        href={file.parsedUrl}
                                                        sx={{
                                                            display:
                                                                'inline-flex',
                                                            overflowWrap:
                                                                'anywhere'
                                                        }}
                                                        underline="hover"
                                                        target="_blank"
                                                        variant="body2"
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        {file.parsedUrl}
                                                    </Link>
                                                ) : (
                                                    file.parsedUrl
                                                )}
                                                {cachedHref && (
                                                    <Link
                                                        href={cachedHref}
                                                        sx={{
                                                            display:
                                                                'inline-flex',
                                                            whiteSpace:
                                                                'nowrap',
                                                            ml: 1
                                                        }}
                                                        underline="hover"
                                                        target="_blank"
                                                        variant="body2"
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        Cached
                                                    </Link>
                                                )}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>

                            {/* Add image link here */}
                            <Stack spacing={1} mt={2}>
                                <Typography variant="caption">
                                    Converted-image:
                                </Typography>
                                {files?.find((file) => file.type === 'image')
                                    ?.cachedUrl && (
                                    <Link
                                        href={
                                            files.find(
                                                (file) => file.type === 'image'
                                            ).cachedUrl
                                        }
                                        underline="hover"
                                        target="_blank"
                                        variant="body2"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        {
                                            files.find(
                                                (file) => file.type === 'image'
                                            ).cachedUrl
                                        }
                                    </Link>
                                )}
                            </Stack>

                            <Divider sx={{ mt: 2, mb: 2 }} />
                        </AccordionDetails>
                    </Accordion>
                </Stack>
                {/* NFT Leveled Properties start--- */}
                {/* {
                    levels &&
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Stack spacing={2} direction='row'>
                                <Icon icon='majesticons:checkbox-list-detail-line' fontSize={25} />
                                <Typography variant='s16' >Level Properties</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Levels levels={data.description?.levels} />
                        </AccordionDetails>
                    </Accordion>
                } */}
                {/* NFT Leveled Properties end--- */}
            </Stack>
        </GlassPanel>
    );
}
