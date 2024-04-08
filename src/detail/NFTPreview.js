import * as React from 'react';
// import ModalImage from "react-modal-image";
import { Lightbox } from "react-modal-image";
import { useState } from 'react';
//import { useTranslation } from 'next-i18next'
function t (key) {
  let val = '';
  switch (key) {
    case 'general.loading':
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
//import { stripText } from "../utils" // for model

import Tabs from './Tabs'

// Material
import {
    Card,
    CardMedia,
    Link,
    Typography
} from '@mui/material';

// Utils
import { getImgUrl, nftUrl, nftName } from 'src/utils/parse';

export default function NFTPreview({ nft }) {
	const noImg = '/static/nft_no_image.webp'
    const imgUrl = getImgUrl(nft, 480) || noImg;
    const ipfsImgUrl = getImgUrl(nft) || noImg; //getImgUrl(NFTokenID, meta) // TODO: check if all ok as required dfile, size missing
    const isVideo = nft.meta?.video?true:false;

    const thumbnailUrl = nftUrl(nft, 'thumbnail');
    const thumbnailSaticUrl = nftUrl(nft, 'thumbnail-static');
    // const imgUrl = '/static/test.mp4';
    // const isVideo = true;

    const [openImage, setOpenImage] = useState(false);
    const [openAnimation, setOpenAnimation] = useState(false);

    const closeLightboxImage = () => {
        setOpenImage(false);
    }
    const closeLightboxAnimation = () => {
        setOpenAnimation(false);
    }

    const nftName = nft.meta?.name || "No Name";

    //const [contentTab, setContentTab] = useState("image")
    const [loaded, setLoaded] = useState(false)
    const [errored, setErrored] = useState(false)

    const style = {
        textAlign: "center",
        marginTop: "40px",
        marginBottom: "20px",
        marginLeft: "18px"
    };
    
    const loadingImage = () => {
    if (errored) {
        return <div style={style}>{t("general.load-failed")}<br /></div>;
    } else if (!loaded) {
        return <div style={style}><span className="waiting"></span><br />{t("general.loading")}</div>;
    }
    }
 
    let imageUrl = nftUrl(nft, 'image');
    const animationUrl = nftUrl(nft, 'animation');
    const videoUrl = nftUrl(nft, 'video');
    const audioUrl = nftUrl(nft, 'audio');
    const modelUrl = nftUrl(nft, 'model');
    const viewerUrl = nftUrl(nft, 'viewer');

    const [contentTab, setContentTab] = useState(videoUrl ? 'video' : (animationUrl ? 'animation' : "image"))
  
    let modelState = null;
  
    const clUrl = {
      image: nftUrl(nft, 'image'),
      animation: nftUrl(nft, 'animation'),
      video: nftUrl(nft, 'video'),
      audio: nftUrl(nft, 'audio'),
      model: nftUrl(nft, 'model')
    }
    const contentTabList = [];
    if (videoUrl) {
      contentTabList.push({ value: 'video', label: (t("tabs.video")) });
    }
    if (animationUrl) {
      contentTabList.push({ value: 'animation', label: (t("tabs.animation")) });
    }
    if (imageUrl) {
      contentTabList.push({ value: 'image', label: (t("tabs.image")) });
    }
    if (modelUrl) {
      contentTabList.push({ value: 'model', label: (t("tabs.model")) });
    }

    if (!contentTabList.length) {
      contentTabList.push({ value: 'image', label: (t("tabs.image")) });
      imageUrl = noImg;
    }
  
    let imageStyle = { width: "100%", height: "auto" };
    if (imageUrl) {
      if (imageUrl.slice(0, 10) === 'data:image') {
        imageStyle.imageRendering = 'pixelated';
      }
      if (nft.deletedAt) {
        imageStyle.filter = 'grayscale(1)';
      }
    }
    let errorStyle = { marginTop: "40px" };
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
  let modelAttr = []
  if (nft.metadata && (nft.metadata['3D_attributes'] || nft.metadata['3d_attributes'])) {
    modelAttr = nft.metadata['3D_attributes'] || nft.metadata['3d_attributes']
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
    ]
    if (Array.isArray(modelAttr)) {
      for (let i = 0; i < modelAttr.length; i++) {
        if (supportedAttr.includes(modelAttr[i].attribute)) {
          modelAttr[i].value = stripText(modelAttr[i].value)
        } else {
          delete modelAttr[i]
        }
      }
    } else if (typeof modelAttr === 'object') {
      let metaModelAttr = modelAttr
      modelAttr = []
      Object.keys(metaModelAttr).forEach(e => {
        if (supportedAttr.includes(e)) {
          modelAttr.push({
            "attribute": e,
            "value": stripText(metaModelAttr[e])
          })
        }
      })
    }
  }

    return <>
    <Card>
    {contentTabList.length > 1 &&
      <div style={{ height: "31px", margin: "18px" }}>
        <span className='tabs-inline' style={{ float: "left" }}>
          <Tabs
            tabList={contentTabList}
            tab={contentTab}
            setTab={setContentTab}
            name="content"
            style={{ margin: 0 }}
          />
        </span>
        <span style={{ float: "right", padding: "4px 0px" }}>
          <Link href={clUrl[contentTab]} target="_blank" rel="noreferrer">
            <Typography variant='body1' noWrap>{t("tabs." + contentTab)} Link</Typography>
          </Link>
        </span>
      </div>
    }
    {imageUrl && contentTab === 'image' &&
      <>
      <Link
                component="button"
                underline="none"
                onClick={() => {setOpenImage(true)} }
      >
        {loadingImage(nft)}
        <img
          style={{ ...imageStyle, display: (loaded ? "inline-block" : "none") }}
          src={thumbnailSaticUrl || thumbnailUrl || imageUrl}
          onLoad={() => { setLoaded(true); setErrored(false) }}
          onError={({ currentTarget }) => {
            if (currentTarget.src === imageUrl && imageUrl !== clUrl.image) {
              currentTarget.src = clUrl.image;
            } else {
              setErrored(true);
            }
          }}
          alt={nftName}
        />
      </Link>
      {openImage &&
        <Lightbox
            small={imageUrl}
            large={imageUrl}
            hideDownload
            hideZoom
            onClose={closeLightboxImage}
        />
      }
      </>
    }
    {animationUrl && contentTab === 'animation' &&
      <>
      <Link
              component="button"
              underline="none"
              onClick={() => {setOpenAnimation(true)} }
      >
        {loadingImage(nft)}
        <img
          style={{ ...imageStyle, display: (loaded ? "inline-block" : "none") }}
          src={thumbnailUrl || animationUrl}
          onLoad={() => { setLoaded(true); setErrored(false) }}
          onError={({ currentTarget }) => {
            if (currentTarget.src === animationUrl && animationUrl !== clUrl.animation) {
              currentTarget.src = clUrl.animation;
            } else {
              setErrored(true);
            }
          }}
          alt={nftName}
        />
      </Link>
      {openAnimation &&
        <Lightbox
          small={animationUrl}
          large={animationUrl}
          hideDownload
          hideZoom
          onClose={closeLightboxAnimation}
        />
      }
      </>
    }
    {videoUrl && defaultTab === 'video' &&
      <video
        poster={thumbnailUrl}
        playsInline
        muted
        loop
        controls
        style={{ width: "100%", height: "auto" }}
      >{/*autoPlay*/}
        <source src={videoUrl} type="video/mp4" />
      </video>
    }
    {modelUrl && defaultTab === 'model' &&
      <>
        {modelState === "loading" &&
          <div style={style}><span className="waiting"></span><br />{t("general.loading")}</div>
        }
        {modelState !== "ready" &&
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
              src={modelUrl}
              camera-controls
              auto-rotate
              ar
              poster={LoadingGif}
              autoplay
              {
              ...modelAttr?.reduce((prev, curr) => {
                prev[curr.attribute] = curr.value
                return prev;
              }, {})
              }
            >
            </model-viewer>
          </>
        }
      </>
    }
    {contentTabList.length < 2 && defaultUrl &&
      <span style={{ padding: "4px 0px" }}>
        <Link href={defaultUrl} target="_blank" rel="noreferrer">
          <Typography style={{ marginLeft: "18px" }} variant='body1' noWrap>{t("tabs." + defaultTab)} Link</Typography>
        </Link>
      </span>
    }

    {defaultTab !== 'model' /*&& defaultTab !== 'video'*/ && audioUrl &&
      <>
        <audio src={audioUrl} controls style={{ display: 'block', margin: "20px auto", marginBottom: "0px" }}></audio>
        <span style={{ padding: "4px 0px" }}>
          <Link href={clUrl.audio} target="_blank" rel="noreferrer">
            <Typography style={{ marginLeft: "18px" }} variant='body1' noWrap>{t("tabs.audio")} Link</Typography>
          </Link>
        </span>
      </>
    }
    {viewerUrl &&
      <span style={{ padding: "4px 0px", float: "right" }}>
        <Link href={viewerUrl} target="_blank" rel="noreferrer">
          <Typography style={{ marginLeft: "18px" }} variant='s11' noWrap>{t("general.viewer")}</Typography>
        </Link>
      </span>
    }
    {/*(!nft.uri && !(nft.metadata)) ?
      <div className="center bold" style={errorStyle}>{t("general.no-uri")}</div>
      :
      <>
        {!(imageUrl || videoUrl || audioUrl || modelUrl) &&
          <div className="center bold" style={errorStyle}>{t("general.no-media")}</div>
        }
      </>
      */}
    <div style={{ height: "15px" }}></div>
    </Card>
  </>

}
