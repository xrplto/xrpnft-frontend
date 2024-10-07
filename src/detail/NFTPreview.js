import * as React from 'react';
import { Lightbox } from 'react-modal-image';
import { useState, useContext, useCallback, useRef } from 'react';
import { AppContext } from 'src/AppContext';
import Head from 'next/head';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Modal, Box, IconButton, Zoom, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

function t(key) {
    let val = '';
    switch (key) {
        case 'general.loading':
            'image';
            val = 'Loading...';
            break;
        case 'general.load-failed':
            val = 'Failed to load';
            break;
        case 'general.no-uri':
            val = 'No URI specified';
            break;
        case 'general.no-image':
            val = 'No media found';
            break;
        case 'tabs.image':
            val = 'Image';
            break;
        case 'tabs.video':
            val = 'Video';
            break;
        case 'tabs.animation':
            val = 'Animation';
            break;
        case 'tabs.audio':
            val = 'Audio';
            break;
        case 'tabs.model':
            val = '3D model';
            break;
        case 'tabs.viewer':
            val = 'Viewer';
            break;
        case 'general.viewer':
            val = 'Viewer';
            break;
    }
    return val;
}

import Tabs from './Tabs';

// Material
import { Card, CardMedia, Link, Typography } from '@mui/material';

// Utils
import { getNftFilesUrls } from 'src/utils/parse';

