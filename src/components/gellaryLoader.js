import React, { useState, useCallback } from "react";
import { BASE_URL } from "../common/constants"

export default function GellaryLoader({ list, addedList, loading, deleteFromGallery }) {
    return (<>
        {
            loading ? <span style={{ textAlign: "center" }}>Loading...</span> :
                list?.length === 0 && addedList?.length === 0 ? <div style={{ textAlign: "center", fontWeight: "600" }}>No data found</div> :
                    <div className="gallery_container">
                        {list && list.length > 0 && list?.map((src, index) => (
                            <div className="position-relative" key={index}>
                                <div>
                                    {src.match(/\.(jpeg|jpg|gif|png|webp)$/) != null ?
                                        <img src={BASE_URL + "/" + src} width="130" height="120" key={index} style={{ margin: "10px", border: "1px solid #bfbfbf" }} alt="" />
                                        :
                                        <video controls src={BASE_URL + "/" + src} width="130" height="120" style={{ margin: "10px", border: "1px solid #bfbfbf" }} />
                                    }
                                </div>
                                <div className="gallery_container_cross" onClick={()=>deleteFromGallery(src)}>
                                <i className="fa fa-times" aria-hidden="true"></i>
                                </div>
                            </div>
                        ))}
                    </div>
        }
    </>);
}

