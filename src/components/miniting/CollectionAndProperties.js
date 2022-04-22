import { useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Grid,
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
import Trait from './Trait';
import AddTraitDgContent from './AddTraitDgContent'
import BaseDialog from 'components/dialog/BaseDialog';


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const properties = [
  {
    id: 1,
    type: 'arm',
    value: 'big',
  },
  {
    id: 2,
    type: 'leg',
    value: 'short',
  },
  {
    id: 3,
    type: 'body',
    value: 'strong',
  },
]

export default function CollectionAndPropertis() {

  const [secondary, setSecondary] = useState(false);
  const [isOpenTraitAddDg, setIsOpenTraitAddDg] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const handleCollectionFieldChange = (e) => {
    setCollectionName(e.target.value)
  }

  const openTraitAddDg = () => {
    setIsOpenTraitAddDg(!isOpenTraitAddDg)
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
                <IconButton edge="end" aria-label="delete"
                  onClick={openTraitAddDg}
                >
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
              <Grid container spacing={2} >
                {properties.map((property) => (
                  <Grid item key={property.id}>
                    <Trait type={property.type} value={property.value} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
          <Divider />
        </List>
      </Demo>
      <BaseDialog
        isOpen={isOpenTraitAddDg}
        close={openTraitAddDg}
        title={'Add Properties'}
        render={<AddTraitDgContent />}
      />
    </Stack>
  );
}
