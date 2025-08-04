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
    useTheme, // Add this import
    Button
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';

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
import CodeHighlight from 'src/components/CodeHighlight';

// Add these imports at the top of the file
import { alpha, styled } from '@mui/material/styles';
import Glass from '@mui/material/Paper';
import Box from '@mui/material/Box';

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
        hash,
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
        files,
        memo,
        taxon: apiTaxon
    } = nft;

    const ParsedURI = convertHexToString(URI);

    const { flag, royalty, issuer, transferFee } =
        parseNFTokenID(NFTokenID);
    
    const taxon = apiTaxon;

    let strDateTime = '';
    if (date) {
        const dt = new Date(date); // .toLocaleDateString().split('.')[0].replace('T', ' ')
        const strDate = dt.toLocaleDateString();
        const strTime = dt.toLocaleTimeString();
        strDateTime = `${strDate} ${strTime}`;
    }

    const collectionName =
        collection || /*meta?.collection?.name ||*/ '[No Collection]';

    const properties = props || getProperties(meta);
    const hasProperties = properties && properties.length > 0;

    // Function to check if input is valid JSON or a JavaScript object/array
    const isValidJSONOrObject = (input) => {
        // If it's already an object or array, it's valid
        if (typeof input === 'object' && input !== null) {
            return true;
        }

        // If it's a string, try to parse it
        if (typeof input === 'string') {
            try {
                // First, try parsing as JSON
                JSON.parse(input);
                return true;
            } catch (e) {
                // If that fails, try evaluating as a JavaScript expression
                try {
                    // Use Function constructor to create a sandbox
                    new Function('return ' + input)();
                    return true;
                } catch (e) {
                    return false;
                }
            }
        }
        
        // If it's neither an object nor a string, it's not valid
        return false;
    };

    // Function to safely parse and stringify the memo content
    const parseMemo = (memo) => {
        if (typeof memo === 'object' && memo !== null) {
            return JSON.stringify(memo, null, 2);
        }
        
        if (typeof memo === 'string') {
            try {
                const parsed = JSON.parse(memo);
                return JSON.stringify(parsed, null, 2);
            } catch (e) {
                try {
                    const obj = new Function('return ' + memo)();
                    return JSON.stringify(obj, null, 2);
                } catch (e) {
                    // Ensure the string is safe for React rendering
                    return memo.replace(/[<>]/g, (char) => char === '<' ? '&lt;' : '&gt;');
                }
            }
        }
        
        // If memo is neither an object nor a string, convert to string
        return String(memo);
    };

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

                            {/* Explore Similar NFTs Button */}
                            {hasProperties && (
                                <>
                                    <Stack spacing={2} alignItems="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SearchIcon />}
                                            fullWidth
                                            onClick={() => {
                                                // Build the filterAttrs array
                                                const filterAttrs = properties.map(prop => ({
                                                    trait_type: prop.type,
                                                    value: [prop.value]
                                                }));
                                                
                                                // Build the query parameters
                                                const params = new URLSearchParams();
                                                params.set('issuer', issuer);
                                                params.set('taxon', taxon || '');
                                                params.set('filterAttrs', JSON.stringify(filterAttrs));
                                                
                                                // Log for debugging
                                                console.log('Explore Similar NFTs params:', {
                                                    issuer,
                                                    taxon,
                                                    filterAttrs,
                                                    cslug,
                                                    collection: collectionName
                                                });
                                                
                                                // Navigate to collection page with filters if collection exists
                                                if (cslug) {
                                                    // Go to specific collection with filters
                                                    window.location.href = `/collection/${cslug}?${params.toString()}`;
                                                } else {
                                                    // Go to explore page if no collection
                                                    window.location.href = `/explore?${params.toString()}`;
                                                }
                                            }}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                py: 1.5
                                            }}
                                        >
                                            Explore Similar NFTs
                                        </Button>
                                        <Typography variant="caption" color="text.secondary" textAlign="center">
                                            Find NFTs with the same issuer, taxon, and properties
                                        </Typography>
                                    </Stack>
                                    <Divider sx={{ mt: 2, mb: 2 }} />
                                </>
                            )}

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
                            <Stack spacing={1}>
                                <Typography variant="caption">
                                    Transaction
                                </Typography>
                                <Link
                                    href={`https://bithomp.com/explorer/${hash}`}
                                    target="_blank"
                                    variant="info"
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography
                                        sx={{ ml: 1 }}
                                        style={{ wordWrap: 'break-word' }}
                                    >
                                        {hash}
                                    </Typography>
                                </Link>
                            </Stack>
                            <Divider sx={{ mt: 2, mb: 2 }} />

                            {memo && (
                                <>
                                    <Stack spacing={1}>
                                        <Typography variant="caption">
                                            Memo
                                        </Typography>
                                        {isValidJSONOrObject(memo) ? (
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon color="primary" />}
                                                    aria-controls="panel-memo-content"
                                                    id="panel-memo-header"
                                                >
                                                    <Stack spacing={2} direction="row">
                                                        <Icon
                                                            icon="mdi:code-json"
                                                            fontSize={25}
                                                            style={{
                                                                color: theme.palette.primary.main
                                                            }}
                                                        />
                                                        <Typography variant="s16" color="primary.main">
                                                            Memo (JSON)
                                                        </Typography>
                                                    </Stack>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Box sx={{ overflowX: 'auto' }}>
                                                        <CodeHighlight json={parseMemo(memo)} />
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        ) : (
                                            <Typography
                                                sx={{ ml: 1 }}
                                                style={{ wordWrap: 'break-word' }}
                                            >
                                                {memo}
                                            </Typography>
                                        )}
                                    </Stack>
                                    <Divider sx={{ mt: 2, mb: 2 }} />
                                </>
                            )}

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

                                    let convertedHref = file.convertedFile ? `https://s2.xrpnft.com/d1/${file.convertedFile}` : null;
                                    
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
                                                {convertedHref && (
                                                    <Link
                                                        href={convertedHref}
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
                                                        Converted
                                                    </Link>
                                                )}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>

                            <Divider sx={{ mt: 2, mb: 2 }} />

                            {/* New Raw Metadata section */}
                            <Stack>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon color="primary" />}
                                        aria-controls="panel-raw-metadata-content"
                                        id="panel-raw-metadata-header"
                                    >
                                        <Stack spacing={2} direction="row">
                                            <Icon
                                                icon="mdi:code-json"
                                                fontSize={25}
                                                style={{
                                                    color: theme.palette.primary.main
                                                }}
                                            />
                                            <Typography variant="s16" color="primary.main">
                                                Raw Metadata
                                            </Typography>
                                        </Stack>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {meta ? (
                                            <Box sx={{ overflowX: 'auto' }}>
                                                <CodeHighlight json={meta} />
                                            </Box>
                                        ) : (
                                            <Typography sx={{ textAlign: 'center' }}>
                                                No raw metadata available
                                            </Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
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
