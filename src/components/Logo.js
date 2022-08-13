import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    Box,
    Link
} from '@mui/material';

function Logo() {
    const { darkMode } = useContext(AppContext);

    const img_dark = "/logo/logo-cropped-dark.svg";
    const img_light = "/logo/logo-cropped-light.svg";
    
    const img = darkMode?img_light:img_dark;
    
    return (
        <Link
            href="/"
            sx={{ pl: 0, pr: 0, py: 3, display: 'inline-flex' }}
            underline="none"
            rel="noreferrer noopener nofollow"
        >
            {/* <Box component="img" src={img} sx={{ height: 46 }} /> */}
            <LazyLoadImage
                src={img}
                height={46}
            />
        </Link>
    );
}

export default Logo;
