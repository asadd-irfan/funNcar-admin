import React, { useState, useCallback } from "react";
import { render } from "react-dom";

export default function VideoViewerContainer({ list, loading }) {
  return (<>
    {
      loading ? <span style={{ textAlign: "center" }}>Loading...</span> :
        <div>
          {list && list.length > 0 ? list?.map((src, index) => (
            <video
              controls
              key={index}
              src={src}
              width="130"
              height="120"
              style={{ margin: "10px", cursor: "pointer", border: "1px solid #bfbfbf" }}
            />
          )) : <div style={{ textAlign: "center",fontWeight:"600" }}>No data found</div>}
        </div>
    }
  </>);
}

