// Material
import { styled, Card, Stack, Typography } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 102px;
        height: 102px;
        margin-bottom: 16px;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 132px;
            height: 132px;
        }
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 192px;
            height: 192px;
        }
        border: 6px solid ${theme.colors.alpha.black[50]};
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
        overflow: hidden;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 90px;
        height: 90px;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 120px;
            height: 120px;
        }
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 180px;
            height: 180px;
        }
        &:hover, &.Mui-focusVisible {
            z-index: 1;
            & .MuiImageBackdrop-root {
                opacity: 0.1;
            }
            & .MuiIconEditButton-root {
                opacity: 1;
            }
        }
  `
);

const IconImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 0px;
  `
);

export default function CollectionCard({ collection, onCreate }) {
    const { name, logoImage } = collection || {};

    const handleClick = () => {
        if (!collection) {
            onCreate();
        }
    };

    return (
        <Card
            sx={{
                flex: 1,
                px: 4,
                py: 6,
                cursor: collection ? '' : 'pointer'
            }}
            onClick={handleClick}
        >
            <Stack
                sx={{
                    height: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {collection ? (
                    <>
                        <IconCover>
                            <IconWrapper>
                                <IconImage
                                    src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                />
                            </IconWrapper>
                        </IconCover>
                        <Typography variant="h3">{name}</Typography>
                    </>
                ) : (
                    <>
                        <LibraryAddIcon sx={{ fontSize: 72, mb: 1 }} />
                        <Typography variant="p2">
                            Create a new collection
                        </Typography>
                    </>
                )}
            </Stack>
        </Card>
    );
}
