import { styled } from '@mui/system';
import { PuffLoader } from "react-spinners";
import Skeleton from '@mui/material/Skeleton';

const LoaderContainer = styled('div')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export function ImgLoadingBg() {
    return (
            <Skeleton animation="wave" width='100%' height='100%' />

    )
}
