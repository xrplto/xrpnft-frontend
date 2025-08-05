import { CopyToClipboard } from 'react-copy-to-clipboard';

// Material
import {
    Avatar,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
    useTheme,
    Grid,
    Button,
    Collapse
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LayersIcon from '@mui/icons-material/Layers';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';

// Context
import { useContext, useState } from 'react';
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

// Create styled components for better UI
const GlassPanel = styled(Glass)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.9),
    backdropFilter: 'blur(20px)',
    borderRadius: theme.shape.borderRadius * 3,
    padding: 0,
    boxShadow: `0 12px 40px 0 ${alpha(theme.palette.common.black, 0.08)}`,
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    overflow: 'hidden'
}));

const SectionCard = styled(Card)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(10px)',
    boxShadow: `0 4px 20px 0 ${alpha(theme.palette.common.black, 0.04)}`,
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: `0 8px 30px 0 ${alpha(theme.palette.common.black, 0.08)}`,
        transform: 'translateY(-2px)'
    }
}));

const SectionHeader = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
}));

const InfoRow = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 0),
    '& .label': {
        minWidth: '120px',
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '0.02em'
    },
    '& .value': {
        flex: 1,
        color: theme.palette.text.primary,
        wordBreak: 'break-word',
        fontSize: '0.875rem',
        fontWeight: 400
    }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    fontSize: '0.75rem',
    height: 24
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    borderColor: alpha(theme.palette.divider, 0.1)
}));

const MetadataBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.default, 0.5),
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    maxHeight: '400px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px'
    },
    '&::-webkit-scrollbar-track': {
        background: alpha(theme.palette.background.default, 0.1),
        borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
        background: alpha(theme.palette.primary.main, 0.3),
        borderRadius: '4px',
        '&:hover': {
            background: alpha(theme.palette.primary.main, 0.5)
        }
    }
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
    const [showRawMetadata, setShowRawMetadata] = useState(false);

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
            <Box sx={{ p: 3 }}>
                {/* NFT Preview */}
                <Box sx={{ mb: 4 }}>
                    <NFTPreview nft={nft} />
                </Box>

                <Grid container spacing={3}>
                    {/* Description Section */}
                    <Grid item xs={12}>
                        <SectionCard>
                            <CardContent>
                                <SectionHeader>
                                    <DescriptionIcon color="primary" sx={{ fontSize: 24 }} />
                                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                                        Description
                                    </Typography>
                                </SectionHeader>
                                {meta?.description ? (
                                    <Typography variant="body2" sx={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'text.secondary' }}>
                                        {meta.description}
                                    </Typography>
                                ) : (
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        py: 4, 
                                        background: alpha(theme.palette.action.hover, 0.03),
                                        borderRadius: 2
                                    }}>
                                        <InfoOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                                            No description available
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </SectionCard>
                    </Grid>

                    {/* Properties Section */}
                    {hasProperties && (
                        <Grid item xs={12}>
                            <SectionCard>
                                <CardContent>
                                    <SectionHeader>
                                        <LayersIcon color="primary" sx={{ fontSize: 24 }} />
                                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                                            Properties
                                        </Typography>
                                    </SectionHeader>
                                    <Properties
                                        properties={properties}
                                        total={total}
                                        issuer={issuer}
                                        taxon={taxon}
                                        cslug={cslug}
                                    />
                                </CardContent>
                            </SectionCard>
                        </Grid>
                    )}

                    {/* Details Section */}
                    <Grid item xs={12}>
                        <SectionCard>
                            <CardContent>
                                <SectionHeader>
                                    <ArticleIcon color="primary" sx={{ fontSize: 24 }} />
                                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                                        Details
                                    </Typography>
                                </SectionHeader>

                                <Box>
                                    {/* Token Information */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
                                            Token Information
                                        </Typography>
                                        
                                        <InfoRow>
                                            <Typography className="label">Created</Typography>
                                            <Typography className="value">{strDateTime}</Typography>
                                        </InfoRow>
                                        
                                        <InfoRow>
                                            <Typography className="label">Flags</Typography>
                                            <Box className="value">
                                                <FlagsContainer Flags={flag} />
                                            </Box>
                                        </InfoRow>
                                        
                                        {rarity_rank > 0 && (
                                            <InfoRow>
                                                <Typography className="label">Rarity Rank</Typography>
                                                <StyledChip 
                                                    label={`#${rarity_rank}`} 
                                                    color="primary" 
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </InfoRow>
                                        )}
                                        
                                        <InfoRow>
                                            <Typography className="label">Taxon</Typography>
                                            <Typography className="value">{taxon}</Typography>
                                        </InfoRow>
                                        
                                        <InfoRow>
                                            <Typography className="label">Transfer Fee</Typography>
                                            <StyledChip 
                                                label={`${transferFee}%`} 
                                                variant="outlined" 
                                                size="small"
                                            />
                                        </InfoRow>
                                        
                                        <InfoRow>
                                            <Typography className="label">Collection</Typography>
                                            <Box className="value">
                                                {cslug ? (
                                                    <Link 
                                                        href={`/collection/${cslug}`} 
                                                        underline="hover" 
                                                        sx={{ 
                                                            fontWeight: 500,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.5
                                                        }}
                                                    >
                                                        {collectionName}
                                                        <Icon icon="mdi:arrow-top-right" fontSize={16} />
                                                    </Link>
                                                ) : (
                                                    <Typography component="span">{collectionName}</Typography>
                                                )}
                                            </Box>
                                        </InfoRow>
                                        
                                        <InfoRow>
                                            <Typography className="label">Volume</Typography>
                                            <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                                                <Icon icon={rippleSolid} />
                                                <Typography sx={{ fontWeight: 500 }}>{fVolume(volume || 0)}</Typography>
                                                <Tooltip title="Traded volume on XRPL">
                                                    <Icon icon={infoFilled} fontSize={16} style={{ opacity: 0.6 }} />
                                                </Tooltip>
                                            </Stack>
                                        </InfoRow>
                                    </Box>

                                    <SectionDivider />

                                    {/* Ownership */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
                                            Ownership
                                        </Typography>
                                        
                                        <InfoRow>
                                            <Typography className="label">Owner</Typography>
                                            <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                                                <Link href={`/account/${account}`} underline="hover" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                    {account.substring(0, 8)}...{account.substring(account.length - 6)}
                                                </Link>
                                                <Tooltip title="View on Bithomp">
                                                    <IconButton
                                                        size="small"
                                                        href={`https://bithomp.com/explorer/${account}`}
                                                        target="_blank"
                                                        rel="noreferrer noopener nofollow"
                                                        sx={{ padding: 0.25 }}
                                                    >
                                                        <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <CopyToClipboard text={account} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                    <Tooltip title="Copy full address">
                                                        <IconButton size="small" sx={{ padding: 0.25 }}>
                                                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Stack>
                                        </InfoRow>
                                        
                                        <InfoRow>
                                            <Typography className="label">Issuer</Typography>
                                            <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                                                <Link href={`/account/${issuer}`} underline="hover" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                    {issuer.substring(0, 8)}...{issuer.substring(issuer.length - 6)}
                                                </Link>
                                                <Tooltip title="View on Bithomp">
                                                    <IconButton
                                                        size="small"
                                                        href={`https://bithomp.com/explorer/${issuer}`}
                                                        target="_blank"
                                                        rel="noreferrer noopener nofollow"
                                                        sx={{ padding: 0.25 }}
                                                    >
                                                        <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <CopyToClipboard text={issuer} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                    <Tooltip title="Copy full address">
                                                        <IconButton size="small" sx={{ padding: 0.25 }}>
                                                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Stack>
                                        </InfoRow>
                                    </Box>

                                    <SectionDivider />

                                    {/* Technical Details */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
                                            Technical Details
                                        </Typography>
                                        
                                        <InfoRow>
                                            <Typography className="label">NFTokenID</Typography>
                                            <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                                                <Link
                                                    href={`https://bithomp.com/explorer/${NFTokenID}`}
                                                    target="_blank"
                                                    rel="noreferrer noopener nofollow"
                                                    underline="hover"
                                                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                                >
                                                    {NFTokenID.substring(0, 12)}...{NFTokenID.substring(NFTokenID.length - 8)}
                                                </Link>
                                                <CopyToClipboard text={NFTokenID} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                    <Tooltip title="Copy full ID">
                                                        <IconButton size="small" sx={{ padding: 0.25 }}>
                                                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Stack>
                                        </InfoRow>
                                        
                                        <InfoRow>
                                            <Typography className="label">Transaction</Typography>
                                            <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                                                <Link
                                                    href={`https://bithomp.com/explorer/${hash}`}
                                                    target="_blank"
                                                    rel="noreferrer noopener nofollow"
                                                    underline="hover"
                                                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                                >
                                                    {hash.substring(0, 12)}...{hash.substring(hash.length - 8)}
                                                </Link>
                                                <CopyToClipboard text={hash} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                    <Tooltip title="Copy full hash">
                                                        <IconButton size="small" sx={{ padding: 0.25 }}>
                                                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Stack>
                                        </InfoRow>
                                    </Box>

                                    <SectionDivider />

                                    {memo && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
                                                Memo
                                            </Typography>
                                            {isValidJSONOrObject(memo) ? (
                                                <MetadataBox>
                                                    <CodeHighlight json={parseMemo(memo)} />
                                                </MetadataBox>
                                            ) : (
                                                <Typography variant="body2" sx={{ 
                                                    p: 2, 
                                                    background: alpha(theme.palette.action.hover, 0.03),
                                                    borderRadius: 1,
                                                    wordBreak: 'break-word' 
                                                }}>
                                                    {memo}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* Media Files */}
                                    {files && files.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
                                                Media Files {files.some(f => f.isIPFS) && (
                                                    <StyledChip label="IPFS" size="small" sx={{ ml: 1 }} />
                                                )}
                                            </Typography>
                                            <Stack spacing={1}>
                                                {files.map((file) => {
                                                    let cachedHref;
                                                    if (file.isIPFS && file.IPFSPinned) {
                                                        cachedHref = `https://gateway.xrpnft.com/ipfs/${file.IPFSPath}`;
                                                    } else if (!file.isIPFS && file.dfile) {
                                                        cachedHref = `https://s2.xrpnft.com/d1/${file.dfile}`;
                                                    }
                                                    let convertedHref = file.convertedFile ? `https://s2.xrpnft.com/d1/${file.convertedFile}` : null;
                                                    
                                                    return (
                                                        <InfoRow key={file.type}>
                                                            <Typography className="label">{file.type}</Typography>
                                                            <Stack className="value" spacing={0.5}>
                                                                {/^https?:\/\//.test(file.parsedUrl) ? (
                                                                    <Link
                                                                        href={file.parsedUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer noopener nofollow"
                                                                        underline="hover"
                                                                        sx={{ fontSize: '0.75rem', wordBreak: 'break-all' }}
                                                                    >
                                                                        {file.parsedUrl.length > 60 ? 
                                                                            `${file.parsedUrl.substring(0, 40)}...${file.parsedUrl.substring(file.parsedUrl.length - 15)}` : 
                                                                            file.parsedUrl
                                                                        }
                                                                    </Link>
                                                                ) : (
                                                                    <Typography variant="caption">{file.parsedUrl}</Typography>
                                                                )}
                                                                <Stack direction="row" spacing={0.5}>
                                                                    {cachedHref && (
                                                                        <Link
                                                                            href={cachedHref}
                                                                            target="_blank"
                                                                            rel="noreferrer noopener nofollow"
                                                                            underline="hover"
                                                                            sx={{ fontSize: '0.7rem' }}
                                                                        >
                                                                            [Cached]
                                                                        </Link>
                                                                    )}
                                                                    {convertedHref && (
                                                                        <Link
                                                                            href={convertedHref}
                                                                            target="_blank"
                                                                            rel="noreferrer noopener nofollow"
                                                                            underline="hover"
                                                                            sx={{ fontSize: '0.7rem' }}
                                                                        >
                                                                            [Converted]
                                                                        </Link>
                                                                    )}
                                                                </Stack>
                                                            </Stack>
                                                        </InfoRow>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Raw Metadata */}
                                    <Box>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                                Raw Metadata
                                            </Typography>
                                            <Button
                                                size="small"
                                                onClick={() => setShowRawMetadata(!showRawMetadata)}
                                                endIcon={showRawMetadata ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                sx={{ 
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        background: alpha(theme.palette.primary.main, 0.08)
                                                    }
                                                }}
                                            >
                                                {showRawMetadata ? 'Hide' : 'Show'}
                                            </Button>
                                        </Stack>
                                        
                                        <Collapse in={showRawMetadata} timeout="auto" unmountOnExit>
                                            {meta ? (
                                                <MetadataBox>
                                                    <CodeHighlight json={meta} />
                                                </MetadataBox>
                                            ) : (
                                                <Box sx={{ 
                                                    textAlign: 'center', 
                                                    py: 4, 
                                                    background: alpha(theme.palette.action.hover, 0.03),
                                                    borderRadius: 2
                                                }}>
                                                    <InfoOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                                                        No raw metadata available
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Collapse>
                                        
                                        {!showRawMetadata && meta && (
                                            <Box sx={{ 
                                                p: 2, 
                                                background: alpha(theme.palette.action.hover, 0.03),
                                                borderRadius: 1,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                            }}>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    Click "Show" to view the complete metadata JSON
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </SectionCard>
                    </Grid>
                </Grid>
            </Box>
        </GlassPanel>
    );
}