import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactions } from "../../actions/payments";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import AlertDialog from "../../components/Modals/AlertModal";
import Table from "../../common/tableRendrer";
import Chip from "@material-ui/core/Chip";
import { UPDATE_LOADING } from "../../actions/types";
import moment from "moment";
import {
  numberWithCommas,
  scrollToDiv,
  ExportToCVS,
  convertArrayToString,
} from "../../common/commonMethods";
import Button from "../../components/CustomButtons/Button.js";
import FormGroup from "@material-ui/core/FormGroup";
import CustomeCSVExportbtn from "../../common/CustomeCSVExportbtn";
import { useHistory } from "react-router-dom";
import NotesModal from "../../components/Modals/NotesModal";

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

export default function ALLTransactions() {
  const alert = useAlert();
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const history = useHistory();

  // state
  const transactionStatuses = [
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

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
  // const CellMenu = (cell, row) => {
  //     return (
  //         <>
  //             <Link to={`/admin/booking/${row?.id}`}>
  //                 <Button className="btn_padding m-1" color="primary"
  //                 >
  //                 View</Button>
  //                 </Link>

  //                 {(row.status !== 'completed' && row.status !== 'cancelled') && <Button className="btn_padding m-1" color="danger"
  //                 >Cancel</Button>}
  //         </>
  //     )
  // }
  let columns = [
    {
      dataField: "bookingId",
      text: "Booking Id",
      formatter: (cell, row) => {
        return <>{row?.booking?.bookingId ? row?.booking?.bookingId : "-"}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.booking?.bookingId ? row?.booking?.bookingId : "-",
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "username",
      text: "Fan / Funncar",
      formatter: (cell, row) => {
        return (
          <>
            {row?.type == "booking-created" &&
              (row?.user?.role != "user"
                ? `${row?.user?.professionalName}`
                : `${row?.user?.fullName}`)}
            {(row?.type == "funncar-payment") &&
              `${row?.user?.professionalName}`}
            {(row?.type == "booking-cancelled" && row?.paymentHistory && row?.booking?.bookingBy == 'user') && `${row?.user?.fullName}`}
            {(row?.type == "booking-cancelled" && row?.paymentHistory && row?.booking?.bookingBy != 'user') && `${row?.user?.professionalName}`}
            {(row?.type == "booking-cancelled" && !row?.paymentHistory) && `${row?.user?.professionalName}`}
              
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>  <>
      {row?.type == "booking-created" &&
        (row?.user?.role != "user"
          ? `${row?.user?.professionalName}`
          : `${row?.user?.fullName}`)}
      {(row?.type == "funncar-payment") &&
        `${row?.user?.professionalName}`}
            {(row?.type == "booking-cancelled" && row?.paymentHistory && row?.booking?.bookingBy == 'user') && `${row?.user?.fullName}`}
            {(row?.type == "booking-cancelled" && row?.paymentHistory && row?.booking?.bookingBy != 'user') && `${row?.user?.professionalName}`}
            {(row?.type == "booking-cancelled" && !row?.paymentHistory) && `${row?.user?.professionalName}`}
    </>,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
    },
    {
      dataField: "email",
      text: "Fan / Funncar Email",
      formatter: (cell, row) => {
        return <>{row?.user?.email}</>;
      },
      csvFormatter: (cell, row, rowIndex) => row?.user?.email,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      // }, {
      //     dataField: 'service',
      //     text: 'Service',
      //     formatter: (cell, row) => {
      //         return (<>
      //             {
      //                 row?.booking?.service?.name.includes("Video") ? row?.booking?.service?.name
      //                     : row?.booking?.service?.name + ' - ' + row?.booking?.eventType?.name
      //             }

      //         </>)
      //     },
      //     headerStyle: (colum, colIndex) => { return { width: '150px', } },
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => {
        return (
          <>
            {row?.type == "booking-created" &&
              "Booking Created (Fan/Funncar To Admin)"}
            {row?.type == "funncar-payment" &&
              "Funncar Payment (Admin To Funncar)"}
        
            {(row?.type == "booking-cancelled" && row?.paymentHistory) && "Booking Cancelled (Admin to Fan/Funncar)"}
            {(row?.type == "booking-cancelled" && !row?.paymentHistory) && "Booking Cancelled (Funncar To Admin)"}

          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
      <>
      {row?.type == "booking-created" &&
        "Booking Created (Fan/Funncar To Admin)"}
      {row?.type == "funncar-payment" &&
        "Funncar Payment (Admin To Funncar)"}
            {(row?.type == "booking-cancelled" && row?.paymentHistory) && "Booking Cancelled (Admin to Fan/Funncar)"}
            {(row?.type == "booking-cancelled" && !row?.paymentHistory) && "Booking Cancelled (Funncar To Admin)"}
    </>,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      sort: true,
    },
    {
      dataField: "type",
      text: "Type",
      formatter: (cell, row) => {
        return (
          <>
            {row?.type == "booking-created" && "Credited"}
            {row?.type == "funncar-payment" && " Debited"}
            {(row?.type == "booking-cancelled" && row?.paymentHistory) && "Debited "}
            {(row?.type == "booking-cancelled" && !row?.paymentHistory) && "Credited"}

          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
      <>
      {row?.type == "booking-created" && "Credited"}
      {row?.type == "funncar-payment" && " Debited"}
      {(row?.type == "booking-cancelled" && row?.paymentHistory) && "Debited "}
      {(row?.type == "booking-cancelled" && !row?.paymentHistory) && "Credited"}

    </>,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      },
      sort: true,
    },
    {
      dataField: "PKR_amount",
      text: "PKR Amount",
      formatter: (cell, row) => {
        return (
          <>
            <b>{numberWithCommas(row?.PKR_amount)}</b>
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        `${numberWithCommas(row?.PKR_amount)} `, // PKR
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
      sort: true,
    },
    {
      dataField: "USD_amount",
      text: "USD Amount",
      formatter: (cell, row) => {
        return (
          <>
            <b>
              {row?.USD_amount
                ? `${numberWithCommas(row?.USD_amount)}` //USD
                : `-`}
            </b>
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.USD_amount ? `${numberWithCommas(row?.USD_amount)}` : `-`, // USD
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
      sort: true,
    },
    {
      dataField: "mode",
      text: "Payment Mode",
      formatter: (cell, row) => {
        return <>
        {row?.type == "booking-created" ? `${row.booking?.paymentMode}` : '-'}
        </>;
      },
      csvFormatter: (cell, row, rowIndex) => <>
        {row?.type == "booking-created" ? `${row.booking?.paymentMode}` : '-'}
      </>,
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
    {
      dataField: 'action',
      text: 'view Notes',
      formatter: (cell, row) => { return CellMenu(cell, row) },
      headerStyle: (colum, colIndex) => { return { width: '120px', } },
      csvExport: false
  }
];

const openNotes = (notes) => {
  setAlertModalProps({
    ...AlertModalProps,
    open: true,
    title: "Notes",
    message: notes,
   
  });
};

const CellMenu = (cell, row) => {
  return (
    <>
        {row?.notes && <Button
          onClick={()=> openNotes(row?.notes)}
          className="btn_padding m-1"
          color="primary"
        >
          View Notes
        </Button>}
    </>
  );
};

  if (!user.isSuperAdmin) {
    columns = columns.filter(item => {
      if (item.dataField != 'email') {
        return item;
      }
    })
  }
  const exportColumns = [
    "Booking Id",
    "Booking Date",
    "Booking Service",
    "Fan / Funncar",
    ...(user.isSuperAdmin ? ['Fan / Funncar Email'] : []),
    "Status",
    "Type",
    "PRK Amount",
    "USD Amount",
    "Payment Mode",
    "Date",
  ];

  // const onCancel = (id) => {
  //     setAlertModalProps({
  //         ...AlertModalProps,
  //         open: true,
  //         title: "Cancel Booking",
  //         message: 'Are you sure you want to Cancel this Booking?',
  //         firstCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); CancelBooking(id) },
  //         secondCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); }
  //     })
  // }
  // const CancelBooking = (id) => {
  //     dispatch({ type: UPDATE_LOADING, payload: true });
  //     let body = { status: 'cancelled' }
  //     cancelBookingById(id, body).then(result => {
  //         dispatch({ type: UPDATE_LOADING, payload: false });
  //         if (result.data.status === true) {
  //             alert.success(result.data.message)
  //             getBookingsList();
  //         }
  //         else {
  //             alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
  //         }
  //     }).catch(error => {
  //         dispatch({ type: UPDATE_LOADING, payload: false });
  //         alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
  //     });
  // }

  const getTransactions = (status = "", bookingId = "") => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    getAllTransactions(getParamString(status, bookingId))
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
  const handleStatusChange = (e) => {
    const value = e.currentTarget.value;
    setStatus(value);
    setTableProps({
      ...tableProps,
      page: 1,
      sortName: "",
      sortOrder: "",
    });
    // getTransactions(value, search);
  };

  const onSearch = (value) => {
    setSearch(value);
    setTableProps({
      ...tableProps,
      page: 1,
      sortName: "",
      sortOrder: "",
    });
    // getTransactions(status, value);
    // if (value.length > 4) {
    //   getTransactions(status, value);
    // }
    // if (value.length == 0) {
    //   getTransactions(status, "");
    // }
  };

  useEffect(() => {
    getTransactions(status, search);
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
    status,
    search,
  ]);

  useEffect(() => {
    scrollToDiv("transactions-list-container");
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

  const getParamString = (status = "", bookingId = "", exportToCSV = "") => {
    let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}`;
    if (tableProps.sortName != "") {
      let order =
        tableProps.sortOrder == "desc"
          ? `-${tableProps.sortName}`
          : tableProps.sortName;
      paramString = `${paramString}&sort=${order}`;
    }
    if (status) paramString = `${paramString}&status=${status}`;
    if (bookingId) paramString = `${paramString}&bookingId=${bookingId}`;
    if (exportToCSV) paramString = `${paramString}&exportToCSV=${exportToCSV}`;
    return paramString;
  };

  const getExportListRows = (list) => {
    let data = [];
    for (let i in list) {
      let TempArray = [
        list[i].booking?.bookingId ? list[i].booking?.bookingId.toString() : "",
        moment(list[i].booking?.bookingStartTime).format("YYYY-MM-DD HH:mm"),
        list[i].booking?.service?.key.includes("Video")
          ? list[i].booking?.service?.name
          : list[i].booking?.service?.name +
            " - " +
            list[i].booking?.eventType?.name,
        list[i].type == "booking-created"
          ? list[i].user?.role != "user"
            ? `${list[i].user?.professionalName}`
            : `${list[i].user?.fullName}`
          : list[i].type == "funncar-payment" ||
            list[i].type == "booking-cancelled"
          ? `${list[i].user?.professionalName}`
          : "",
        ...(user.isSuperAdmin ? [list[i].user?.email] : []),
        list[i].type == "booking-created"
          ? "Booking Created (User To Admin)"
          : list[i].type == "funncar-payment"
          ? "Funncar Payment (Admin To Funncar)"
          : list[i].type == "booking-cancelled"
          ? "Booking Cancelled (Funncar To Admin)"
          : "",
        list[i].type == "booking-created" || list[i].type == "booking-cancelled"
          ? "Credited"
          : list[i].type == "funncar-payment"
          ? " Debited"
          : "",
        list[i].PKR_amount.toString(),
        list[i].USD_amount ? list[i].USD_amount.toString() : "",
        list[i].booking?.paymentMode ? list[i].booking?.paymentMode : "",
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getAllTransactions(getParamString(status, search, "true"))
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data),
            "Transactions"
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
  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      if (row?.booking?._id) history.push(`/admin/booking/${row?.booking?._id}`);
    },
  };

  return (
    <>
       <NotesModal
        {...AlertModalProps}
        setOpen={(resp) => {
          setAlertModalProps({ ...AlertModalProps, open: resp });
        }}
      /> 

      <GridContainer id="transactions-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <FormGroup
            row
            className="d-flex"
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={status}
                onChange={handleStatusChange}
              >
                <option value={""}>Transaction Type</option>
                {transactionStatuses.map((item, i) => {
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
              <h4 className={classes.cardTitleWhite}>All Transactions</h4>
            </CardHeader>
            <CardBody>
              <CustomeCSVExportbtn onClick={exportList} />
              <Table
                {...tableProps}
                onTableChange={handleTableChange}
                columns={columns}
                exportBtn={false}
                rowEvents={rowEvents}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
