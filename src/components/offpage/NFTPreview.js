import * as React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  IconButton,
  Typography
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { NFTPreviewProps } from 'types/types';

NFTPreview.prototype = NFTPreviewProps

export default function NFTPreview({ uri, title, favorites }) {
  return (
    <Card sx={{ minHeight: 200 }}>
      <CardHeader
        sx={{ padding: '0 10px' }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton aria-label='settings'>
              <FavoriteBorderIcon />
            </IconButton>
            <Typography variant='string'>{favorites}</Typography>
          </Box>
        }
        subheader={title}
      />
      <CardMedia
        component='img'
        image={uri}
        alt={uri}
      />
    </Card>
  );
}
