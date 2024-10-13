import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';

const BASE_URL = 'https://api.xrpnft.com/api';

export default function NFTHistorySearch() {
    const [searchValue, setSearchValue] = useState('');
    const [searchType, setSearchType] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const nftRegex = /^000[0-9A-F]{61}$/i;
        const accountRegex = /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/;
        const hashRegex = /^[0-9A-F]{64}$/i;

        if (nftRegex.test(searchValue)) {
            setSearchType('nft');
        } else if (accountRegex.test(searchValue)) {
            setSearchType('account');
        } else if (hashRegex.test(searchValue)) {
            setSearchType('hash');
        } else {
            setSearchType('');
        }
    }, [searchValue]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchType) {
            setError('Invalid input format. Please enter a valid NFToken ID, Account Address, or Transaction Hash.');
            return;
        }

        setIsLoading(true);
        setResults(null);
        setError('');

        try {
            let url = `${BASE_URL}/history?`;

            if (searchType === 'nft') {
                url += `NFTokenID=${searchValue}`;
            } else if (searchType === 'account') {
                url += `account=${searchValue}`;
            } else if (searchType === 'hash') {
                url += `hash=${searchValue}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setResults(data);
            } else {
                setError(data.message || 'Unknown error occurred');
            }
        } catch (error) {
            setError(error.message || 'Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setResults(null);
        setError('');
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                XRP NFT History Search
            </Typography>
            <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
                <TextField
                    label="Enter NFToken ID, Account Address, or Transaction Hash"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading || !searchType}
                    sx={{ mr: 2 }}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                    disabled={isLoading}
                >
                    Clear
                </Button>
            </Box>
            {searchType && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Detected input type: {
                        searchType === 'nft' ? 'NFToken ID' : 
                        searchType === 'account' ? 'Account Address' : 
                        'Transaction Hash'
                    }
                </Typography>
            )}
            {isLoading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}
            {results && (
                <Paper elevation={3} sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
                    <Typography component="pre" sx={{ 
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,.2)',
                            borderRadius: '4px',
                        },
                    }}>
                        {JSON.stringify(results, null, 2)}
                    </Typography>
                </Paper>
            )}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}
