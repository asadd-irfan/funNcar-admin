import React, { useState, useEffect } from "react";
import GridItem from "../components/Grid/GridItem.js";
import GridContainer from "../components/Grid/GridContainer.js";

export default function ServicePricing({ list, onChange, currency }) {
  const getMinVal = (val) => {
    let minVal = null;
    if (val === "Meet & Greet") minVal = "5000";
    if (val === "Video Messages") minVal = "2000";
    if (val === "Video Call") minVal = "3000";
    return minVal;
  };

  return (
    <>
      <GridItem className="align_left" xs={12} sm={12} md={12}>
        {list.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fafafa",
              marginTop: "10px",
              padding: "15px",
            }}
          >
            <div
              style={{ borderBottom: "1px solid #eee", marginBottom: "10px" }}
            >
              <span style={{ fontSize: "17px" }}>{item.serviceType?.name}</span>
              {item.timeDuration && (
                <span style={{ float: "right" }}>
                  <i className="fa fa-clock-o" aria-hidden="true"></i>{" "}
                  {item.timeDuration}
                </span>
              )}
            </div>
            <div>
              {item?.serviceDetails &&
                item?.serviceDetails.length > 0 &&
                item?.serviceDetails?.map((detailItem, detialItemIndex) => (
                  <GridContainer
                    className="mt-10"
                    style={{ marginTop: "15px" }}
                    key={detialItemIndex}
                  >
                    <GridItem className="align_left" xs={12} sm={12} md={6}>
                      <span className="">{detailItem.serviceName?.name}: </span>
                    </GridItem>
                    <GridItem className="align_left" xs={12} sm={12} md={6}>
                      <input
                        type="number"
                        style={{ textAlign: "right" }}
                        value={detailItem.price}
                        onChange={(e) =>
                          onChange(index, detialItemIndex, e.target.value)
                        }
                        min={getMinVal(item.serviceType?.key)}
                      />
                      <span style={{ paddingLeft: "5px" }}>{currency}</span>
                    </GridItem>
                  </GridContainer>
                ))}
            </div>
          </div>
        ))}
      </GridItem>
      {list.length === 0 && (
        <div style={{ textAlign: "center", fontWeight: "600" }}>
          No service selected.
        </div>
      )}
    </>
  );
}
