import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Divider, useTheme, Card, CardContent, Chip, TextField, Button, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import Layout from '../src/components/Layout';
import CodeHighlight from '../src/components/CodeHighlight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tooltip } from '@mui/material';

const ApiDocs = () => {
  const theme = useTheme();
  const [queryParams, setQueryParams] = useState({
    orderBy: 'volume',
    order: 'desc',
    limit: '20',
    page: '0',
    filter: '',
    category: '',
    choice: '',
    compact: false
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [nftTokenId, setNftTokenId] = useState('00080BB86C429EE66CE731CAA492445DFF564F9CB8A46A301FEE968805A83EEE');
  const [nftResponse, setNftResponse] = useState(null);
  const [nftLoading, setNftLoading] = useState(false);
  const [nftModalOpen, setNftModalOpen] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const buildQueryUrl = () => {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && key !== 'compact') params.append(key, value);
      if (key === 'compact' && value === true) params.append(key, 'true');
    });
    return `https://api.xrpnft.com/api/collections${params.toString() ? '?' + params.toString() : ''}`;
  };

  const executeQuery = async () => {
    console.log('=== Execute Query Debug ===');
    console.log('Query Parameters:', queryParams);
    
    setLoading(true);
    try {
      const url = buildQueryUrl();
      console.log('Request URL:', url);
      console.log('Fetching with CORS mode...');
      
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      console.log('First collection:', data.collections?.[0]);
      console.log('Setting response and opening modal...');
      
      setResponse(data);
      setModalOpen(true);
      console.log('Modal open state:', true);
      console.log('Response state:', data);
    } catch (error) {
      console.error('Error occurred:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      setResponse({ 
        error: error.message,
        note: 'If you see a CORS error, try using a browser extension like "CORS Unblock" or "Allow CORS" to test the API.'
      });
      setModalOpen(true);
    }
    setLoading(false);
    console.log('=== End Execute Query Debug ===');
  };

  const executeNftQuery = async () => {
    console.log('=== Execute NFT Query Debug ===');
    console.log('NFTokenID:', nftTokenId);
    
    setNftLoading(true);
    try {
      const url = `https://api.xrpnft.com/api/nft/${nftTokenId}`;
      console.log('Request URL:', url);
      
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('NFT Response data:', data);
      
      setNftResponse(data);
      setNftModalOpen(true);
    } catch (error) {
      console.error('Error occurred:', error);
      
      setNftResponse({ 
        error: error.message,
        note: 'If you see a CORS error, try using a browser extension like "CORS Unblock" or "Allow CORS" to test the API.'
      });
      setNftModalOpen(true);
    }
    setNftLoading(false);
    console.log('=== End NFT Query Debug ===');
  };

  const queryExamples = [
    {
      title: 'Basic Queries',
      examples: [
        {
          description: 'Default query (20 items, sorted by volume descending)',
          code: 'curl https://api.xrpnft.com/api/collections',
          note: 'Volume refers to the total trading volume at xrpnft.com NFT marketplace'
        },
        {
          description: 'Pagination',
          code: `curl https://api.xrpnft.com/api/collections?page=0&limit=20
curl https://api.xrpnft.com/api/collections?page=2&limit=50`
        }
      ]
    },
    {
      title: 'Sorting Options (orderBy parameter)',
      examples: [
        {
          description: 'By total volume (all-time)',
          code: 'curl https://api.xrpnft.com/api/collections?orderBy=totalVolume&order=desc'
        },
        {
          description: 'By 24-hour volume',
          code: `curl https://api.xrpnft.com/api/collections?orderBy=totalVol24h&order=desc
curl https://api.xrpnft.com/api/collections?orderBy=vol24h&order=desc`
        },
        {
          description: 'By floor price',
          code: `curl https://api.xrpnft.com/api/collections?orderBy=floor&order=asc
curl https://api.xrpnft.com/api/collections?orderBy=floor&order=desc`
        },
        {
          description: 'By number of items',
          code: 'curl https://api.xrpnft.com/api/collections?orderBy=items&order=desc'
        },
        {
          description: 'By number of owners',
          code: 'curl https://api.xrpnft.com/api/collections?orderBy=owners&order=desc'
        },
        {
          description: 'By creation date',
          code: 'curl https://api.xrpnft.com/api/collections?orderBy=created&order=desc'
        },
        {
          description: 'By modification date',
          code: 'curl https://api.xrpnft.com/api/collections?orderBy=modified&order=desc'
        },
        {
          description: 'By name (alphabetical)',
          code: 'curl https://api.xrpnft.com/api/collections?orderBy=name&order=asc'
        }
      ]
    },
    {
      title: 'Filtering Options',
      examples: [
        {
          description: 'Text search filter',
          code: `curl https://api.xrpnft.com/api/collections?filter=punk
curl https://api.xrpnft.com/api/collections?filter=lovakittys`
        },
        {
          description: 'Category filter',
          code: `curl https://api.xrpnft.com/api/collections?category=art
curl https://api.xrpnft.com/api/collections?category=gaming`
        },
        {
          description: 'Choice filter (verified collections only)',
          code: 'curl https://api.xrpnft.com/api/collections?choice=verified'
        },
        {
          description: 'Compact mode (exclude metadata fields)',
          code: 'curl https://api.xrpnft.com/api/collections?limit=20&compact=true',
          note: 'Excludes: featuredImage, bannerImage, spinnerImage, minterName, costs, description, attrs, nometa, rarity, category, type'
        }
      ]
    },
    {
      title: 'Combined Queries',
      examples: [
        {
          description: 'Top verified collections by 24h volume',
          code: 'curl https://api.xrpnft.com/api/collections?choice=verified&orderBy=totalVol24h&order=desc&limit=10'
        },
        {
          description: 'Search for "kitty" sorted by total volume',
          code: 'curl https://api.xrpnft.com/api/collections?filter=kitty&orderBy=totalVolume&order=desc'
        },
        {
          description: 'Art category sorted by floor price (lowest first)',
          code: 'curl https://api.xrpnft.com/api/collections?category=art&orderBy=floor&order=asc&page=0&limit=30'
        },
        {
          description: 'All collections sorted by 24h volume with pagination',
          code: 'curl https://api.xrpnft.com/api/collections?orderBy=vol24h&order=desc&page=1&limit=50'
        }
      ]
    }
  ];

  const availableFields = [
    { field: 'volume', description: 'Total all-time volume (default)' },
    { field: 'totalVolume', description: 'Total all-time volume' },
    { field: 'totalVol24h', description: '24-hour volume' },
    { field: 'vol24h', description: '24-hour volume (alternative)' },
    { field: 'floor', description: 'Floor price' },
    { field: 'items', description: 'Number of NFTs in collection' },
    { field: 'owners', description: 'Number of unique owners' },
    { field: 'created', description: 'Creation timestamp' },
    { field: 'modified', description: 'Last modification timestamp' },
    { field: 'name', description: 'Alphabetical by collection name' }
  ];

  const sampleResponse = {
    result: "success",
    took: "72.22",
    count: 6199,
    collections: [
      {
        _id: "33920d4b2f0346fba52ece9f05c54f5f",
        account: "rw1R8cfHGMySmbj7gJ1HkiCqTY1xhLGYAs",
        name: "Fuzzybears",
        category: null,
        slug: "fuzzybears",
        type: "normal",
        items: 3210,
        owners: 639,
        private: "no",
        verified: "no",
        imported: "yes",
        logoImage: "1754245929256_e702449529933a912d6e667d311d9d5a.webp",
        featuredImage: null,
        bannerImage: null,
        description: "Original Fuzzybears on the XRP Ledger.",
        created: 1742534930000,
        modified: 1754245929258,
        taxon: null,
        rarity: "score",
        uuid: "33920d4b2f0346fba52ece9f05c54f5f",
        totalVolume: 1396995.618278,
        totalVol24h: 2956.29795,
        vol24h: 0,
        floor: {
          issuer: "XRPL",
          currency: "XRP",
          amount: 284
        },
        attrs: [
          {
            title: "Background",
            items: {
              "XRPL Blue-Purple": { count: 357 },
              "XRPL Grey": { count: 407 },
              "XRPL Red-Purple": { count: 404 }
            }
          },
          {
            title: "Fur",
            items: {
              "Polar": { count: 356 },
              "Brown": { count: 1311 },
              "Honey": { count: 251 }
            }
          }
        ]
      }
    ]
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          XRPNFT API Documentation
        </Typography>
        
        <Box sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main', 
          color: 'white',
          p: 3,
          borderRadius: 2,
          mb: 4
        }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ mr: 2 }}>📚</Box>
            /api/collections
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Query and filter NFT collections
          </Typography>
        </Box>
        
        <Card elevation={1} sx={{ mb: 4, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Query Builder</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Order By</InputLabel>
                <Select
                  value={queryParams.orderBy}
                  label="Order By"
                  onChange={(e) => setQueryParams({...queryParams, orderBy: e.target.value})}
                >
                  <MenuItem value="volume">Volume</MenuItem>
                  <MenuItem value="totalVolume">Total Volume</MenuItem>
                  <MenuItem value="totalVol24h">24h Volume</MenuItem>
                  <MenuItem value="floor">Floor Price</MenuItem>
                  <MenuItem value="items">Items</MenuItem>
                  <MenuItem value="owners">Owners</MenuItem>
                  <MenuItem value="created">Created</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={queryParams.order}
                  label="Order"
                  onChange={(e) => setQueryParams({...queryParams, order: e.target.value})}
                >
                  <MenuItem value="desc">Descending</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Limit"
                type="number"
                value={queryParams.limit}
                onChange={(e) => setQueryParams({...queryParams, limit: e.target.value})}
              />
              
              <TextField
                label="Page"
                type="number"
                value={queryParams.page}
                onChange={(e) => setQueryParams({...queryParams, page: e.target.value})}
              />
              
              <TextField
                label="Filter (search)"
                value={queryParams.filter}
                onChange={(e) => setQueryParams({...queryParams, filter: e.target.value})}
              />
              
              <TextField
                label="Category"
                value={queryParams.category}
                onChange={(e) => setQueryParams({...queryParams, category: e.target.value})}
              />
              
              <FormControl fullWidth>
                <InputLabel>Choice</InputLabel>
                <Select
                  value={queryParams.choice}
                  label="Choice"
                  onChange={(e) => setQueryParams({...queryParams, choice: e.target.value})}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="verified">Verified Only</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={queryParams.compact}
                  onChange={(e) => setQueryParams({...queryParams, compact: e.target.checked})}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Compact Mode</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Exclude metadata fields for improved performance
                  </Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ 
              p: 2, 
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              borderRadius: 1,
              mb: 2,
              wordBreak: 'break-all'
            }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.mode === 'dark' ? '#4fc3f7' : '#1976d2' }}>
                {buildQueryUrl()}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              onClick={executeQuery}
              disabled={loading}
              fullWidth
            >
              Execute Query
            </Button>
          </CardContent>
        </Card>

        <Box sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'warning.dark' : 'warning.light',
          p: 2,
          borderRadius: 1,
          mb: 3
        }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            💡 Performance Tip: Compact Mode
          </Typography>
          <Typography variant="body2">
            Add <code style={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>?compact=true</code> to exclude metadata fields and improve response time when displaying table data.
          </Typography>
        </Box>

        <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
          Query Examples
        </Typography>

        {queryExamples.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 4 }}>
            <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
              {section.title}
            </Typography>
            {section.examples.map((example, exampleIndex) => (
              <Card 
                key={exampleIndex} 
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper'
                }}
              >
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {example.description}
                  </Typography>
                  {example.note && (
                    <Box sx={{ 
                      mb: 2, 
                      p: 1.5, 
                      bgcolor: theme.palette.mode === 'dark' ? 'info.dark' : 'info.light',
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#0288d1' : '#1976d2'}`
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#fff' : 'info.dark',
                        fontStyle: 'italic'
                      }}>
                        Note: {example.note}
                      </Typography>
                    </Box>
                  )}
                  <Box 
                    sx={{ 
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#ddd'}`,
                      borderRadius: 1,
                      p: 2,
                      position: 'relative',
                      overflow: 'auto'
                    }}
                  >
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(example.code)}
                        sx={{ 
                          position: 'absolute', 
                          right: 8, 
                          top: 8,
                          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
                          }
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <pre style={{ 
                      margin: 0, 
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                    }}>
                      {example.code.split('\n').map((line, idx) => (
                        <div key={idx} style={{ minHeight: '20px' }}>
                          {line.includes('https://') ? (
                            <span style={{ 
                              color: theme.palette.mode === 'dark' ? '#4fc3f7' : '#1976d2',
                              fontWeight: 500
                            }}>
                              {line}
                            </span>
                          ) : (
                            line
                          )}
                        </div>
                      ))}
                    </pre>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ))}

        <Box sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'secondary.dark' : 'secondary.main', 
          color: 'white',
          p: 3,
          borderRadius: 2,
          mb: 4,
          mt: 6
        }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ mr: 2 }}>🖼️</Box>
            /api/nft
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Get detailed information about a specific NFT
          </Typography>
        </Box>
        
        <Card elevation={1} sx={{ mb: 4, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Query Builder</Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Retrieves detailed information about a specific NFT by its token ID.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="NFTokenID"
                placeholder="00080BB86C429EE66CE731CAA492445DFF564F9CB8A46A301FEE968805A83EEE"
                value={nftTokenId}
                onChange={(e) => setNftTokenId(e.target.value)}
                sx={{ mb: 2 }}
                helperText="Example: 00080BB86C429EE66CE731CAA492445DFF564F9CB8A46A301FEE968805A83EEE"
              />
              
              <Box sx={{ 
                p: 2, 
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                borderRadius: 1,
                mb: 2,
                wordBreak: 'break-all'
              }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.mode === 'dark' ? '#4fc3f7' : '#1976d2' }}>
                  GET https://api.xrpnft.com/api/nft/{nftTokenId || '{NFTokenID}'}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                startIcon={nftLoading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                onClick={executeNftQuery}
                disabled={nftLoading || !nftTokenId}
                fullWidth
              >
                Execute NFT Query
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              Response Structure:
            </Typography>
            <Box sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#ddd'}`,
              borderRadius: 1,
              p: 2,
              overflow: 'auto'
            }}>
              <CodeHighlight json={{
                res: "success",
                took: "12.34",
                nft: {
                  cid: "collection_id",
                  self: true,
                  status: 1,
                  cslug: "collection-slug",
                  collection: "Collection Name",
                  cverified: "yes",
                  cfloor: { currency: "XRP", amount: 10 },
                  citems: 100,
                  costs: "{ /* collection costs object */ }"
                }
              }} />
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              <strong>Notes:</strong><br />
              • Collection data is only appended if nft.self is true<br />
              • Bulk mint costs are included when NFT status equals NFToken.SELL_WITH_MINT_BULK<br />
              • Response includes performance metric (took) in milliseconds
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Available orderBy Fields for Collections
          </Typography>
          <Card elevation={1} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            {availableFields.map((field, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 1.5, 
                  p: 1.5, 
                  borderRadius: 1,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Chip 
                  label={field.field} 
                  size="small"
                  sx={{ 
                    fontFamily: 'monospace',
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    mr: 2
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {field.description}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
        </Box>

        <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
          Sample Query & Response
        </Typography>
        <Card elevation={1} sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              Sample query:
            </Typography>
            <Box 
              sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                border: `2px solid ${theme.palette.mode === 'dark' ? '#4fc3f7' : '#1976d2'}`,
                borderRadius: 1,
                p: 2,
                position: 'relative'
              }}
            >
              <Tooltip title="Copy to clipboard">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard("https://api.xrpnft.com/api/collections?orderBy=totalVol24h&order=desc")}
                  sx={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: 8,
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
                    }
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography 
                sx={{ 
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: theme.palette.mode === 'dark' ? '#4fc3f7' : '#1976d2',
                  fontWeight: 600,
                  wordBreak: 'break-all'
                }}
              >
                https://api.xrpnft.com/api/collections?orderBy=totalVol24h&order=desc
              </Typography>
            </Box>
          </CardContent>
        </Card>
        
        <Card elevation={1} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              Response:
            </Typography>
            <Box 
              sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#ddd'}`,
                borderRadius: 1,
                p: 2,
                overflow: 'auto',
                maxHeight: '600px'
              }}
            >
              <CodeHighlight json={sampleResponse} />
            </Box>
          </CardContent>
        </Card>
        
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            API Response
            <Box>
              {response && !response.error && (
                <Tooltip title="Copy response">
                  <IconButton 
                    onClick={() => {
                      copyToClipboard(JSON.stringify(response, null, 2));
                      console.log('Response copied to clipboard');
                    }}
                    sx={{ mr: 1 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton onClick={() => setModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '70vh'
            }}>
              {response ? (
                response.error ? (
                  <Box>
                    <Typography color="error" sx={{ mb: 2 }}>
                      Error: {response.error}
                    </Typography>
                    {response.note && (
                      <Typography variant="body2" sx={{ color: 'warning.main' }}>
                        {response.note}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, color: 'success.main' }}>
                      Success! Found {response.count} collections
                    </Typography>
                    <CodeHighlight json={response} />
                  </Box>
                )
              ) : (
                <Typography>Loading...</Typography>
              )}
            </Box>
          </DialogContent>
        </Dialog>
        
        <Dialog
          open={nftModalOpen}
          onClose={() => setNftModalOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            NFT API Response
            <Box>
              {nftResponse && !nftResponse.error && (
                <Tooltip title="Copy response">
                  <IconButton 
                    onClick={() => {
                      copyToClipboard(JSON.stringify(nftResponse, null, 2));
                      console.log('NFT Response copied to clipboard');
                    }}
                    sx={{ mr: 1 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton onClick={() => setNftModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '70vh'
            }}>
              {nftResponse ? (
                nftResponse.error ? (
                  <Box>
                    <Typography color="error" sx={{ mb: 2 }}>
                      Error: {nftResponse.error}
                    </Typography>
                    {nftResponse.note && (
                      <Typography variant="body2" sx={{ color: 'warning.main' }}>
                        {nftResponse.note}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box>
                    {nftResponse.res === 'success' && (
                      <Typography variant="body2" sx={{ mb: 2, color: 'success.main' }}>
                        Success! Found NFT details
                      </Typography>
                    )}
                    <CodeHighlight json={nftResponse} />
                  </Box>
                )
              ) : (
                <Typography>Loading...</Typography>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ApiDocs;