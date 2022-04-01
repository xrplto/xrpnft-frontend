import { useContext } from 'react'
import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';
// Context
import Context from '../Context'
import { TOP_BAR_HEIGHT_DESKTOP } from 'utils/constants';

// ----------------------------------------------------------------------

Logo.propTypes = {
    sx: PropTypes.object
};

export default function Logo({ sx }) {
    const { isDarkMode } = useContext(Context);
    const img_black = "/xrpnft.com/logo-black.png";
    const img_white = "/xrpnft.com/logo-white.png";
    // const img_black = "/xrpnft.com/XRPL_Logo2_Colored_(Black).png";
    // const img_white = "/xrpnft.com/XRPL_Logo2_Colored_(White).png";
    const img = isDarkMode?img_white:img_black;

    return <Box component="img" src={img} sx={{ height: TOP_BAR_HEIGHT_DESKTOP, ...sx }} />;
}

// export default function Logo({ sx }) {
//   return (
//     <Fragment>
//       <Box component="img" src="/static/logo.svg" sx={{ width: 50, height: 50, ...sx }} />
//       <Box component="img" src="/xrpl/xrp-text-mark-black.svg" sx={{ height: 50, ...sx }} />
//     </Fragment>
//   );
// }
