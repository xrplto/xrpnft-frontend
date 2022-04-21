import { useContext } from 'react'
import { Box } from '@mui/material';
import Context from '../Context'
import { TOP_BAR_HEIGHT_DESKTOP } from 'utils/constants';

export default function Logo() {
    const { isDarkMode } = useContext(Context);
    const img_black = "/xrpnft.com/logo-cropped-dark.svg";
    const img_white = "/xrpnft.com/logo-cropped-light.svg";
    const img = isDarkMode ? img_white : img_black;

    return <Box component="img" src={img} sx={{ height: TOP_BAR_HEIGHT_DESKTOP }} />;
}
