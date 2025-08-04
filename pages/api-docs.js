import React from 'react';
import { Container, Typography, Paper, Box, Divider, useTheme, Card, CardContent, Chip } from '@mui/material';
import Layout from '../src/components/Layout';
import CodeHighlight from '../src/components/CodeHighlight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';

const ApiDocs = () => {
  const theme = useTheme();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          XRPNFT API Documentation
        </Typography>
        
        <Typography variant="h5" component="h2" sx={{ mt: 3, mb: 2 }}>
          Collections API Query Examples
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

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
          Available orderBy Fields
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

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
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
              <CodeHighlight code={JSON.stringify(sampleResponse, null, 2)} language="json" />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default ApiDocs;