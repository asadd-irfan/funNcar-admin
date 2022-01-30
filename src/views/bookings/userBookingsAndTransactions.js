import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
// import CardAvatar from "../../components/Card/CardAvatar.js";
import CardBody from "../../components/Card/CardBody.js";
// import Button from "../../components/CustomButtons/Button.js";
import { useAlert } from "react-alert";
import { APP_ERROR_MSGS, BASE_URL } from "../../common/constants";
// import { useSelector, useDispatch } from "react-redux";
// import { useHistory, Link } from "react-router-dom";
import { getUserBookingsAndTransactions } from "../../actions/bookings";
// import Chip from "@material-ui/core/Chip";
import moment from "moment";
import {
  numberWithCommas,
  scrollToDiv,
  //   ConvertToCurrency,
  //   ExportToCVS,
} from "../../common/commonMethods";
// import CustomeCSVExportbtn from "../../common/CustomeCSVExportbtn";
// import { UPDATE_LOADING } from "../../actions/types";
import ClientSideTableRendrer from "../../common/clientSideTableRendrer";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};
const useStyles = makeStyles(styles);

export default function UserBookingsAndTransactions({
  Id,
  role,
  containerId = "userBookingsAndTransactions_Container",
}) {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  //   const dispatch = useDispatch();
  //   const { USD_rate } = useSelector((state) => state.auth.appSettings);
  //   const history = useHistory();

  // states
  const [tableProps, setTableProps] = useState({
    data: [],
    loading: false,
    sizePerPageList: [
      {
        text: "20",
        value: 20,
      },
      {
        text: "30",
        value: 30,
      },
      {
        text: "50",
        value: 50,
      },
    ],
  });

  const columns = [
    {
      dataField: "bookingId",
      text: "Booking Id",
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "serviceLabel",
      text: "Service",
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "statusLabel",
      text: "Status",
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      sort: true,
    },
    {
      dataField: "transactionTypeLabel",
      text: "Type",
      headerStyle: (colum, colIndex) => {
        return { width: "90px" };
      },
      sort: true,
    },
    {
      dataField: "PKR_amount",
      text: "PKR Amount",
      headerStyle: (colum, colIndex) => {
        return { width: "110px" };
      },
      sort: true,
    },
    {
      dataField: "USD_amount",
      text: "USD Amount",
      headerStyle: (colum, colIndex) => {
        return { width: "110px" };
      },
      sort: true,
    },
    {
      dataField: "paymentMode",
      text: "Payment Mode",
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "createdAt",
      text: "Date",
      formatter: (cell, row) => {
        return <>{moment(row?.createdAt).format("llll")}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        moment(row?.createdAt).format("llll"),
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
      sort: true,
    },
  ];

  const handleTableChange = () => {
    scrollToDiv(containerId);
  };
  const getBookingsList = () => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    getUserBookingsAndTransactions("", Id)
      .then((result) => {
        if (result.data.status === true) {
          let listDate = [];
          if (result.data?.totalCount > 0) {
            // transactions
            let transactions =
              result.data.transactionsList.length > 0
                ? result.data.transactionsList.map((obj) => ({
                    ...obj,
                    recordType: "transaction",
                    bookingId: obj.booking?.bookingId
                      ? obj.booking?.bookingId
                      : "-",
                    serviceLabel: obj.booking
                      ? obj.booking?.service?.key.includes("Video")
                        ? obj.booking?.service?.name
                        : obj.booking?.service?.name +
                          " - " +
                          obj.booking?.eventType?.name
                      : "-",
                    statusLabel:
                      obj?.type == "booking-created"
                        ? "Booking Created (User To Admin)"
                        : obj?.type == "funncar-payment"
                        ? "Funncar Payment (Admin To Funncar)"
                        : obj?.type == "booking-cancelled"
                        ? "Booking Cancelled (Funncar To Admin)"
                        : "-",
                    transactionTypeLabel:
                      obj?.type == "booking-created" ||
                      obj?.type == "booking-cancelled"
                        ? "Debit"
                        : obj?.type == "funncar-payment"
                        ? "Credit"
                        : "",
                    PKR_amount: numberWithCommas(obj?.PKR_amount),
                    USD_amount: obj?.USD_amount
                      ? `${numberWithCommas(obj?.USD_amount)}`
                      : `-`,
                    paymentMode: obj.booking?.paymentMode
                      ? obj.booking?.paymentMode
                      : "-",
                  }))
                : [];

            // Bookings
            let bookings =
              result.data.bookingsList.length > 0
                ? result.data.bookingsList.map((obj) => ({
                    ...obj,
                    recordType: "booking",
                    serviceLabel: obj.service?.key.includes("Video")
                      ? obj.service?.name
                      : obj.service?.name + " - " + obj.eventType?.name,
                    statusLabel: "Booking Completed (Admin To Funncar)",
                    transactionTypeLabel: "-",
                    PKR_amount: obj?.paymentHistory?.PKR_amount
                      ? `${obj?.paymentHistory?.PKR_amount}`
                      : "-",
                    USD_amount: "-",
                  }))
                : [];

            listDate = [...transactions, ...bookings];
            listDate.sort(function (a, b) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
          }
          setTableProps({
            ...tableProps,
            data: listDate,
          });
        } else {
          setTableProps({ ...tableProps, loading: false });
          alert.error(
            result.data.message
              ? result.data.message
              : APP_ERROR_MSGS.StandardErrorMsg
          );
        }
      })
      .catch((error) => {
        setTableProps({ ...tableProps, loading: false });
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg
        );
      });
  };

  useEffect(() => {
    getBookingsList();
  }, []);

  return (
    <GridItem xs={12} sm={12} md={12} id={containerId}>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>{role} All Transactions</h4>
        </CardHeader>
        <CardBody>
          <ClientSideTableRendrer
            {...tableProps}
            columns={columns}
            isPagination={true}
            onPageChange={handleTableChange}
            onSizePerPageChange={handleTableChange}
          />
        </CardBody>
      </Card>
    </GridItem>
  );
}
