import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useSelector, useDispatch } from "react-redux";
import { getAllBookings, cancelBookingById, updateBookingById } from "../../actions/bookings";
import { APP_ERROR_MSGS, paymentModes } from "../../common/constants";
import { useAlert } from "react-alert";
import AlertDialog from "../../components/Modals/AlertModal";
import Table from "../../common/tableRendrer";
import Chip from "@material-ui/core/Chip";
import { UPDATE_LOADING } from "../../actions/types";
import moment from "moment";
import {
  numberWithCommas,
  scrollToDiv,
  getUrlQuerySearchParam,
  ConvertToCurrency,
  ExportToCVS,
} from "../../common/commonMethods";
import Button from "../../components/CustomButtons/Button.js";
import { useHistory } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import CustomeCSVExportbtn from "../../common/CustomeCSVExportbtn";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
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

export default function BookingsList(props) {
  const history = useHistory();
  const alert = useAlert();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { USD_rate } = useSelector((state) => state.auth.appSettings);
  const { services } = useSelector((state) => state.auth?.appConfigs?.data);
  const bookingStatuses = [
    { value: "pending", label: "Pending" },
    { value: "booked", label: "Booked" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];
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
  ];
  const urlQuery = new URLSearchParams(props.location.search);
  const filterType = urlQuery.get("type");
  const startDate = urlQuery.get("startDate");
  const endDate = urlQuery.get("endDate");
  const urlQueryString = getUrlQuerySearchParam(filterType, startDate, endDate);

  // state
  const [status, setStatus] = useState(history.location.state?.backRedirection?.status ?? "");
  const [service, setService] = useState(history.location.state?.backRedirection?.service ?? "");
  const [search, setSearch] = useState(history.location.state?.backRedirection?.search ?? "");
  const [paymentMode, setPaymentMode] = useState(history.location.state?.backRedirection?.paymentMode ?? "");

  const [selectedType, setSelectedType] = useState("");
  const [AlertModalProps, setAlertModalProps] = useState({
    open: false,
    title: "",
    message: "",
    firstCallback: () => {},
    secondCallback: () => {},
  });
  const [tableProps, setTableProps] = useState({
    data: [],
    page: 1,
    sizePerPage: 20,
    totalSize: 0,
    loading: false,
    sortName: "",
    sortOrder: "",
  });
  // variables and functions
  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      history.push(`/admin/booking/${row.id}`);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        {/* <Link to={`/admin/booking/${row.id}`}> */}
          <Button
            onClick={()=> handleListBtnClick(row.id,"view")}
            className="btn_padding m-1"
            color="primary"
            // data-toggle="tooltip" title="Edit" className="pd-setting-ed"
          >
            {/* <i className="fa fa-eye" aria-hidden="true"></i> */}
            View
          </Button>
        {/* </Link> */}

        {!row.disputeResolved  && (<>
          <Button
            onClick={()=> markAsDisputed(row.id)}
            className="btn_padding m-1"
            color="danger"
          >
            Mark as Disputed
          </Button>
        </>
        )}
        {row.disputeResolved  && (<>
          <Button
            className="btn_padding m-1"
            disabled
            color="success"
          >
            Dispute Resolved
          </Button>
        </>
        )}
        {row.status !== "completed" && row.status !== "cancelled" && (<>
          <Button
            className="btn_padding m-1"
            color="danger"
            onClick={() => {
              onCancel(row.id);
            }}
          >
            Cancel
          </Button>
        </>
        )}
        {/* <button onClick={(() => { onDelete(row.id) })} data-toggle="tooltip" title="Delete" className="pd-setting-ed"><i className="fa fa-trash" aria-hidden="true"></i></button> */}
      </>
    );
  };
  const columns = [
    {
      dataField: "bookingId",
      text: "Booking Id",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "75px" };
      },
    },
    {
      dataField: "username",
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
      headerStyle: (colum, colIndex) => {
        return { width: "90px" };
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
      headerStyle: (colum, colIndex) => {
        return { width: "90px" };
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
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
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
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "90px" };
      },
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
                ? row?.totalCost
                // : ConvertToCurrency(row?.totalCost, "USD", USD_rate)
                : '-'
            )}
          </b>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        `${numberWithCommas(
          row?.currency === "USD"
            ? row?.totalCost
            // : ConvertToCurrency(row?.totalCost, "USD", USD_rate)
            : '-'

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
        return { width: "90px" };
      },
    },
    // {
    //   dataField: "onTourBooking",
    //   text: "On Tour Booking ",
    //   formatter: (cell, row) => {
    //     return <>{row?.onTourBooking ? "YES" : "NO"}</>;
    //   },
    //   csvFormatter: (cell, row, rowIndex) =>
    //     row?.onTourBooking ? "YES" : "NO",
    //   sort: true,
    // },
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
      text: "Actions",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      headerStyle: (colum, colIndex) => {
        return { width: "240px" };
      },
      csvExport: false,
    },
  ];
  const handleListBtnClick = (id,type) =>{
    let state ={
      redirectToURL: `/admin/bookings`,
      data: { search, status, service, paymentMode },
      search: props.location.search ?? "" 
    }
    let pathName=  "";
    if(type === "view") pathName = `/admin/booking/${id}`
    history.push({
      pathname: pathName,
      state: { backRedirection: state }
    })
  }
  const onCancel = (id) => {
    setAlertModalProps({
      ...AlertModalProps,
      open: true,
      title: "Cancel Booking",
      message: "Are you sure you want to Cancel this Booking?",
      firstCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
        CancelBooking(id);
      },
      secondCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
      },
    });
  };
  const CancelBooking = (id) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    let body = { status: "cancelled" };
    cancelBookingById(id, body)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(result.data.message);
          getBookingsList();
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

  const markAsDisputed = (id) => {
    setAlertModalProps({
      ...AlertModalProps,
      open: true,
      title: "Mark As Disputed Booking",
      message: "Are you sure you want to Mark As Disputed to this Booking?",
      firstCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
        MarkDisputed(id);
      },
      secondCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
      },
    });
  };
  const MarkDisputed = (id) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    let body = { adminMarkAsDisputed: true, isDisputed: true, disputeResolved: false };
    updateBookingById(id, body)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(result.data.message);
          getBookingsList();
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
  const getParamString = (
    status = "",
    bookingId = "",
    service = "",
    paymentMode = "",
    exportToCSV = ""
  ) => {
    let paramString = `?isDisputed=false&page=${tableProps.page}&limit=${tableProps.sizePerPage}`;
    let dateRange = urlQueryString ? `&${urlQueryString}` : "";
    if (tableProps.sortName != "") {
      let order =
        tableProps.sortOrder == "desc"
          ? `-${tableProps.sortName}`
          : tableProps.sortName;
      paramString = `${paramString}&sort=${order}`;
    }
    if (status) paramString = `${paramString}&status=${status}`;
    if (bookingId) paramString = `${paramString}&bookingId=${bookingId}`;
    if (service) paramString = `${paramString}&service=${service}`;
    if (paymentMode) paramString = `${paramString}&paymentMode=${paymentMode}`;
    if (exportToCSV) paramString = `${paramString}&exportToCSV=${exportToCSV}`;
    return `${paramString}${dateRange}`;
  };
  const getBookingsList = (status = "", bookingId = "", service = "", paymentMode = "") => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    getAllBookings(getParamString(status, bookingId, service, paymentMode))
      .then((result) => {
        setTableProps({ ...tableProps, loading: false });
        if (result.data.status === true) {
          // Populate Table
          setTableProps({ ...tableProps, data: [] });
          setTimeout(() => {
            setTableProps({
              ...tableProps,
              loading: false,
              data: result.data.data ? result.data.data : [],
              totalSize: result.data.data ? result.data.totalCount : 0,
            });
          }, 30);
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
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getAllBookings(getParamString(status, search, service, paymentMode, "true"))
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
  };

  useEffect(() => {
    getBookingsList(status, search, service, paymentMode);
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
    status,
    search,
    service,
    paymentMode
  ]);

  useEffect(() => {
    scrollToDiv("bookings-list-container");
  }, [tableProps.page, tableProps.sizePerPage]);

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
      setTableProps({
        ...tableProps,
        page: newState.page,
        sizePerPage: newState.sizePerPage,
      });
    }
  };

  const handleStatusChange = (e) => {
    const value = e.currentTarget.value;
    setStatus(value);
    setTableProps({
      ...tableProps,
      page: 1,
      sortName: "",
      sortOrder: "",
    });
  };

  const handleServiceChange = (e) => {
    setService(e.currentTarget.value);
    setTableProps({
      ...tableProps,
      page: 1,
      sortName: "",
      sortOrder: "",
    });
  };

  const onSearch = (value) => {
    setSearch(value);
    setTableProps({
      ...tableProps,
      page: 1,
      sortName: "",
      sortOrder: "",
    });
  };

  const handlePaymentModeChange = (e) => {
    const value = e.currentTarget.value;
    setPaymentMode(value);
    setTableProps({
      ...tableProps,
      page: 1,
      sortName: "",
      sortOrder: "",
    });
  };

  return (
    <>
      <AlertDialog
        {...AlertModalProps}
        setOpen={(resp) => {
          setAlertModalProps({ ...AlertModalProps, open: resp });
        }}
      />

      <GridContainer id="bookings-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <FormGroup row className="d-flex">
            <div>
              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={status}
                onChange={handleStatusChange}
              >
                <option value={""}>Booking Status</option>
                {bookingStatuses.map((item, i) => {
                  return (
                    <option key={i} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={service}
                onChange={handleServiceChange}
              >
                <option value={""}>Service</option>
                {services?.map((item, i) => {
                  return (
                    <option key={i} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={paymentMode}
                onChange={handlePaymentModeChange}
              >
                <option value={""}>Payment Modes</option>
                {paymentModes.map((item, i) => {
                  return (
                    <option key={i} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by booking ID"
              style={{ height: "35px", minWidth: "250px", margin: 10 }}
            />
          </FormGroup>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Bookings List</h4>
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
      </GridContainer>
    </>
  );
}
