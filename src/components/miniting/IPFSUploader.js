import React, { useState } from "react";
// import {FileUpload } from 'react-ipfs-uploader'

export const IPFSUploader = () => {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div>
      {/* <ImageUpload setUrl={setImageUrl} /> */}
      ImageUrl :{" "}
      <a href={imageUrl} target="_blank" rel="noopener noreferrer">
        {imageUrl}
      </a>
    </div>
  );
};
