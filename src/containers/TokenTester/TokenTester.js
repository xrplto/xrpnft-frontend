import React from "react";
import {Card, CardContent, Switch, Typography} from '@mui/material';
import {List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useSelector, useDispatch } from 'react-redux';
import { toggleThemeMode, swapThemeColors, isDarkMode, isColorSwaped } from "../../context/settingsReducer";

export default function Setting() {

  const darkMode = useSelector(isDarkMode);
  const colorSwaped = useSelector(isColorSwaped);

  const dispatch = useDispatch();

  return (
  <div>
    <Typography variant="h5">NFToken Tester</Typography>
    <Card>
      <CardContent>
        <List>
          <ListItem>
            <ListItemIcon>
              <PaletteIcon />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            <ListItemSecondaryAction>
              <Switch
                onChange={(e, checked) =>  dispatch(toggleThemeMode(checked))}
                checked={darkMode}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CompareArrowsIcon />
            </ListItemIcon>
            <ListItemText primary="Swap Colors" />
            <ListItemSecondaryAction>
              <Switch
                onChange={(e, checked) => dispatch(swapThemeColors(checked))}
                checked={colorSwaped}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  </div>);
};
