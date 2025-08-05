import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useContext, useState } from 'react';
import { AppContext } from 'src/AppContext';
import { fVolume } from 'src/utils/formatNumber';
import { convertHexToString, parseNFTokenID } from 'src/utils/parse';
import NFTPreview from './NFTPreview';
import FlagsContainer from 'src/components/Flags';
import Properties from './Properties';
import CodeHighlight from 'src/components/CodeHighlight';
import { Icon } from '@iconify/react';
import {
    Box, Typography, Link, Stack, Chip, IconButton, Tooltip,
    Avatar, Collapse, Button, alpha, styled
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Minimalist styled components
const Container = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden'
}));

const Section = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    '&:last-child': { borderBottom: 'none' }
}));

const InfoRow = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(0.75, 0),
    '& .label': {
        minWidth: '100px',
        color: theme.palette.text.secondary,
        fontSize: '0.8125rem'
    },
    '& .value': {
        flex: 1,
        color: theme.palette.text.primary,
        fontSize: '0.8125rem'
    }
}));

const CompactLink = styled(Link)(({ theme }) => ({
    fontSize: '0.8125rem',
    fontFamily: 'monospace',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' }
}));

const MetadataBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.default, 0.3),
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    maxHeight: '300px',
    overflowY: 'auto',
    fontSize: '0.75rem'
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
    const { openSnackbar } = useContext(AppContext);
    const [showRawMetadata, setShowRawMetadata] = useState(false);
    const [showMemo, setShowMemo] = useState(false);

    const {
        hash, collection, account, date, meta, cslug, NFTokenID,
        props, total, volume, rarity_rank, files, memo, taxon: apiTaxon
    } = nft;

    const { flag, issuer, transferFee } = parseNFTokenID(NFTokenID);
    const taxon = apiTaxon;
    const strDateTime = date ? new Date(date).toLocaleString() : '';
    const collectionName = collection || '[No Collection]';
    const properties = props || getProperties(meta);
    const hasProperties = properties && properties.length > 0;

    const formatAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    
    const isValidJSON = (input) => {
        try {
            if (typeof input === 'object') return true;
            if (typeof input === 'string') {
                JSON.parse(input);
                return true;
            }
        } catch (e) {}
        return false;
    };

    const parseMemo = (memo) => {
        if (typeof memo === 'object') return JSON.stringify(memo, null, 2);
        if (typeof memo === 'string') {
            try {
                return JSON.stringify(JSON.parse(memo), null, 2);
            } catch (e) {
                return memo;
            }
        }
        return String(memo);
    };

    return (
        <Container>
            <Box sx={{ mb: 2 }}>
                <NFTPreview nft={nft} />
            </Box>

            {/* Description */}
            {meta?.description && (
                <Section>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                        {meta.description}
                    </Typography>
                </Section>
            )}

            {/* Properties */}
            {hasProperties && (
                <Section>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Properties
                    </Typography>
                    <Properties
                        properties={properties}
                        total={total}
                        issuer={issuer}
                        taxon={taxon}
                        cslug={cslug}
                    />
                </Section>
            )}

            {/* Core Details */}
            <Section>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Details
                </Typography>
                
                <Stack spacing={1}>
                    <InfoRow>
                        <Typography className="label">Created</Typography>
                        <Typography className="value">{strDateTime}</Typography>
                    </InfoRow>
                    
                    <InfoRow>
                        <Typography className="label">Collection</Typography>
                        <Box className="value">
                            {cslug ? (
                                <CompactLink href={`/collection/${cslug}`}>
                                    {collectionName} →
                                </CompactLink>
                            ) : (
                                <Typography variant="body2" fontSize="0.8125rem">{collectionName}</Typography>
                            )}
                        </Box>
                    </InfoRow>
                    
                    <InfoRow>
                        <Typography className="label">Volume</Typography>
                        <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                            <Icon icon="teenyicons:ripple-solid" fontSize={14} />
                            <Typography fontSize="0.8125rem">{fVolume(volume || 0)}</Typography>
                        </Stack>
                    </InfoRow>
                    
                    {rarity_rank > 0 && (
                        <InfoRow>
                            <Typography className="label">Rarity Rank</Typography>
                            <Chip label={`#${rarity_rank}`} size="small" color="primary" />
                        </InfoRow>
                    )}
                    
                    <InfoRow>
                        <Typography className="label">Transfer Fee</Typography>
                        <Typography className="value">{transferFee}%</Typography>
                    </InfoRow>
                    
                    <InfoRow>
                        <Typography className="label">Flags</Typography>
                        <Box className="value">
                            <FlagsContainer Flags={flag} />
                        </Box>
                    </InfoRow>
                </Stack>
            </Section>

            {/* Ownership */}
            <Section>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Ownership
                </Typography>
                
                <Stack spacing={1}>
                    <InfoRow>
                        <Typography className="label">Owner</Typography>
                        <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                            <CompactLink href={`/account/${account}`}>
                                {formatAddress(account)}
                            </CompactLink>
                            <CopyToClipboard text={account} onCopy={() => openSnackbar('Copied!', 'success')}>
                                <IconButton size="small" sx={{ p: 0.25 }}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </CopyToClipboard>
                        </Stack>
                    </InfoRow>
                    
                    <InfoRow>
                        <Typography className="label">Issuer</Typography>
                        <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                            <CompactLink href={`/account/${issuer}`}>
                                {formatAddress(issuer)}
                            </CompactLink>
                            <CopyToClipboard text={issuer} onCopy={() => openSnackbar('Copied!', 'success')}>
                                <IconButton size="small" sx={{ p: 0.25 }}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </CopyToClipboard>
                        </Stack>
                    </InfoRow>
                </Stack>
            </Section>

            {/* Technical */}
            <Section>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Technical
                </Typography>
                
                <Stack spacing={1}>
                    <InfoRow>
                        <Typography className="label">NFTokenID</Typography>
                        <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                            <CompactLink 
                                href={`https://bithomp.com/explorer/${NFTokenID}`}
                                target="_blank"
                                rel="noreferrer noopener nofollow"
                            >
                                {formatAddress(NFTokenID)}
                            </CompactLink>
                            <CopyToClipboard text={NFTokenID} onCopy={() => openSnackbar('Copied!', 'success')}>
                                <IconButton size="small" sx={{ p: 0.25 }}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </CopyToClipboard>
                        </Stack>
                    </InfoRow>
                    
                    <InfoRow>
                        <Typography className="label">Transaction</Typography>
                        <Stack className="value" direction="row" spacing={0.5} alignItems="center">
                            <CompactLink 
                                href={`https://bithomp.com/explorer/${hash}`}
                                target="_blank"
                                rel="noreferrer noopener nofollow"
                            >
                                {formatAddress(hash)}
                            </CompactLink>
                            <CopyToClipboard text={hash} onCopy={() => openSnackbar('Copied!', 'success')}>
                                <IconButton size="small" sx={{ p: 0.25 }}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </CopyToClipboard>
                        </Stack>
                    </InfoRow>
                    
                    <InfoRow>
                        <Typography className="label">Taxon</Typography>
                        <Typography className="value">{taxon}</Typography>
                    </InfoRow>
                </Stack>
            </Section>

            {/* Memo */}
            {memo && (
                <Section>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            Memo
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => setShowMemo(!showMemo)}
                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                        >
                            {showMemo ? 'Hide' : 'Show'}
                        </Button>
                    </Stack>
                    <Collapse in={showMemo}>
                        {isValidJSON(memo) ? (
                            <MetadataBox>
                                <CodeHighlight json={parseMemo(memo)} />
                            </MetadataBox>
                        ) : (
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                {memo}
                            </Typography>
                        )}
                    </Collapse>
                </Section>
            )}

            {/* Media Files */}
            {files && files.length > 0 && (
                <Section>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Media Files
                    </Typography>
                    <Stack spacing={0.5}>
                        {files.map((file) => (
                            <InfoRow key={file.type}>
                                <Typography className="label" fontSize="0.75rem">{file.type}</Typography>
                                <Stack className="value" spacing={0.25}>
                                    {/^https?:\/\//.test(file.parsedUrl) && (
                                        <CompactLink
                                            href={file.parsedUrl}
                                            target="_blank"
                                            rel="noreferrer noopener nofollow"
                                            sx={{ fontSize: '0.75rem' }}
                                        >
                                            {file.parsedUrl.length > 40 ? 
                                                `${file.parsedUrl.substring(0, 30)}...` : 
                                                file.parsedUrl
                                            }
                                        </CompactLink>
                                    )}
                                </Stack>
                            </InfoRow>
                        ))}
                    </Stack>
                </Section>
            )}

            {/* Raw Metadata */}
            <Section>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Raw Metadata
                    </Typography>
                    <Button
                        size="small"
                        onClick={() => setShowRawMetadata(!showRawMetadata)}
                        endIcon={showRawMetadata ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    >
                        {showRawMetadata ? 'Hide' : 'Show'}
                    </Button>
                </Stack>
                
                <Collapse in={showRawMetadata}>
                    {meta && (
                        <MetadataBox>
                            <CodeHighlight json={meta} />
                        </MetadataBox>
                    )}
                </Collapse>
            </Section>
        </Container>
    );
}