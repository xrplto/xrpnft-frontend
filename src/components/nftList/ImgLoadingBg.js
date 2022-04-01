import { styled } from '@mui/system';
import { PuffLoader } from "react-spinners";

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
        <LoaderContainer>
            <PuffLoader color={"#00AB55"} size={50} />
        </LoaderContainer>
    )
}
