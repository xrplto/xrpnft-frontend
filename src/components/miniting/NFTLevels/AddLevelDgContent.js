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
import { AddLevelDgProp } from 'utils/types';

AddLevelDgContent.propTypes = AddLevelDgProp

export default function AddLevelDgContent({ save, close, properties }) {

  const [traits, setTraits] = useState(properties)

  const addTraitItem = () => {

    const item = {
      id: uuidv4(),
      type: '',
      value: 2,
      total: 5,
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
    save(final.filter(item => item.type !== '' && item.value !== ''))
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

  const handleTotalChange = (e, id) => {
    const temp = [...traits]
    const idx = temp.findIndex(item => item.id === id)
    temp[idx].total = e.target.value
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
        Levels show up underneath your item, are clickable, and can be filtered in your collection's sidebar.
      </Typography>
      <List>
        <ListItem sx={{ justifyContent: 'space-between' }}>
          <Typography variant='caption' sx={{ marginLeft: 10 }}>Type</Typography>
          <Typography variant='caption' sx={{ marginRight: 10 }}>Value</Typography>
        </ListItem>
        {
          traits.map((trait) => (
            <ListItem sx={{ justifyContent: 'space-between', gap: 1 }} key={trait.id}>
              <IconButton edge='start' aria-label='delete'
                onClick={() => { deleteItem(trait.id) }}
                itemID={trait.id}
              >
                <Icon icon='akar-icons:cross' />
              </IconButton>
              <TextField
                id='outlined-basic'
                variant='outlined'
                sx={{ width: '100%' }}
                value={trait.type}
                onChange={e => handleTypeChange(e, trait.id)}
              />
              <TextField
                id='outlined-basic'
                variant='outlined'
                value={trait.value}
                sx={{ maxWidth: 50 }}
                onChange={e => handleValueChange(e, trait.id)}
              />
              <Typography variant='h5'> of </Typography>
              <TextField
                id='outlined-basic'
                sx={{ maxWidth: 50 }}
                variant='outlined'
                value={trait.total}
                onChange={e => handleTotalChange(e, trait.id)}
              />
            </ListItem>
          ))
        }
        <ListItem >
          <IconButton edge='start' aria-label='delete'
            onClick={addTraitItem}
          >
            <Icon icon='carbon:add-alt' />
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