export default function NFTPreview({ nft }) {
    const { darkMode } = useContext(AppContext);
    const noImg = '/static/nft_no_image.webp';

    // slider
    const [loadedSlider, setLoadedSlider] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        loop: true,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoadedSlider(true);
        }
    });
    function Arrow(props) {
        const disabled = props.disabled ? ' arrow--disabled' : '';
        return (
            <svg
                onClick={props.onClick}
                className={`arrow ${
                    props.left ? 'arrow--left' : 'arrow--right'
                } ${disabled}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                {props.left && (
                    <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
                )}
                {!props.left && (
                    <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
                )}
            </svg>
        );
    }

    const handleOpenImage = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setOpenImage(true);
    };

    const [openImage, setOpenImage] = useState(false);
    const [openAnimation, setOpenAnimation] = useState(false);

    const closeLightboxImage = () => {
        setOpenImage(false);
    };

    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    const style = {
        textAlign: 'center',
        marginTop: '40px',
        marginBottom: '20px',
        marginLeft: '18px'
    };

    const loadingImage = () => {
        if (errored) {
            return (
                <div style={style}>
                    {t('general.load-failed')}
                    <br />
                </div>
            );
        } else if (!loaded) {
            return (
                <div style={style}>
                    <span className="waiting"></span>
                    <br />
                    {t('general.loading')}
                </div>
            );
        }
    };

    let imageUrl = getNftFilesUrls(nft, 'image');
    const animationUrl = getNftFilesUrls(nft, 'animation');
    const videoUrl = getNftFilesUrls(nft, 'video');
    const audioUrl = getNftFilesUrls(nft, 'audio');
    const modelUrl = getNftFilesUrls(nft, 'model');
    const viewerUrl = getNftFilesUrls(nft, 'viewer');

    const [contentTab, setContentTab] = useState(
        videoUrl ? 'video' : animationUrl ? 'animation' : 'image'
    );

    let modelState = null;

    const clUrl = {
        image: imageUrl?.[currentSlide]?.cachedUrl,
        animation: animationUrl?.[currentSlide]?.cachedUrl,
        video: videoUrl?.[currentSlide]?.cachedUrl,
        audio: audioUrl?.[currentSlide]?.cachedUrl,
        model: modelUrl?.[currentSlide]?.cachedUrl
    };
    const contentTabList = [];
    if (videoUrl) {
        contentTabList.push({ value: 'video', label: t('tabs.video') });
    }
    if (animationUrl) {
        contentTabList.push({ value: 'animation', label: t('tabs.animation') });
    }
    if (imageUrl) {
        contentTabList.push({ value: 'image', label: t('tabs.image') });
    }
    if (modelUrl) {
        contentTabList.push({ value: 'model', label: t('tabs.model') });
    }

    if (!contentTabList.length) {
        contentTabList.push({ value: 'image', label: t('tabs.image') });
        imageUrl = noImg;
    }

    const imgOrAnimUrl =
        contentTab === 'image'
            ? imageUrl
            : contentTab === 'animation'
            ? animationUrl
            : '';

    let imageStyle = { width: '100%', height: 'auto' };
    if (imageUrl) {
        if (imageUrl.slice(0, 10) === 'data:image') {
            imageStyle.imageRendering = 'pixelated';
        }
        if (nft.deletedAt) {
            imageStyle.filter = 'grayscale(1)';
        }
    }
    let errorStyle = { marginTop: '40px' };
    let defaultTab = contentTab;
    let defaultUrl = clUrl[contentTab];
    if (!imageUrl && contentTab === 'image') {
        if (clUrl['video']) {
            defaultTab = 'video';
            defaultUrl = clUrl['video'];
        } else if (clUrl['model']) {
            defaultTab = 'model';
            defaultUrl = clUrl['model'];
        }
    }

    //add attributes for the 3D model viewer
    let modelAttr = [];
    if (
        nft.metadata &&
        (nft.metadata['3D_attributes'] || nft.metadata['3d_attributes'])
    ) {
        modelAttr =
            nft.metadata['3D_attributes'] || nft.metadata['3d_attributes'];
        const supportedAttr = [
            'environment-image',
            'exposure',
            'shadow-intensity',
            'shadow-softness',
            'camera-orbit',
            'camera-target',
            'skybox-image',
            'auto-rotate-delay',
            'rotation-per-second',
            'field-of-view',
            'max-camera-orbit',
            'min-camera-orbit',
            'max-field-of-view',
            'min-field-of-view',
            'disable-zoom',
            'orbit-sensitivity',
            'animation-name',
            'animation-crossfade-duration',
            'variant-name',
            'orientation',
            'scale'
        ];
        if (Array.isArray(modelAttr)) {
            for (let i = 0; i < modelAttr.length; i++) {
                if (supportedAttr.includes(modelAttr[i].attribute)) {
                    modelAttr[i].value = stripText(modelAttr[i].value);
                } else {
                    delete modelAttr[i];
                }
            }
        } else if (typeof modelAttr === 'object') {
            let metaModelAttr = modelAttr;
            modelAttr = [];
            Object.keys(metaModelAttr).forEach((e) => {
                if (supportedAttr.includes(e)) {
                    modelAttr.push({
                        attribute: e,
                        value: stripText(metaModelAttr[e])
                    });
                }
            });
        }
    }

    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleOpenFullScreen = (imageUrl) => {
        setFullScreenImage(imageUrl);
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleCloseFullScreen = () => {
        setFullScreenImage(null);
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleZoom = useCallback((delta, mouseX, mouseY) => {
        setZoom((prevZoom) => {
            const newZoom = Math.max(1, Math.min(prevZoom + delta, 5));
            if (newZoom !== prevZoom && imageRef.current && containerRef.current) {
                const image = imageRef.current;
                const container = containerRef.current;
                const rect = image.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // Calculate the center of the container
                const containerCenterX = containerRect.width / 2;
                const containerCenterY = containerRect.height / 2;

                // Calculate the point on the image where we're zooming
                const zoomPointX = (mouseX - containerRect.left - pan.x) / (rect.width * prevZoom);
                const zoomPointY = (mouseY - containerRect.top - pan.y) / (rect.height * prevZoom);

                // Calculate new dimensions
                const newWidth = rect.width * (newZoom / prevZoom);
                const newHeight = rect.height * (newZoom / prevZoom);

                // Calculate new pan values
                let newPanX = pan.x - (newWidth - rect.width) * zoomPointX;
                let newPanY = pan.y - (newHeight - rect.height) * zoomPointY;

                // Adjust pan to keep image centered if smaller than container
                if (newWidth < containerRect.width) {
                    newPanX = containerCenterX - newWidth / 2;
                }
                if (newHeight < containerRect.height) {
                    newPanY = containerCenterY - newHeight / 2;
                }

                // Calculate the maximum allowed pan values
                const maxPanX = Math.max(0, (newWidth - containerRect.width) / 2);
                const maxPanY = Math.max(0, (newHeight - containerRect.height) / 2);

                // Clamp the pan values to keep the image within bounds
                const clampedPanX = Math.max(-maxPanX, Math.min(maxPanX, newPanX));
                const clampedPanY = Math.max(-maxPanY, Math.min(maxPanY, newPanY));

                setPan({ x: clampedPanX, y: clampedPanY });
            }
            return newZoom;
        });
    }, [pan]);

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        handleZoom(delta, e.clientX, e.clientY);
    }, [handleZoom]);

    const handleZoomIn = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            handleZoom(0.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }, [handleZoom]);

    const handleZoomOut = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            handleZoom(-0.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }, [handleZoom]);

    const handleMouseDown = useCallback((e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    }, [zoom]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging && zoom > 1) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setPan((prevPan) => {
                const image = imageRef.current;
                const container = containerRef.current;
                if (image && container) {
                    const rect = image.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    // Calculate the maximum allowed pan values
                    const maxPanX = Math.max(0, (rect.width * zoom - containerRect.width) / 2);
                    const maxPanY = Math.max(0, (rect.height * zoom - containerRect.height) / 2);

                    // Calculate new pan values
                    const newPanX = prevPan.x + dx;
                    const newPanY = prevPan.y + dy;

                    // Clamp the pan values to keep the image within bounds
                    const clampedPanX = Math.max(-maxPanX, Math.min(maxPanX, newPanX));
                    const clampedPanY = Math.max(-maxPanY, Math.min(maxPanY, newPanY));

                    return { x: clampedPanX, y: clampedPanY };
                }
                return prevPan;
            });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    }, [isDragging, zoom, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const renderImageLink = (file) => (
        <Link
            component="button"
            underline="none"
            onClick={() => handleOpenFullScreen(file.cachedUrl)}
        >
            {loadingImage(nft)}
            <img
                style={{
                    ...imageStyle,
                    display: loaded ? 'inline-block' : 'none',
                    verticalAlign: 'bottom',
                    cursor: 'pointer'
                }}
                onLoad={() => {
                    setLoaded(true);
                    setErrored(false);
                }}
                onError={({ currentTarget }) => {
                    if (
                        currentTarget.src === imageUrl &&
                        imageUrl !== clUrl.image
                    ) {
                        currentTarget.src = clUrl.image;
                    } else {
                        setErrored(true);
                    }
                }}
                src={
                    typeof file === 'string'
                        ? file
                        : file.thumbnail
                        ? 'https://s2.xrpnft.com/d1/' +
                          (file.thumbnail?.big || file.thumbnail?.small)
                        : file.cachedUrl
                }
                alt=""
            />
        </Link>
    );

    return (
        <>
            <Card>
                {contentTabList.length > 1 && (
                    <div style={{ height: '31px', margin: '18px' }}>
                        <span className="tabs-inline" style={{ float: 'left' }}>
                            <Tabs
                                tabList={contentTabList}
                                tab={contentTab}
                                setTab={setContentTab}
                                name="content"
                                style={{ margin: 0 }}
                            />
                        </span>
                    </div>
                )}

                {((imageUrl && contentTab === 'image') ||
                    (animationUrl && contentTab === 'animation')) && (
                    <>
                        {typeof imgOrAnimUrl === 'object' &&
                        imgOrAnimUrl.length > 1 ? (
                            <div className="navigation-wrapper">
                                <div ref={sliderRef} className="keen-slider">
                                    {imgOrAnimUrl.map((file, index) => (
                                        <div
                                            key={index}
                                            className={`keen-slider__slide number-slide${
                                                index + 1
                                            }`}
                                        >
                                            {renderImageLink(file)}
                                        </div>
                                    ))}
                                </div>
                                {loadedSlider && instanceRef.current && (
                                    <>
                                        <Arrow
                                            left
                                            onClick={(e) =>
                                                e.stopPropagation() ||
                                                instanceRef.current?.prev()
                                            }
                                            disabled={currentSlide === 0}
                                        />

                                        <Arrow
                                            onClick={(e) =>
                                                e.stopPropagation() ||
                                                instanceRef.current?.next()
                                            }
                                            disabled={
                                                currentSlide ===
                                                instanceRef.current.track
                                                    .details.slides.length -
                                                    1
                                            }
                                        />
                                    </>
                                )}

                                {loadedSlider && instanceRef.current && (
                                    <div className="dots">
                                        {[
                                            ...Array(
                                                instanceRef.current.track
                                                    .details.slides.length
                                            ).keys()
                                        ].map((idx) => {
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        instanceRef.current?.moveToIdx(
                                                            idx
                                                        );
                                                    }}
                                                    className={
                                                        'dot' +
                                                        (currentSlide === idx
                                                            ? ' active'
                                                            : '')
                                                    }
                                                ></button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            renderImageLink(
                                typeof imgOrAnimUrl === 'string'
                                    ? imgOrAnimUrl
                                    : imgOrAnimUrl[0]
                            )
                        )}
                        {openImage && (
                            <Lightbox
                                small={selectedImageUrl}
                                large={selectedImageUrl}
                                hideDownload
                                hideZoom
                                onClose={() => setOpenImage(false)}
                                imageBackgroundColor={
                                    darkMode
                                        ? 'rgb(33, 37, 43)'
                                        : 'rgb(244, 245, 251)'
                                }
                            />
                        )}
                    </>
                )}

                {videoUrl && defaultTab === 'video' && (
                    <video
                        poster={
                            videoUrl[currentSlide].thumbnail
                                ? 'https://s2.xrpnft.com/d1/' +
                                  (videoUrl[currentSlide].thumbnail?.big ||
                                      videoUrl[currentSlide].thumbnail?.static)
                                : ''
                        }
                        playsInline
                        muted
                        loop
                        controls
                        style={{
                            width: '100%',
                            height: 'auto',
                            verticalAlign: 'bottom'
                        }}
                    >
                        <source
                            src={videoUrl[currentSlide]?.cachedUrl}
                            type="video/mp4"
                        />
                    </video>
                )}
                {modelUrl && defaultTab === 'model' && (
                    <>
                        {modelState === 'loading' && (
                            <div style={style}>
                                <span className="waiting"></span>
                                <br />
                                {t('general.loading')}
                            </div>
                        )}
                        {modelState !== 'ready' && (
                            <>
                                <Head>
                                    <script
                                        type="module"
                                        src="/js/model-viewer.min.js"
                                        defer
                                    />
                                </Head>
                                <model-viewer
                                    className="model-viewer"
                                    src={modelUrl[currentSlide]?.cachedUrl}
                                    camera-controls
                                    auto-rotate
                                    ar
                                    poster={LoadingGif}
                                    autoplay
                                    {...modelAttr?.reduce((prev, curr) => {
                                        prev[curr.attribute] = curr.value;
                                        return prev;
                                    }, {})}
                                ></model-viewer>
                            </>
                        )}
                    </>
                )}

                {defaultTab !== 'model' && audioUrl && (
                    <>
                        <audio
                            src={audioUrl[currentSlide]?.cachedUrl}
                            controls
                            style={{
                                display: 'block',
                                margin: '20px auto',
                                marginBottom: '0px'
                            }}
                        ></audio>
                    </>
                )}
                {viewerUrl && (
                    <span style={{ padding: '4px 0px', float: 'right' }}>
                        <Link
                            href={viewerUrl[currentSlide]?.cachedUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Typography
                                style={{ padding: '18px' }}
                                variant="s11"
                                noWrap
                            >
                                {t('general.viewer')}
                            </Typography>
                        </Link>
                    </span>
                )}
            </Card>

            <Modal
                open={!!fullScreenImage}
                onClose={handleCloseFullScreen}
                aria-labelledby="full-screen-image-modal"
                aria-describedby="full-screen-image-description"
            >
                <Box
                    ref={containerRef}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                    }}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFullScreen}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: 16,
                            color: 'white',
                            zIndex: 1,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 16,
                            bottom: 16,
                            display: 'flex',
                            flexDirection: 'row',
                            zIndex: 1,
                        }}
                    >
                        <Tooltip title="Zoom In">
                            <IconButton
                                aria-label="zoom in"
                                onClick={handleZoomIn}
                                sx={{ color: 'white', mr: 1 }}
                            >
                                <ZoomInIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Zoom Out">
                            <IconButton
                                aria-label="zoom out"
                                onClick={handleZoomOut}
                                sx={{ color: 'white' }}
                            >
                                <ZoomOutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <img
                        ref={imageRef}
                        src={fullScreenImage}
                        alt="Full screen NFT"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            pointerEvents: 'none', // Prevents the image from interfering with mouse events
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
}