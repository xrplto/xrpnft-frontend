import { useState, useEffect } from 'react';
import React from 'react';
import {
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Caption } from 'components/atoms/Caption';
import { AddCircleOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function CollectionAndPropertis() {

  const [secondary, setSecondary] = React.useState(false);
  const [collectionName, setCollectionName] = useState('')
  const handleCollectionFieldChange = (e) => {
    setCollectionName(e.target.value)
  }

  return (
    <Stack>
      <Caption caption={'Collection'} />
      <Typography variant='body1'>
        This is the collection where your item will appear.
      </Typography>
      <TextField required placeholder='Item name' margin='dense'
        onChange={handleCollectionFieldChange}
        value={collectionName}
        sx={{
          '&.MuiTextField-root': {
            marginTop: 1
          }
        }} />
      <Demo>
        <List>
          <Box>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <AddCircleOutlined />
                </IconButton>
              }
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="Single-line item"
                secondary={secondary ? 'Secondary text' : null}
              />
            </ListItem>
            <Container>
              <p>This is content</p>
            </Container>
          </Box>
          <Divider />
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <AddCircleOutlined />
              </IconButton>
            }
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText
              primary="Single-line item"
              secondary={secondary ? 'Secondary text' : null}
            />
          </ListItem>
        </List>
      </Demo>
    </Stack>
  );
}
