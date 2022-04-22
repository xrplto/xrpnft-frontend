import * as React from 'react';
import {
  Box,
  Grid,
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
import { AddCircleOutlined } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';

export default function AddTraitDgContent() {
  return (
    <Container>
      <Typography variant='body1'>
        Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.
      </Typography>
      <List>
        <ListItem
          secondaryAction={
            <IconButton edge="start" aria-label="delete"
            // onClick={openTraitAddDg}
            >
              <AddCircleOutlined />
            </IconButton>
          }
        >
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </ListItem>
      </List>
    </Container>
  );
}
