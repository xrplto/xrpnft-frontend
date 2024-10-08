import React from 'react';
import { useState } from 'react';
import { styled, alpha, Box, Typography, Avatar } from '@mui/material';

// Components
import SpinNFT from './SpinNFT';
import ViewNFT from './ViewNFT';

const BannerWrapper = styled('div')(
    ({ theme }) => `
    position: relative;
    overflow: hidden;
    height: 280px;
    margin-bottom: ${theme.spacing(6)};
    background-color: ${theme.palette.background.default};
    border-radius: ${theme.shape.borderRadius}px;
`
);

const BackgroundImage = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.5,
    zIndex: 0
}));

const BackgroundBlur = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(20px)',
    backgroundColor: alpha(theme.palette.common.black, 0.5),
    zIndex: 1
}));

const BannerImage = styled('img')(
    ({ theme }) => `
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
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
    width: 0px;
    height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 0px;
  `
);

export default function Collection({ data }) {
    const [view, setView] = useState(data?.collection?.type);

    const extra = data?.collection?.extra;
    const pendingNfts = extra ? extra.pendingNfts : 0;
    const bannerImage = data?.collection?.banner;
    const logoImage = data?.collection?.logo;

    return (
        <>
            <Box sx={{ position: 'relative', mt: 7 }}>
                <BannerWrapper>
                    {bannerImage ? (
                        <>
                            <BackgroundImage
                                sx={{
                                    backgroundImage: `url(${bannerImage})`
                                }}
                            />
                            <BackgroundBlur />
                            <BannerImage alt="" src={bannerImage} decoding="async" />
                        </>
                    ) : (
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Avatar
                                variant="square"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <IconImage src={logoImage} />
                            </Avatar>
                        </Box>
                    )}
                </BannerWrapper>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        zIndex: 2,
                    }}
                >
                    <Typography variant="h3" sx={{ color: 'common.white' }}>
                        {data?.collection?.name}
                    </Typography>
                </Box>
            </Box>

            {(view === 'random' || view === 'sequence') && pendingNfts > 0 ? (
                <SpinNFT collection={data.collection} setView={setView} />
            ) : (
                <ViewNFT collection={data.collection} />
            )}
        </>
    );
}
