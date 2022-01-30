import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useDispatch } from "react-redux";
import { getPaymentRequests } from "../../actions/payments";
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
import { useHistory } from "react-router-dom";
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

export default function ALLTransactions() {
  const history = useHistory();
  const alert = useAlert();
  const classes = useStyles();
  const dispatch = useDispatch();

  // state
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

  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      history.push(`/admin/payment-request/${row._id}`);
    },
  };
  const CellMenu = (row) => {
    return (
      <>
        {/* <Link to={`/admin/payment-request/${row._id}`}> */}
          <Button
            onClick={()=> handleListBtnClick(row.id)}
            className="btn_padding m-1"
            color={row?.isPaid ? "success" : "primary"}
          >
            {row?.isPaid ? "view" : "Send Payment"}
          </Button>
        {/* </Link> */}
      </>
    );
  };
  const handleListBtnClick = (id) =>{
    let state ={
      redirectToURL: `/admin/payment-requests`,
      data: null,
      search: "" 
    }
    let pathName = `/admin/payment-request/${id}`
    history.push({
      pathname: pathName,
      state: { backRedirection: state }
    })
  }

  const columns = [
    {
      dataField: "username",
      text: "Funncar Name",
      formatter: (cell, row) => {
        return <>{`${row?.funncarId?.professionalName}`}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        `${row?.funncarId?.professionalName}`,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
    },
    {
      dataField: "email",
      text: "Email",
      formatter: (cell, row) => {
        return <>{row?.email ? row?.email : row?.funncarId?.email}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.email ? row?.email : row?.funncarId?.email,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
    },
    {
      dataField: "wallet",
      text: "Current Wallet Balance",
      formatter: (cell, row) => {
        return <>{row?.funncarId?.wallet?.currentBalance || 0}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.phone ? row?.phone : row?.funncarId?.phone,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
    },
    // {
    //   dataField: "phone",
    //   text: "Phone",
    //   formatter: (cell, row) => {
    //     return <>{row?.phone ? row?.phone : row?.funncarId?.phone}</>;
    //   },
    //   csvFormatter: (cell, row, rowIndex) =>
    //     row?.phone ? row?.phone : row?.funncarId?.phone,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "130px" };
    //   },
    // },
    {
      dataField: "bankName",
      text: "Bank Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
    },
    {
      dataField: "accountNumber",
      text: "Account Number / IBAN",
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
      sort: true,
    },
    {
      dataField: "amount",
      text: "Request Amount",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
    },
    {
      dataField: "amount-paid",
      text: "Paid Amount",
      formatter: (cell, row) => {
        return (
          <>
            {row?.isPaid
              ? row?.otherAmount
                ? row?.otherAmount
                : row?.amount
              : "-"}
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "110px" };
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.isPaid ? (row?.otherAmount ? row?.otherAmount : row?.amount) : "-",
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
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => {
        return <>{CellMenu(row)}</>;
      },
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      },
    },
  ];

  const exportColumns = [
    "Funncar Name",
    "Email",
    "Current Wallet Balance",
    "Bank Name",
    "Account Number / IBAN",
    "Request Amount",
    "Paid Amount",
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

  const getAllPaymentRequests = () => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    getPaymentRequests(getParamString())
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

  useEffect(() => {
    getAllPaymentRequests();
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
  ]);

  useEffect(() => {
    scrollToDiv("paymentRequests-list-container");
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

  const getParamString = (exportToCSV = "") => {
    let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}`;
    if (tableProps.sortName != "") {
      let order =
        tableProps.sortOrder == "desc"
          ? `-${tableProps.sortName}`
          : tableProps.sortName;
      paramString = `${paramString}&sort=${order}`;
    }
    if (exportToCSV) paramString = `${paramString}&exportToCSV=${exportToCSV}`;
    return paramString;
  };

  const getExportListRows = (list) => {
    let data = [];
    for (let i in list) {
      let TempArray = [
        list[i].funncarId?.professionalName,
        list[i].email ? list[i].email : list[i].funncarId?.email,
        list[i].funncarId?.wallet?.currentBalance ? list[i].funncarId?.wallet?.currentBalance.toString() : "",
        list[i].bankName,
        list[i].accountNumber,
        list[i].amount.toString(),
        list[i].isPaid
          ? list[i].otherAmount
            ? list[i].otherAmount.toString()
            : list[i].amount.toString()
          : "",
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getPaymentRequests(getParamString("true"))
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data),
            "Payment Requests"
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

  return (
    <>
      <AlertDialog
        {...AlertModalProps}
        setOpen={(resp) => {
          setAlertModalProps({ ...AlertModalProps, open: resp });
        }}
      />

      <GridContainer id="paymentRequests-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>All Payment Requests</h4>
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
