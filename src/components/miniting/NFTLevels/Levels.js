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
} from '@mui/material';
import NumericalTrait from './NumericalTrait';
import BaseDialog from 'components/dialog/BaseDialog';
import { Icon } from '@iconify/react';
import AddLevelDgContent from './AddLevelDgContent';
import { useSelector } from 'react-redux'

export default function Levels() {
  // const [properties, setProperties] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const levels = useSelector(state => state.ipfs.metadata.levels)

  const openDg = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Stack>
      <List>
        <Box sx={{ margin: 1, padding: 1 }}>
          <ListItem
            secondaryAction={
              <IconButton edge='end' aria-label='delete'
                onClick={openDg}
              >
                <Icon icon='carbon:add-alt' fontSize={30} />
              </IconButton>
            }
          >
            <ListItemIcon>
              <Icon icon="bxs:star-half" fontSize={30} />
            </ListItemIcon>
            <ListItemText
              primary='Levels'
              secondary={'Numerical traits that show as a progress bar'}
            />
          </ListItem>
          <Container>
            <Grid container spacing={2} >
              {levels && levels.map((property) => (
                <Grid item key={property.id} sx={{ width: '60%' }}>
                  <NumericalTrait type={property.type} value={property.value} total={property.total} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        <Divider />
      </List>
      <BaseDialog
        isOpen={isOpen}
        close={openDg}
        title={'Add Levels'}
        render={
          <AddLevelDgContent
            // save={setProperties}
            close={openDg}
            properties={levels} />}
      />
    </Stack>
  );
}
