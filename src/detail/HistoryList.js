import axios from 'axios';
import { useState, useEffect, useContext, useRef } from 'react';

// Material
import {
    useTheme,
    Box,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Loader
import { PulseLoader } from "react-spinners";

// Context
import { AppContext } from 'src/AppContext';

// Utils
import { normalizeCurrencyCodeXummImpl } from "src/utils/normalizers";

// Components
import HistoryChart from './HistoryChart';

function truncate(str, n) {
    if (!str) return '';
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

function formatDateTime(timestamp) {
    if (!timestamp && timestamp !== 0) return 'N/A';
    
    // XRP Ledger timestamp is seconds since Jan 1, 2000 00:00 UTC (Ripple epoch)
    // Add 946684800 seconds to convert to Unix timestamp
    const date = new Date((timestamp + 946684800) * 1000);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A';
    
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/New_York',
        timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options);
}

function formatAmount(amount) {
    if (typeof amount === 'string') {
        // XRP amounts are in drops (1 XRP = 1,000,000 drops)
        const xrp = parseFloat(amount) / 1000000;
        return xrp.toFixed(2);
    }
    return parseFloat(amount).toFixed(2);
}

function getTransactionInfo(tx, amount, to) {
    // Check if transaction is from XRP.cafe by SourceTag
    const isXrpCafeTransaction = tx.SourceTag === 101102979;
    
    let type = '';
    let marketplace = 'XRPL'; // Default to XRPL
    
    if (tx.TransactionType === 'NFTokenMint') {
        // Check if minter is XRP.cafe minting service
        const isXrpCafeMint = tx.Account === 'rKqqb5QZXVAL3VqXJL6obfRGeHou1DtyBV' || isXrpCafeTransaction;
        type = 'Mint';
        marketplace = isXrpCafeMint ? 'XRP.cafe' : 'XRPL';
    }
    else if (tx.TransactionType === 'NFTokenBurn') {
        type = 'Burn';
        marketplace = isXrpCafeTransaction ? 'XRP.cafe' : 'XRPL';
    }
    else if (tx.TransactionType === 'NFTokenCreateOffer') {
        // Check if destination is XRP Cafe broker address
        const dest = tx.Destination || to;
        const isXrpCafe = isXrpCafeTransaction || (dest && (
            dest === 'rpx9JThQ2y33xWYfhEUPXrTsQXKdtFycUu' || // XRP Cafe broker
            dest.startsWith('rpx9JThQ2') || // XRP Cafe broker prefix
            dest === 'rXMART8usFd5kABXCayoP6ZfB35b4v43t'    // Alternative broker
        ));
        
        // Check if it's a sell offer (Flags & 1)
        if (tx.Flags & 1) {
            const isZero = tx.Amount === '0' || tx.Amount === 0;
            type = isZero ? 'Transfer' : 'Listing';
            marketplace = isXrpCafe ? 'XRP.cafe' : 'XRPL';
        } else {
            type = 'Buy Offer';
            marketplace = isXrpCafe ? 'XRP.cafe' : 'XRPL';
        }
    }
    else if (tx.TransactionType === 'NFTokenAcceptOffer') {
        // Check if the amount is 0 to determine if it's a transfer
        if (amount) {
            const isZero = (typeof amount === 'string' && amount === '0') || 
                          (typeof amount === 'object' && amount.value === '0');
            type = isZero ? 'Transfer' : 'Sale';
        } else {
            type = 'Sale';
        }
        marketplace = isXrpCafeTransaction ? 'XRP.cafe' : 'XRPL';
    }
    else if (tx.TransactionType === 'NFTokenCancelOffer') {
        type = 'Cancel';
        marketplace = isXrpCafeTransaction ? 'XRP.cafe' : 'XRPL';
    }
    else {
        type = tx.TransactionType;
        marketplace = 'XRPL';
    }
    
    return { type, marketplace };
}

function getTransactionDetails(tx, meta) {
    let amount = null;
    let from = tx.Account;
    let to = null;
    
    // For NFTokenAcceptOffer (Sale/Transfer), look in metadata for details
    if (tx.TransactionType === 'NFTokenAcceptOffer' && meta) {
        const affectedNodes = meta.AffectedNodes || [];
        
        // Find the offer details
        for (const node of affectedNodes) {
            const deleted = node.DeletedNode;
            if (deleted && deleted.FinalFields && deleted.LedgerEntryType === 'NFTokenOffer') {
                amount = deleted.FinalFields.Amount;
                // For sell offers, the owner is the seller (from)
                // For buy offers, the owner is the buyer (to)
                if (deleted.FinalFields.Flags & 1) {
                    // Sell offer - owner is seller
                    from = deleted.FinalFields.Owner;
                    to = tx.Account;
                } else {
                    // Buy offer - owner is buyer
                    from = tx.Account;
                    to = deleted.FinalFields.Owner;
                }
                break;
            }
            const modified = node.ModifiedNode;
            if (modified && modified.FinalFields && modified.LedgerEntryType === 'NFTokenOffer') {
                amount = modified.FinalFields.Amount;
                if (modified.FinalFields.Flags & 1) {
                    from = modified.FinalFields.Owner;
                    to = tx.Account;
                } else {
                    from = tx.Account;
                    to = modified.FinalFields.Owner;
                }
                break;
            }
        }
        
        // Look for the new owner in NFTokenPage changes
        for (const node of affectedNodes) {
            const modified = node.ModifiedNode;
            if (modified && modified.LedgerEntryType === 'NFTokenPage') {
                // The page owner is the new NFT owner after the transaction
                if (modified.FinalFields) {
                    const pageOwner = modified.LedgerIndex?.substring(0, 40);
                    if (pageOwner && pageOwner !== from) {
                        to = to || pageOwner;
                    }
                }
            }
        }
    }
    
    // For NFTokenCreateOffer, use the Amount field directly
    if (tx.TransactionType === 'NFTokenCreateOffer') {
        amount = tx.Amount;
        if (tx.Destination) {
            to = tx.Destination;
        }
    }
    
    // For NFTokenMint
    if (tx.TransactionType === 'NFTokenMint') {
        // Check if it's XRP.cafe mint
        const isXrpCafeMint = tx.Account === 'rKqqb5QZXVAL3VqXJL6obfRGeHou1DtyBV';
        if (isXrpCafeMint) {
            // For XRP.cafe mints, the minting service mints on behalf of the issuer
            // Show XRP.cafe as from and issuer as to
            from = 'rKqqb5QZXVAL3VqXJL6obfRGeHou1DtyBV'; // XRP.cafe Minter
            // The Issuer field contains the actual owner who requested the mint
            to = tx.Issuer || tx.Account;
        } else {
            // Regular mint - minter is both from and to unless destination specified
            from = tx.Account;
            to = tx.Destination || tx.Account;
        }
    }
    
    return { amount, from, to };
}

export default function HistoryList({ nft }) {
    const theme = useTheme();
    const CLIO_URL = 'wss://s1.ripple.com:51233';
    const { accountProfile, sync } = useContext(AppContext);
    const [hists, setHists] = useState([]);
    const [allHistory, setAllHistory] = useState([]); // Store complete history for chart
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [marker, setMarker] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingChart, setLoadingChart] = useState(false);
    const containerRef = useRef(null);

    // Fetch all history for chart visualization
    const fetchAllHistory = async () => {
        setLoadingChart(true);
        let allTransactions = [];
        let currentMarker = null;
        let hasMoreData = true;
        
        try {
            while (hasMoreData) {
                const ws = new WebSocket(CLIO_URL);
                
                await new Promise((resolve) => {
                    ws.onopen = resolve;
                });

                const request = {
                    id: 1,
                    command: "nft_history",
                    nft_id: nft.NFTokenID,
                    limit: 400 // Fetch more at once for chart
                };
                
                if (currentMarker) {
                    request.marker = currentMarker;
                }

                ws.send(JSON.stringify(request));

                const response = await new Promise((resolve, reject) => {
                    ws.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        if (data.status === 'error') {
                            reject(new Error(data.error_message || 'Failed to fetch history'));
                        } else {
                            resolve(data);
                        }
                        ws.close();
                    };
                    ws.onerror = reject;
                });

                if (response.result && response.result.transactions) {
                    const transactions = response.result.transactions.map(t => {
                        const details = getTransactionDetails(t.tx, t.meta);
                        const info = getTransactionInfo(t.tx, details.amount, details.to);
                        return {
                            type: info.type,
                            marketplace: info.marketplace,
                            from: details.from,
                            to: details.to,
                            amount: details.amount,
                            hash: t.tx.hash,
                            date: t.date || t.tx.date,
                            ledger: t.ledger_index
                        };
                    });
                    
                    allTransactions = [...allTransactions, ...transactions];
                    
                    // Check if there's more data
                    if (response.result.marker) {
                        currentMarker = response.result.marker;
                    } else {
                        hasMoreData = false;
                    }
                    
                    // Limit to prevent infinite loops (max 2000 transactions)
                    if (allTransactions.length >= 2000) {
                        hasMoreData = false;
                    }
                }
            }
            
            setAllHistory(allTransactions);
        } catch (err) {
            console.error("Error fetching complete NFT history:", err);
            // Fall back to using partial history
            setAllHistory(hists);
        } finally {
            setLoadingChart(false);
        }
    };

    const fetchHistory = async (isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        
        try {
            const ws = new WebSocket(CLIO_URL);
            
            await new Promise((resolve) => {
                ws.onopen = resolve;
            });

            const request = {
                id: 1,
                command: "nft_history",
                nft_id: nft.NFTokenID,
                limit: 50
            };
            
            if (isLoadMore && marker) {
                request.marker = marker;
            }

            ws.send(JSON.stringify(request));

            const response = await new Promise((resolve, reject) => {
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.status === 'error') {
                        reject(new Error(data.error_message || 'Failed to fetch history'));
                    } else {
                        resolve(data);
                    }
                    ws.close();
                };
                ws.onerror = reject;
            });

            if (response.result && response.result.transactions) {
                const transactions = response.result.transactions.map(t => {
                    const details = getTransactionDetails(t.tx, t.meta);
                    const info = getTransactionInfo(t.tx, details.amount, details.to);
                    return {
                        type: info.type,
                        marketplace: info.marketplace,
                        from: details.from,
                        to: details.to,
                        amount: details.amount,
                        hash: t.tx.hash,
                        date: t.date || t.tx.date,
                        ledger: t.ledger_index
                    };
                });
                
                if (isLoadMore) {
                    setHists(prev => [...prev, ...transactions]);
                } else {
                    setHists(transactions);
                }
                
                // Set marker for next page
                if (response.result.marker) {
                    setMarker(response.result.marker);
                    setHasMore(true);
                } else {
                    setMarker(null);
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Error fetching NFT history:", err);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (nft.NFTokenID) {
            fetchHistory(false);
            fetchAllHistory(); // Fetch complete history for chart
        }
    }, [nft.NFTokenID, sync]);

    // Handle scroll for infinite loading
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || loadingMore || !hasMore) return;
            
            const container = containerRef.current;
            const scrollHeight = container.scrollHeight;
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            
            // Load more when user is near bottom (within 100px)
            if (scrollHeight - scrollTop - clientHeight < 100) {
                fetchHistory(true);
            }
        };
        
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [loadingMore, hasMore, marker]);

    return (
        <>
            {loading ? (
                <Stack alignItems="center" mt={1}>
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ) : (
                <Stack mt={1} spacing={2}>
                    {/* Chart visualization */}
                    {loadingChart ? (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 4,
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`
                        }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                Loading complete history for charts...
                            </Typography>
                            <PulseLoader color='#00AB55' size={8} />
                        </Box>
                    ) : (allHistory.length > 0 && (
                        <Box>
                            <HistoryChart history={allHistory} />
                            {allHistory.length > hists.length && (
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                                >
                                    Chart shows all {allHistory.length} transactions • Table shows {hists.length}
                                </Typography>
                            )}
                        </Box>
                    ))}
                    
                    {/* History table */}
                    <Box
                        ref={containerRef}
                        sx={{
                            width: "100%",
                            maxHeight: "600px",
                            overflowY: "auto",
                            overflowX: "hidden",
                            "::-webkit-scrollbar": { width: "8px" },
                            "::-webkit-scrollbar-track": { background: "#1a1a1a" },
                            "::-webkit-scrollbar-thumb": { 
                                background: "#444",
                                borderRadius: "4px",
                                "&:hover": { background: "#555" }
                            },
                        }}
                    >
                        <Table size="small" sx={{
                            [`& .${tableCellClasses.root}`]: {
                                borderBottom: "0px solid",
                                borderColor: theme.palette.divider,
                                padding: '4px 8px',
                            },
                            minWidth: "100%",
                        }}>
                            <TableBody>
                                {hists && hists.map((row, idx) => (
                                    <TableRow 
                                        key={row.hash || idx}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <TableCell align="left" width='12%'>
                                            <Typography 
                                                variant='caption' 
                                                noWrap
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                    color: row.type === 'Listing' ? '#ef4444' :
                                                           row.type === 'Sale' ? '#10b981' :
                                                           row.type === 'Buy Offer' ? '#3b82f6' :
                                                           row.type === 'Transfer' ? '#f59e0b' :
                                                           row.type === 'Cancel' ? '#6b7280' :
                                                           row.type === 'Mint' ? '#8b5cf6' : 'inherit',
                                                    opacity: 0.9
                                                }}
                                            >
                                                {row.type}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left" width='10%'>
                                            <Typography 
                                                variant='caption' 
                                                noWrap
                                                sx={{ 
                                                    fontSize: '0.7rem',
                                                    fontWeight: row.marketplace === 'XRP.cafe' ? 600 : 500,
                                                    color: row.marketplace === 'XRP.cafe' ? 'primary.main' : 'text.secondary'
                                                }}
                                            >
                                                {row.marketplace}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left" width='18%'>
                                            {row.from && (
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <Typography variant='caption' sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>From:</Typography>
                                                    <Link href={`/account/${row.from}`}>
                                                        <Typography variant='caption' noWrap>{truncate(row.from, 10)}</Typography>
                                                    </Link>
                                                </Stack>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" width='18%'>
                                            {row.to ? (
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <Typography variant='caption' sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>To:</Typography>
                                                    <Link href={`/account/${row.to}`}>
                                                        <Typography variant='caption' noWrap>{truncate(row.to, 10)}</Typography>
                                                    </Link>
                                                </Stack>
                                            ) : (
                                                <Typography variant='caption' noWrap sx={{ color: 'text.secondary' }}>- - -</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" width='15%'>
                                            {row.amount ? (
                                                typeof row.amount === 'string' ? (
                                                    <Typography variant='caption' noWrap>{formatAmount(row.amount)} XRP</Typography>
                                                ) : (
                                                    <Typography variant='caption' noWrap>
                                                        {formatAmount(row.amount.value)} {normalizeCurrencyCodeXummImpl(row.amount.currency)}
                                                    </Typography>
                                                )
                                            ) : (
                                                <Typography variant='caption' noWrap>- - -</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" width='20%'>
                                            <Typography variant='caption' noWrap>{formatDateTime(row.date)}</Typography>
                                        </TableCell>
                                        <TableCell align="center" width='5%'>
                                            {row.hash ? (
                                                <Tooltip title="View on Bithomp" arrow placement="top">
                                                    <IconButton 
                                                        size="small"
                                                        component="a"
                                                        href={`https://bithomp.com/explorer/${row.hash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ 
                                                            padding: 0.25,
                                                            color: 'text.secondary',
                                                            '&:hover': {
                                                                color: 'primary.main'
                                                            }
                                                        }}
                                                    >
                                                        <OpenInNewIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Box sx={{ width: 22, height: 22 }} />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {loadingMore && (
                            <Stack alignItems="center" py={2}>
                                <PulseLoader color='#00AB55' size={8} />
                            </Stack>
                        )}
                        {!hasMore && hists.length > 0 && (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    display: 'block',
                                    textAlign: 'center',
                                    py: 2,
                                    color: 'text.secondary'
                                }}
                            >
                                No more transactions
                            </Typography>
                        )}
                    </Box>
                </Stack>
            )}
        </>
    );
}
