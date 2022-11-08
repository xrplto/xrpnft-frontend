import { LazyLoadImage } from 'react-lazy-load-image-component';

// Material
import {
    useTheme, useMediaQuery,
    Box,
    Link
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

function Logo() {
    /*
        xs: 0,
        mobile: 450,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1840
    */
    const theme = useTheme();
    const { darkMode } = useContext(AppContext);
    // const isMobile = useMediaQuery(theme.breakpoints.down('mobile'));

    const img_dark = "/logo/logo-dark.svg";
    const img_light = "/logo/logo-light.svg";
    // const img_mobile_dark = "/logo/logo-mobile-dark.svg";
    // const img_mobile_light = "/logo/logo-mobile-light.svg";
    
    let img = darkMode?img_light:img_dark;
    // if (isMobile)
    //     img = darkMode?img_mobile_light:img_mobile_dark;
    
    return (
        <Link
            href="/"
            sx={{ pl: 0, pr: 0, py: 3, display: 'inline-flex' }}
            underline="none"
            rel="noreferrer noopener nofollow"
        >
            <Box component="img" src={img} sx={{ height: 72 }} />
            {/* <LazyLoadImage
                src={img}
                height={64}
            /> */}
        </Link>
    );
}

export default Logo;
