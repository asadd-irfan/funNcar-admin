import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardAvatar from "../../components/Card/CardAvatar.js";
import CardBody from "../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import { useAlert } from "react-alert";
import { APP_ERROR_MSGS, BASE_URL } from "../../common/constants";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import Table from "../../common/tableRendrer";
import { getFunncarBookings, getUserBookings } from "../../actions/bookings";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import {
  numberWithCommas,
  ConvertToCurrency,
  ExportToCVS,
  scrollToDiv
} from "../../common/commonMethods";
import CustomeCSVExportbtn from "../../common/CustomeCSVExportbtn";
import { UPDATE_LOADING } from "../../actions/types";


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

export default function BookingTable({ role, Id, status, containerId="userBookings_Container" }) {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { USD_rate } = useSelector((state) => state.auth.appSettings);
  const history = useHistory();

  const exportColumns = [
    "Booking Id",
    "Booking Cost in PKR",
    "Booking Cost in USD",
    "Booking Date",
    "Created On",
    "Discount",
    "Funncar",
    "Notes",
    "On Tour Booking",
    "Payment Mode",
    "Service",
    "Status",
    "Booking Person",
    "Booking By",
    "Accepted",
    "Public Video",
    "Rating Given",
    "Marked Done",
    "Video For",
    "Video Message",
    "Video Message Delivery Date",
    "Video My Name",
    "Video Dedicated To",
    status === "completed" ? "Service Charges" : "Cancellation/Rejection Charges",
    status === "completed" ? "Net Amount" : "Deducted Amount",
  ];

  const [tableProps, setTableProps] = useState({
    data: [],
    page: 1,
    sizePerPage: 20,
    totalSize: 0,
    loading: false,
    sortName: "",
    sortOrder: "",
  });

  const getParameters = (exportToCSV = "") => {
    let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}`;
    if (tableProps.sortName != "") {
      let order =
        tableProps.sortOrder == "desc"
          ? `-${tableProps.sortName}`
          : tableProps.sortName;
      paramString = `${paramString}&sort=${order}`;
    }
    if (exportToCSV) paramString = `${paramString}&exportToCSV=true`;
    if(status) paramString = `${paramString}&status=${status}`;
    return paramString;
  }

  const getBookingsList = () => {
    if (role) {
      setTableProps({ ...tableProps, loading: true, data: [] });
      if (role == "user") {
        getUserBookings(getParameters(), Id)
          .then((result) => {
            setTableProps({ ...tableProps, loading: false });
            if (result.data.status === true) {
              // Populate Table
              setTableProps({ ...tableProps, data: [] });

              setTimeout(() => {
                setTableProps({
                  ...tableProps,
                  data: result.data.data ? result.data.data : [],
                  totalSize: result.data.data ? result.data.totalCount : 0,
                });
              }, 300);
            } else {
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
      } else {
        getFunncarBookings(getParameters(), Id)
          .then((result) => {
            setTableProps({ ...tableProps, loading: false });
            if (result.data.status === true) {
              // Populate Table
              setTableProps({ ...tableProps, data: [] });

              setTimeout(() => {
                setTableProps({
                  ...tableProps,
                  data: result.data.data ? result.data.data : [],
                  totalSize: result.data.data ? result.data.totalCount : 0,
                });
              }, 300);
            } else {
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
      }
    }
  };

  useEffect(() => {
    getBookingsList();
  }, [
    role,
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
  ]);

  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      history.push(`/admin/booking/${row.id}`);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        <Link to={`/admin/booking/${row.id}`}>
          <button data-toggle="tooltip" title="Edit" className="pd-setting-ed">
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
        </Link>
      </>
    );
  };
  const columns = [
    {
      dataField: "bookingId",
      text: "Booking Id",
      sort: true,
    },
    {
      dataField: "bookingBy",
      text: "Booking Person",
      formatter: (cell, row) => {
        return (
          <>
            {row.bookingBy === "user"
              ? row.user?.fullName
              : row.user?.professionalName}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row.bookingBy === "user"
          ? row.user?.fullName
          : row.user?.professionalName,
    },
    {
      dataField: "funncar",
      text: "Funncar",
      formatter: (cell, row) => {
        return <>{row.funncar?.professionalName}</>;
      },
      csvFormatter: (cell, row, rowIndex) => row.funncar?.professionalName,
    },
    {
      dataField: "service",
      text: "Service",
      formatter: (cell, row) => {
        return (
          <>
            {row.service?.key.includes("Video")
              ? row.service?.name
              : row.service?.name + " - " + row.eventType?.name}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row.service?.key.includes("Video")
          ? row.service?.name
          : row.service?.name + " - " + row.eventType?.name,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => {
        return (
          <>
            {row.status === "pending" && (
              <Chip label={row.status} className="bg_yellow" />
            )}
            {row.status === "booked" && (
              <Chip label={row.status} color="primary" />
            )}
            {row.status === "completed" && (
              <Chip label={row.status} className="bg_green" />
            )}
            {row.status === "cancelled" && (
              <Chip label={row.status} color="secondary" />
            )}
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
      sort: true,
    },
    {
      dataField: "totalCostPKR",
      text: "Booking Cost in PKR",
      formatter: (cell, row) => {
        return (
          <b>
            {numberWithCommas(
              row?.currency === "PKR"
                ? row?.totalCost
                : ConvertToCurrency(row?.totalCost, "PKR", USD_rate)
            )}
          </b>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        `${numberWithCommas(
          row?.currency === "PKR"
            ? row?.totalCost
            : ConvertToCurrency(row?.totalCost, "PKR", USD_rate)
        )}`,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "totalCostUSD",
      text: "Booking Cost in USD",
      formatter: (cell, row) => {
        return (
          <b>
            {numberWithCommas(
              row?.currency === "USD"
                ? row?.totalCost : '-'
                // : ConvertToCurrency(row?.totalCost, "USD", USD_rate)
            )}
          </b>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        `${numberWithCommas(
          row?.currency === "USD"
            ? row?.totalCost : '-'
            // : ConvertToCurrency(row?.totalCost, "USD", USD_rate)
        )}`,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
      sort: true,
    },
    {
      dataField: "paymentMode",
      text: "Payment Mode",
      headerStyle: (colum, colIndex) => {
        return { width: "72px" };
      },
    },
    {
      dataField: "percentage",
      text: status === "completed" ? "Service Charges" : "Cancellation/Rejection Charges",
      // hidden: status === "completed" ? false : true,
      headerStyle: (colum, colIndex) => {
        return { width: "95px" };
      },
      formatter: (cell, row) => {
        return (
          <b>
            {
              row?.paymentHistory?.percentageOnActualPrice 
              ?
                `${row?.paymentHistory?.percentageOnActualPrice}%` 
                : 
                ""
            }
          </b>
        );
      },
    },
    {
      dataField: "netAmount",
      text: status === "completed" ? "Net Amount" : "Deducted Amount",
      // hidden: status === "completed" ? false : true,
      headerStyle: (colum, colIndex) => {
        return { width: "95px" };
      },
      formatter: (cell, row) => {
        return (
          <b>
            {
              row?.paymentHistory?.PKR_amount 
              ?
                `${row?.paymentHistory?.PKR_amount}` 
                : 
                ""
            }
          </b>
        );
      },
    },
    {
      dataField: "createdAt",
      text: "Created Date",
      formatter: (cell, row) => {
        return <>{moment(row?.createdAt).format("llll")}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        moment(row?.createdAt).format("llll"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "actions",
      text: "Details",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      csvExport: false,
    },
  ];
  // const handleListBtnClick = (bookingId) =>{
  //   let state ={
  //     redirectToURL: `/admin/funncar/${Id}`,
  //     data: null,
  //     search: "" 
  //   }
  //   let pathName = `/admin/booking/${bookingId}`
  //   history.push({
  //     pathname: pathName,
  //     state: { backRedirection: state }
  //   })
  // }

  const handleTableChange = (type, newState) => {
    if (type == "sort") {
      let sortOrder =
        newState.sortField == tableProps.sortName
          ? tableProps.sortOrder == "" || tableProps.sortOrder == "asc"
            ? "desc"
            : "asc"
          : "desc";

      setTableProps({
        ...tableProps,
        page: 1,
        sortName: newState.sortField,
        sortOrder: sortOrder,
      });
    } else if (type == "pagination") {
      scrollToDiv(containerId);
      setTableProps({
        ...tableProps,
        page: newState.page,
        sizePerPage: newState.sizePerPage,
      });
    } else{
      scrollToDiv(containerId);
    }
  };

  const getExportListRows = (list) => {
    let data = [];
    for (let i in list) {
      let TempArray = [
        list[i].bookingId.toString(),
        (list[i].currency === "PKR"
          ? list[i].totalCost
          : ConvertToCurrency(list[i].totalCost, "PKR", USD_rate)
        ).toString(),
        (list[i].currency === "USD"
          ? list[i].totalCost
          : ConvertToCurrency(list[i].totalCost, "USD", USD_rate)
        ).toString(),
        moment(list[i].bookingStartTime).format("YYYY-MM-DD HH:mm"),
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
        list[i].discount.toString(),
        list[i].funncar?.professionalName,
        list[i].notes.replace(/,/g, ""),
        list[i].onTourBooking ? "Yes" : "No",
        list[i].paymentMode ? list[i].paymentMode : "",
        list[i].service?.key.includes("Video")
          ? list[i].service?.name
          : list[i].service?.name + " - " + list[i].eventType?.name,
        list[i].status,
        list[i].bookingBy === "user"
          ? list[i].user?.fullName
          : list[i].user?.professionalName,
        list[i].bookingBy,
        list[i].isAcceptedByFunncar ? "Yes" : "No",
        list[i].isPublicVideo ? "Yes" : "No",
        list[i].isRatingGiven ? "Yes" : "No",
        list[i].markDone ? "Yes" : "No",
        list[i].videoFor ? list[i].videoFor : "",
        list[i].videoMessage ? list[i].videoMessage.replace(/,/g, "") : "",
        moment(list[i].videoMessageDeliveryDateTime).format("YYYY-MM-DD HH:mm"),
        list[i].videoMyName ? list[i].videoMyName : "",
        list[i].videoTheirName ? list[i].videoTheirName : "",
        list[i].paymentHistory?.percentageOnActualPrice 
          ? `${list[i].paymentHistory?.percentageOnActualPrice}%` 
          : "",
        list[i].paymentHistory?.PKR_amount 
          ? `${list[i].paymentHistory?.PKR_amount}` 
          : ""
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    if (role) {
      dispatch({ type: UPDATE_LOADING, payload: true });
      if (role == "user") {
        getUserBookings(getParameters("true"), Id)
          .then((result) => {
            if (result.data.status === true) {
              dispatch({ type: UPDATE_LOADING, payload: false });
              ExportToCVS(
                exportColumns,
                getExportListRows(result.data.data),
                "Bookings"
              );
            } else {
              dispatch({ type: UPDATE_LOADING, payload: false });
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
      } else {
        getFunncarBookings(getParameters("true"), Id)
          .then((result) => {
            if (result.data.status === true) {
              dispatch({ type: UPDATE_LOADING, payload: false });
              ExportToCVS(
                exportColumns,
                getExportListRows(result.data.data),
                "Bookings"
              );
            } else {
              dispatch({ type: UPDATE_LOADING, payload: false });
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
      }
    }
  };

  return (
    <GridItem xs={12} sm={12} md={12} id={containerId}>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            Total Bookings : {tableProps?.totalSize}
          </h4>
          <p>{status === "notCompleted" ? "Not Completed" : status === "completed" ? "Completed" : ""}</p>
        </CardHeader>
        <CardBody>
          <CustomeCSVExportbtn onClick={exportList} />
          <Table
            {...tableProps}
            onTableChange={handleTableChange}
            columns={columns}
            rowEvents={rowEvents}
            exportBtn={false}
          />
        </CardBody>
      </Card>
    </GridItem>
  );
}
