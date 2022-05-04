import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { AddTraitDgProp } from 'utils/types';
import { setMetadata } from 'app/slices/ipfSlice';
import { useDispatch } from 'react-redux'

AddTraitDgContent.propTypes = AddTraitDgProp

export default function AddTraitDgContent({
  // save,
  close,
  properties }) {

  const [traits, setTraits] = useState(properties)
  const dispatch = useDispatch()

  const addTraitItem = () => {

    const item = {
      id: uuidv4(),
      type: '',
      value: '',
    }
    setTraits(
      [
        ...traits,
        item
      ]
    )
  }
  const saveItems = () => {
    const final = [...traits]
    // save(final.filter(item => item.type !== '' && item.value !== ''))
    dispatch(setMetadata({ properties: final.filter(item => item.type !== '' && item.value !== '') }))

    close()
  }
  const deleteItem = (id) => {
    setTraits(traits.filter((item => item.id !== id)))
  }

  const handleValueChange = (e, id) => {
    const temp = [...traits]
    const idx = temp.findIndex(item => item.id === id)
    temp[idx].value = e.target.value
    setTraits(temp)
  }

  const handleTypeChange = (e, id) => {
    const temp = [...traits]
    const idx = temp.findIndex(item => item.id === id)
    temp[idx].type = e.target.value
    setTraits(temp)
  }
  return (
    <Container >
      <Typography variant='body1'>
        Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.
      </Typography>
      <List>
        <ListItem sx={{ justifyContent: 'space-evenly' }}>
          <Typography variant='caption'>Type</Typography>
          <Typography variant='caption'>Name</Typography>
        </ListItem>
        {
          traits.map((trait) => (
            <ListItem sx={{ justifyContent: 'space-between' }} key={trait.id}>
              <IconButton edge="start" aria-label="delete"
                onClick={() => { deleteItem(trait.id) }}
                itemID={trait.id}
              >
                <Icon icon="akar-icons:cross" />
              </IconButton>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={trait.type}
                onChange={e => handleTypeChange(e, trait.id)}
              />
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={trait.value}
                onChange={e => handleValueChange(e, trait.id)}
              />
            </ListItem>
          ))
        }
        <ListItem >
          <IconButton edge="start" aria-label="delete"
            onClick={addTraitItem}
          >
            <Icon icon="carbon:add-alt" />
          </IconButton>
        </ListItem>
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
        <Button
          variant='contained'
          sx={{
            background: 'springgreen',
            height: 50
          }}
          onClick={saveItems}
        >
          Save
        </Button>
      </Box>
    </Container>
  );
}
