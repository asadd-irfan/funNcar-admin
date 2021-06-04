import React, { useState, useCallback } from "react";
import { render } from "react-dom";
import ImageViewer from "react-simple-image-viewer";
import {BASE_URL} from "../common/constants"

export default function ImageViewerContainer({images,loading}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback(index => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (<>
    {
        loading ? <span style={{textAlign:"center"}}>Loading...</span> :
        <div>
        {images && images.length > 0 ? images?.map((src, index) => (
          <img
            src={src}
            onClick={() => openImageViewer(index)}
            width="80"
            height="80"
            key={index}
            style={{ margin: "10px",cursor:"pointer",border:"1px solid #bfbfbf" }}
            alt=""
          />
        )) : <div style={{textAlign:"center",fontWeight:"600"}}>No data found</div>}
  
        {isViewerOpen && (
          <ImageViewer
            src={images}
            currentIndex={currentImage}
            onClose={closeImageViewer}
            backgroundStyle={{
              backgroundColor: "rgba(0,0,0,0.9)"
            }}
          />
        )}
      </div>
    } 
  </>);
}

