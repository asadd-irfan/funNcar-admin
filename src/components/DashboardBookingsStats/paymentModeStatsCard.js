import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import { APP_ERROR_MSGS, paymentModes } from "../../common/constants";
import { Link } from "react-router-dom";
import {
  convertDateFormate,
  getUrlQuerySearchParam,
} from "../../common/commonMethods";
import CardIcon from "../../components/Card/CardIcon.js";
import CardFooter from "../../components/Card/CardFooter.js";
import GridItem from "../../components/Grid/GridItem.js";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Update from "@material-ui/icons/Update";
import GridContainer from "../../components/Grid/GridContainer.js";
import { getAllBookings } from "../../actions/bookings";

export default function PaymentModeStatsCard({
  startDate,
  endDate,
  selectedFilterVal,
  classes,
  paymentMode,
  setPaymentMode,
  btnClickChange,
}) {
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const getParamString = () => {
    let paramString = `?paymentMode=${paymentMode}`;
    const urlQueryString = getUrlQuerySearchParam(
      selectedFilterVal,
      startDate ? convertDateFormate(startDate) : "",
      endDate ? convertDateFormate(endDate) : ""
    );
    let dateRange = urlQueryString ? `&${urlQueryString}` : "";
    return `${paramString}${dateRange}`;
  };
  const getBookingsList = () => {
    setLoading(true);
    getAllBookings(getParamString())
      .then((result) => {
        if (result.data.status === true) {
          setTotalAmount(result.data.totalAmount);
          setTotalBookings(result.data.totalCount);
        } else {
          alert.error(
            result.data.message
              ? result.data.message
              : APP_ERROR_MSGS.StandardErrorMsg
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg
        );
      });
  };
  useEffect(() => {
    getBookingsList();
  }, [paymentMode, btnClickChange]);

  return (
    <>
      <GridItem xs={12} sm={12} md={6}>
        {/* <Link
          to={
            selectedFilterVal === "all"
              ? `/admin/bookings`
              : selectedFilterVal === "custom"
              ? `/admin/bookings?type=${selectedFilterVal}&startDate=${convertDateFormate(
                  startDate
                )}&endDate=${convertDateFormate(endDate)}`
              : `/admin/bookings?type=${selectedFilterVal}`
          }
        > */}
        <Card>
          <CardHeader style={{ height: 100 }} color="success" stats icon>
            <CardIcon color="success">
              <AssignmentIcon />
            </CardIcon>
            <p className={classes.cardCategory}>Payment Mode</p>
          </CardHeader>
          <div className="paymentModesContainer">
            {paymentModes.map((item, i) => {
              return (
                <label className="custome-radio-container" key={i}>
                  {item.label}
                  <input
                    type="radio"
                    name="PaymentModeType_Radio"
                    defaultChecked={item.value === paymentMode}
                    onClick={() => {
                      setPaymentMode(item.value);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              );
            })}
          </div>
          {loading ? (
            <div className="loadingMode">Loading...</div>
          ) : (
            <GridContainer className="mt-20 mx-10">
              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Total Amount: </span>
                <span className="Tag_value">
                  {totalAmount ? totalAmount : 0}
                </span>
              </GridItem>

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Total Bookings: </span>
                <span className="Tag_value">
                  {totalBookings ? totalBookings : 0}
                </span>
              </GridItem>
            </GridContainer>
          )}
          <CardFooter stats>
            <div className={classes.stats}>
              <Update />
              Just Updated
            </div>
          </CardFooter>
        </Card>
        {/* </Link> */}
      </GridItem>
    </>
  );
}
