import React, { useEffect, useState } from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AssignmentIcon from "@material-ui/icons/Assignment";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
// import Danger from "../../components/Typography/Danger.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardFooter from "../../components/Card/CardFooter.js";
import { getWallet, getTableStats } from "../../actions/common";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from "react-alert";
import {
  numberWithCommas,
  convertDateFormate,
} from "../../common/commonMethods";
import { APP_ERROR_MSGS, paymentModes } from "../../common/constants";
import { useDispatch } from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/CustomButtons/Button.js";
import { Link, useHistory } from "react-router-dom";

// import {
//   dailySalesChart,
//   completedTasksChart
// } from "variables/charts.js";

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";

// charts
// import LineChart from "../../components/Charts/LineChart";
// import BarsChart from "../../components/Charts/BarsChart";
// import DoughnutPieChart from "../../components/Charts/DoughnutPieChart";
// import PieChart from "../../components/Charts/PieChart";
// import SplineAreaChart from "../../components/Charts/SplineAreaChart";

// Bookings List stats
import BookingsListSection from "../../components/DashboardBookingsStats/BookingsListSection";
import PaymentModeStatsCard from "../../components/DashboardBookingsStats/paymentModeStatsCard";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  const FilterList = [
    { id: "all", label: "All" },
    { id: "one-week", label: "One Week" },
    { id: "one-month", label: "One Month" },
    { id: "custom", label: "Custom" },
  ];

  // state start
  const [startDate, setStartDate] = useState(
    history.location.state?.backRedirection?.startDate ?? new Date()
  );
  const [endDate, setEndDate] = useState(
    history.location.state?.backRedirection?.endDate ?? new Date()
  );
  const [selectedFilterVal, setSelectedFilterVal] = useState(
    history.location.state?.backRedirection?.selectedFilterVal ?? "all"
  );
  const [walletInfo, setWalletInfo] = useState(null);
  const [cardsInfo, setCardsInfo] = useState({
    totalBookings: 0,
    totalFunncar: 0,
    totalPerformers: 0,
    totalUsers: 0,
  });
  const [btnClickChange, setBtnClickChange] = useState(false);
  const [paymentMode, setPaymentMode] = useState(
    paymentModes[0].value ? paymentModes[0].value : "jazzcash"
  );
  // state end

  const handleDateChange = (date, label) => {
    let dateVal = date == "" || date == null ? new Date() : date;
    if (label == "endDate") setEndDate(dateVal);
    else {
      setStartDate(dateVal);
      if (dateVal > endDate) setEndDate(dateVal);
    }
  };
  const handleFilterValChange = (val) => {
    setSelectedFilterVal(val);
    if (val === "custom") {
      setStartDate(new Date());
      setEndDate(new Date());
    }
  };
  const getWalletInfo = () => {
    getWallet()
      .then((result) => {
        if (result.data.status === true) {
          setWalletInfo(result.data.data.wallet);
        } else {
          alert.error(
            result.data.message
              ? result.data.message
              : APP_ERROR_MSGS.StandardErrorMsg
          );
        }
      })
      .catch((error) => {
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg
        );
      });
  };
  const handleSearchBtn = () => {
    setBtnClickChange(!btnClickChange);
    getCardsInfo();
  };
  const getCardsInfo = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    let paramString = `type=${selectedFilterVal}&key=cancelBookingTable&page=1`;
    if (selectedFilterVal == "custom") {
      paramString =
        paramString +
        `&startDate=${convertDateFormate(
          startDate
        )}&endDate=${convertDateFormate(endDate)}`;
    }
    getTableStats(paramString)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          let response = result.data.data;
          let cardsInfo = {
            totalBookings: response.totalBookings,
            totalFunncar: response.totalFunncar,
            totalPerformers: response.totalPerformers,
            totalUsers: response.totalUsers,
          };
          setCardsInfo(cardsInfo);
        } else {
          alert.error(
            result.data.message
              ? result.data.message
              : APP_ERROR_MSGS.StandardErrorMsg
          );
        }
      })
      .catch((error) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg
        );
      });
  };

  useEffect(() => {
    getWalletInfo();
    getCardsInfo();
  }, []);

  return (
    <>
      {/* filters */}
      <GridContainer className="dashboard-filters-container mb-3">
        <GridItem xs={12} sm={6} md={3}>
          <select
            style={{ height: "35px", width: "100%" }}
            value={selectedFilterVal}
            onChange={(e) => handleFilterValChange(e.target.value)}
          >
            {FilterList.map((item, index) => {
              return <option value={item.id} key={index} >{item.label}</option>;
            })}
          </select>
        </GridItem>

        {selectedFilterVal === "custom" && (
          <>
            <GridItem xs={12} sm={6} md={3}>
              <span>From: </span>
              <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date, "startDate")}
                selectsStart
                startDate={startDate}
                endDate={endDate}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <span>To: </span>
              <DatePicker
                selected={endDate}
                onChange={(date) => handleDateChange(date, "endDate")}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
            </GridItem>
          </>
        )}

        <GridItem xs={12} sm={6} md={3}>
          <Button
            type="button"
            color="primary"
            style={{ margin: "0px", height: "35px" }}
            onClick={handleSearchBtn}
          >
            Filter
          </Button>
        </GridItem>
      </GridContainer>

      {/* Stats */}
      <GridContainer className="dashboard-statsCards-container">
        {/* Wallet info */}
        {/* <GridItem xs={12} sm={12} md={12}>
          <h2 style={{ fontWeight: "700", float: "right" }}>
            Funncar Account Balance:{" "}
            {numberWithCommas(walletInfo?.currentBalance)}{" "}
            {walletInfo?.currency}{" "}
          </h2>
        </GridItem> */}

        {/* Cards count */}
        <GridItem xs={12} sm={6} md={3}>
          <Link
            to={
              selectedFilterVal === "all"
                ? `/admin/users`
                : selectedFilterVal === "custom"
                ? `/admin/users?type=${selectedFilterVal}&startDate=${convertDateFormate(
                    startDate
                  )}&endDate=${convertDateFormate(endDate)}`
                : `/admin/users?type=${selectedFilterVal}`
            }
          >
            <Card>
              <CardHeader style={{ height: 100 }} color="info" stats icon>
                <CardIcon color="info">
                  <AccountBoxIcon />
                </CardIcon>
                <p className={classes.cardCategory}>Total Fans</p>
                <h3 className={classes.cardTitle}>{cardsInfo?.totalUsers}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </Link>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Link
            to={
              selectedFilterVal === "all"
                ? `/admin/funncars`
                : selectedFilterVal === "custom"
                ? `/admin/funncars?type=${selectedFilterVal}&startDate=${convertDateFormate(
                    startDate
                  )}&endDate=${convertDateFormate(endDate)}`
                : `/admin/funncars?type=${selectedFilterVal}`
            }
          >
            <Card>
              <CardHeader style={{ height: 100 }} color="success" stats icon>
                <CardIcon color="success">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Total Funncar</p>
                <h3 className={classes.cardTitle}>{cardsInfo?.totalFunncar}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </Link>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Link
            to={
              selectedFilterVal === "all"
                ? `/admin/performers`
                : selectedFilterVal === "custom"
                ? `/admin/performers?type=${selectedFilterVal}&startDate=${convertDateFormate(
                    startDate
                  )}&endDate=${convertDateFormate(endDate)}`
                : `/admin/performers?type=${selectedFilterVal}`
            }
          >
            <Card>
              <CardHeader style={{ height: 100 }} color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Total Performers</p>
                <h3 className={classes.cardTitle}>
                  {cardsInfo?.totalPerformers}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </Link>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Link
            to={
              selectedFilterVal === "all"
                ? `/admin/bookings`
                : selectedFilterVal === "custom"
                ? `/admin/bookings?type=${selectedFilterVal}&startDate=${convertDateFormate(
                    startDate
                  )}&endDate=${convertDateFormate(endDate)}`
                : `/admin/bookings?type=${selectedFilterVal}`
            }
          >
            <Card>
              <CardHeader style={{ height: 100 }} color="success" stats icon>
                <CardIcon color="success">
                  <AssignmentIcon />
                </CardIcon>
                <p className={classes.cardCategory}>Total Bookings</p>
                <h3 className={classes.cardTitle}>
                  {cardsInfo?.totalBookings}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </Link>
        </GridItem>

        <PaymentModeStatsCard
          startDate={startDate}
          endDate={endDate}
          selectedFilterVal={selectedFilterVal}
          classes={classes}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          btnClickChange={btnClickChange}
        />
      </GridContainer>

      {/* Tables  */}
      <BookingsListSection
        startDate={startDate}
        endDate={endDate}
        selectedFilterVal={selectedFilterVal}
        btnClickChange={btnClickChange}
      />

      {/* <GridContainer className="dashboard-charts-container">
            <GridItem xs={12} sm={12} md={12}>
              <SplineAreaChart />
            </GridItem>
            <GridItem xs={12} sm={12} md={6} className="mt-4">
              <LineChart />
            </GridItem>
            <GridItem xs={12} sm={12} md={6} className="mt-4">
              <LineChart />
            </GridItem>
            <GridItem xs={12} sm={12} md={12} className="mt-4">
              <BarsChart />
            </GridItem>
            <GridItem xs={12} sm={12} md={4} className="mt-4">
              <PieChart />
            </GridItem>
            <GridItem xs={12} sm={12} md={4} className="mt-4">
              <PieChart />
            </GridItem>
            <GridItem xs={12} sm={12} md={4} className="mt-4">
              <PieChart />
            </GridItem>

            <GridItem xs={12} sm={12} md={12} className="mt-4">
              <DoughnutPieChart />
            </GridItem>
          </GridContainer>
         */}
    </>
  );
}
