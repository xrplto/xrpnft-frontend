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
import CodeHighlight from 'src/components/CodeHighlight';

// Add these imports at the top of the file
import { alpha, styled } from '@mui/material/styles';
import Glass from '@mui/material/Paper';
import Box from '@mui/material/Box';

// Create styled components for better UI
const GlassPanel = styled(Glass)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`
}));

const InfoRow = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(0.5, 0),
    '& .label': {
        minWidth: '100px',
        color: theme.palette.text.secondary,
        fontSize: '0.8125rem',
        fontWeight: 500
    },
    '& .value': {
        flex: 1,
        color: theme.palette.text.primary,
        wordBreak: 'break-word',
        fontSize: '0.8125rem'
    }
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
    margin: theme.spacing(1.5, 0),
    borderColor: alpha(theme.palette.divider, 0.3)
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
            <Stack spacing={1.5}>
                <NFTPreview nft={nft} />
                <Stack>
                    <Accordion defaultExpanded={!hasProperties}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon color="primary" sx={{ fontSize: 20 }} />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                            sx={{ minHeight: 48, '&.Mui-expanded': { minHeight: 48 } }}
                        >
                            <Stack spacing={1} direction="row" alignItems="center">
                                <DescriptionIcon color="primary" sx={{ fontSize: 20 }} />
                                <Typography variant="body2" color="primary.main" fontWeight={500}>
                                    Description
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ py: 1.5 }}>
                            {meta?.description ? (
                                <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>{meta.description}</Typography>
                            ) : (
                                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.8125rem' }}>
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
                            expandIcon={<ExpandMoreIcon color="primary" sx={{ fontSize: 20 }} />}
                            aria-controls="panel3bh-content"
                            sx={{ minHeight: 48, '&.Mui-expanded': { minHeight: 48 } }}
                        >
                            <Stack spacing={1} direction="row" alignItems="center">
                                <Icon
                                    icon="majesticons:checkbox-list-detail-line"
                                    fontSize={20}
                                    style={{ color: theme.palette.primary.main }}
                                />
                                <Typography variant="body2" color="primary.main" fontWeight={500}>
                                    Properties
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ py: 1.5 }}>
                            {hasProperties ? (
                                <Properties
                                    properties={properties}
                                    total={total}
                                    issuer={issuer}
                                    taxon={taxon}
                                    cslug={cslug}
                                />
                            ) : (
                                <Stack alignItems="center">
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>No Properties</Typography>
                                </Stack>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Stack>
                <Stack>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon color="primary" sx={{ fontSize: 20 }} />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{ minHeight: 48, '&.Mui-expanded': { minHeight: 48 } }}
                        >
                            <Stack spacing={1} direction="row" alignItems="center">
                                <ArticleIcon color="primary" sx={{ fontSize: 20 }} />
                                <Typography variant="body2" color="primary.main" fontWeight={500}>
                                    Details
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ py: 1.5 }}>
                            <Box sx={{ px: 0 }}>
                                {/* Token Information */}
                                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
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
                                        <Typography className="value" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            #{rarity_rank}
                                        </Typography>
                                    </InfoRow>
                                )}
                                
                                <InfoRow>
                                    <Typography className="label">Taxon</Typography>
                                    <Typography className="value">{taxon}</Typography>
                                </InfoRow>
                                
                                <InfoRow>
                                    <Typography className="label">Transfer Fee</Typography>
                                    <Typography className="value">{transferFee}%</Typography>
                                </InfoRow>
                                
                                <InfoRow>
                                    <Typography className="label">Collection</Typography>
                                    <Box className="value">
                                        {cslug ? (
                                            <Link href={`/collection/${cslug}`} underline="hover" color="primary">
                                                {collectionName}
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
                                        <Typography>{fVolume(volume || 0)}</Typography>
                                        <Tooltip title="Traded volume on XRPL">
                                            <Icon icon={infoFilled} fontSize={16} />
                                        </Tooltip>
                                    </Stack>
                                </InfoRow>
                                
                                <SectionDivider />

                                {/* Ownership */}
                                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
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
                                
                                <SectionDivider />

                                {/* Technical Details */}
                                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
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
                                
                                <SectionDivider />

                                {memo && (
                                    <>
                                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                                            Memo
                                        </Typography>
                                        {isValidJSONOrObject(memo) ? (
                                            <Box sx={{ mb: 1 }}>
                                                <Accordion sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                                                        sx={{ minHeight: 40, '&.Mui-expanded': { minHeight: 40 } }}
                                                    >
                                                        <Stack spacing={0.5} direction="row" alignItems="center">
                                                            <Icon icon="mdi:code-json" fontSize={16} />
                                                            <Typography variant="caption">View JSON</Typography>
                                                        </Stack>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Box sx={{ overflowX: 'auto' }}>
                                                            <CodeHighlight json={parseMemo(memo)} />
                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-word' }}>
                                                {memo}
                                            </Typography>
                                        )}
                                        <SectionDivider />
                                    </>
                                )}

                                {/* Media Files */}
                                {files && files.length > 0 && (
                                    <>
                                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                                            Media Files {files.some(f => f.isIPFS) && '(IPFS)'}
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
                                        <SectionDivider />
                                    </>
                                )}

                                {/* Raw Metadata */}
                                <Box>
                                    <Accordion sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                                            sx={{ minHeight: 40, '&.Mui-expanded': { minHeight: 40 } }}
                                        >
                                            <Stack spacing={0.5} direction="row" alignItems="center">
                                                <Icon icon="mdi:code-json" fontSize={16} />
                                                <Typography variant="caption">Raw Metadata</Typography>
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
                                </Box>
                            </Box>
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
