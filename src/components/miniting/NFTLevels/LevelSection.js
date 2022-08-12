import { useState } from 'react';

// Material
import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
} from '@mui/material';

// Iconify
import { Icon } from '@iconify/react';

// Components
import AddLevelDgContent from './AddLevelDgContent';
import BaseDialog from 'components/dialog/BaseDialog';
import Levels from './Levels';

// Redux
import { useSelector } from 'react-redux'

export default function LevelsSection() {
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
                    <Levels levels={levels} />
                </Box>
                <Divider />
            </List>
            <BaseDialog
                isOpen={isOpen}
                close={openDg}
                title={'Add Levels'}
                render={ <AddLevelDgContent close={openDg} /> }
            />
        </Stack>
    );
}
