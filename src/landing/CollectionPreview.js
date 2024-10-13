import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

// Material
import {
    styled,
    Link,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { getNftCoverUrl } from 'src/utils/parse';

/* offset-x | offset-y | blur-radius | spread-radius | color */
// box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
// box-shadow: rgba(100, 100, 111, 0.8) 0px 7px 32px 10px;
// box-shadow: inset 0 -3em 3em rgba(0,0,0,0.5), 0 0 20px 20px rgb(255,255,255, 0.2), 0.3em 0.3em 1em rgba(0,0,0,0.2);
// box-shadow: inset 0.2em 0.2em 0.2em 0 rgba(255,255,255,0.5), inset -0.2em -0.2em 0.2em 0 rgba(0,0,0,0.5);
// box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);
// box-shadow: 0px 5px 20px 1px;

const CustomImage = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
}));

const CustomCarousel = styled(Carousel)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    width: '100%',
    height: '100%', // Ensure it takes full height of parent
    margin: '0 auto',
    '& .slide': {
        background: 'transparent !important',
        boxShadow: 'none !important',
    }
}));

const CollectionCard = styled(Paper)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 16px ${theme.palette.primary.main}20`
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(to bottom, ${theme.palette.background.default}00 70%, ${theme.palette.background.default}B3 100%)`,
        pointerEvents: 'none'
    },
    width: '100%',
    height: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper,
}));

const CollectionInfo = styled(Stack)(({ theme }) => ({
    position: 'relative', // Changed from absolute to relative
    padding: theme.spacing(1),
    zIndex: 1
}));

// Add this new styled component for the gradient text
const GradientText = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
}));

export default function CollectionPreview({ collections }) {
    const { darkMode } = useContext(AppContext);
    const theme = useTheme();

    const fadeAnimationHandler = (props, state) => {
        const transitionTime = props.transitionTime + 'ms';
        const transitionTimingFunction = 'ease-in-out';

        let slideStyle = {
            position: 'absolute',
            display: 'block',
            zIndex: -2,
            minHeight: '100%',
            opacity: 0,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            transitionTimingFunction: transitionTimingFunction,
            msTransitionTimingFunction: transitionTimingFunction,
            MozTransitionTimingFunction: transitionTimingFunction,
            WebkitTransitionTimingFunction: transitionTimingFunction,
            OTransitionTimingFunction: transitionTimingFunction
        };

        if (!state.swiping) {
            slideStyle = {
                ...slideStyle,
                WebkitTransitionDuration: transitionTime,
                MozTransitionDuration: transitionTime,
                OTransitionDuration: transitionTime,
                transitionDuration: transitionTime,
                msTransitionDuration: transitionTime
            };
        }

        return {
            slideStyle,
            selectedStyle: {
                ...slideStyle,
                opacity: 1,
                zIndex: 2,
                position: 'relative'
            },
            prevStyle: { ...slideStyle }
        };
    };

    return (
        <CustomCarousel
            interval={4000}
            transitionTime={2000}
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop={true}
            showThumbs={false}
            useKeyboardArrows={true}
            autoPlay={true}
            stopOnHover={false}
            swipeable={false}
            animationHandler={fadeAnimationHandler}
            emulateTouch={true}
        >
            {collections.map((item, idx) => {
                const {
                    uuid,
                    account,
                    accountName,
                    name,
                    slug,
                    items,
                    type,
                    description,
                    logoImage,
                    featuredImage,
                    bannerImage,
                    costs,
                    extra,
                    minter,
                    verified,
                    created,
                    volume,
                    totalVolume,
                    floor,
                    owners,
                    totalVol24h,
                    nft
                } = item;

                // const featuredImageUrl = `https://s1.xrpnft.com/collection/${featuredImage}`;

                let imgUrl = getNftCoverUrl(nft ? nft : {}); //, 300

                if (!imgUrl || nft?.meta?.video) {
                    imgUrl = `https://s1.xrpnft.com/collection/${logoImage}`;
                }

                return (
                    <CollectionCard
                        key={idx}
                        elevation={0}
                    >
                        <Link
                            underline="none"
                            color="inherit"
                            href={`/collection/${slug}`}
                            sx={{ display: 'block', width: '100%', height: '100%' }}
                        >
                            <CustomImage src={imgUrl} alt={name} />
                            <CollectionInfo
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent="center"
                                sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 2 }}
                            >
                                <GradientText
                                    variant="subtitle1"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        fontWeight: 600,
                                        textShadow: `0 1px 2px ${theme.palette.primary.main}80`,
                                        textAlign: 'center',
                                        flexGrow: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontSize: '1.5rem'
                                    }}
                                >
                                    {name}
                                </GradientText>
                                {verified === 'yes' && (
                                    <Tooltip title="Verified">
                                        <VerifiedIcon
                                            fontSize="large"
                                            sx={{
                                                color: theme.palette.primary.main,
                                                flexShrink: 0
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </CollectionInfo>
                        </Link>
                    </CollectionCard>
                );
            })}
        </CustomCarousel>
    );
}
