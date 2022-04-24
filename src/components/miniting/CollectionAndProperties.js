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
import Trait from './Trait';
import AddTraitDgContent from './AddTraitDgContent'
import BaseDialog from 'components/dialog/BaseDialog';
import { Icon } from '@iconify/react';

export default function CollectionAndPropertis() {
  const [properties, setProperties] = useState([])
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
      <Typography variant='caption' >Collection</Typography>
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
      {/* <Demo> */}
      <List>
        <Box sx={{ margin: 1, padding: 1 }}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete"
                onClick={openTraitAddDg}
              >
                <Icon icon="carbon:add-alt" fontSize={30} />
              </IconButton>
            }
          >
            <ListItemIcon>
              <Icon icon="teenyicons:search-property-outline" fontSize={30} />
            </ListItemIcon>
            <ListItemText
              primary="Properties"
              secondary={'Textual traits that show up as rectangles'}
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
      <BaseDialog
        isOpen={isOpenTraitAddDg}
        close={openTraitAddDg}
        title={'Add Properties'}
        render={<AddTraitDgContent save={setProperties} close={openTraitAddDg} properties={properties} />}
      />
    </Stack>
  );
}
