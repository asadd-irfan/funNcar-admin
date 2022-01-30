import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import FormGroup from "@material-ui/core/FormGroup";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
// import { useDispatch } from "react-redux";
import { getFunncarWalletHistory } from "../../actions/payments";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";
// import Table from "../../common/tableRendrer";
import ClientSideTableRendrer from "../../common/clientSideTableRendrer";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Button from "../../components/CustomButtons/Button.js";
import NotesModal from "../../components/Modals/NotesModal";
import {
  numberWithCommas,
  scrollToDiv,
  convertDateFormate,
} from "../../common/commonMethods";
import DatePicker from "react-datepicker";

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

export default function UserTransactions({
  id,
  role,
  user,
  authUser,
  containerId = "userWalletTransactions_Container",
}) {
  const alert = useAlert();
  const history = useHistory();
  const classes = useStyles();
  // const dispatch = useDispatch();
  const transactionStatuses = [
    { value: "all", label: "All" },
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];
  const [AlertModalProps, setAlertModalProps] = useState({
    open: false,
    title: "",
    message: "",
  });

  // state
  const [status, setStatus] = useState("all");
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
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

  // variables and functions
  const columns = [
    {
      dataField: "bookingId",
      text: "Booking Id",
      formatter: (cell, row) => {
        return <>{row?.booking?.bookingId ? row?.booking?.bookingId : "-"}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.booking?.bookingId ? row?.booking?.bookingId : "",
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      },
    },
    {
      dataField: "",
      text: "Booking Date",
      csvFormatter: (cell, row, rowIndex) =>
        row?.booking?.bookingStartTime
          ? moment(row?.booking?.bookingStartTime).format("llll")
          : "",
      hidden: true,
    },
    {
      dataField: "service",
      text: "Service",
      formatter: (cell, row) => {
        return (
          <>
            {row?.booking
              ? row?.booking?.service?.key.includes("Video")
                ? row?.booking?.service?.name
                : row?.booking?.service?.name +
                  " - " +
                  row?.booking?.eventType?.name
              : "-"}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.booking
          ? row?.booking?.service?.key.includes("Video")
            ? row?.booking?.service?.name
            : row?.booking?.service?.name +
              " - " +
              row?.booking?.eventType?.name
          : "-",
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      },
    },
    {
      dataField: "",
      text: role,
      csvFormatter: (cell, row, rowIndex) =>
        user?.professionalName ? user?.professionalName : "",
      hidden: true,
    },
    {
      dataField: "",
      text: `${role} Email`,
      csvFormatter: (cell, row, rowIndex) => user?.email,
      hidden: true,
      csvExport: authUser.isSuperAdmin,
    },
    {
      dataField: "type",
      text: "Type",
      formatter: (cell, row) => {
        return <>{row?.type || '-'}</>;
      },
      csvFormatter: (cell, row, rowIndex) => row?.type || '-',
      headerStyle: (colum, colIndex) => {
        return { width: "95px" };
      },
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => {
        return (
          <>
            {row?.status == "in-progress"
              ? `${row?.status} (Payment Request to Admin)`
              : row?.status}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.status == "in-progress"
          ? `${row?.status} (Payment Request to Admin)`
          : row?.status,
      headerStyle: (colum, colIndex) => {
        return { width: "105px" };
      },
      sort: true,
    },
    {
      dataField: "netAmount",
      text: "Net Amount",
      formatter: (cell, row) => {
        return <>{row?.booking?.totalCost}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.booking?.totalCost ? row?.booking?.totalCost : "",
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      },
    },
    {
      dataField: "percentageOnActualPrice",
      text: "Percentage",
      formatter: (cell, row) => {
        return <>{cell ? `${cell}%` : ""}</>;
      },
      csvFormatter: (cell, row, rowIndex) => `${cell ? `${cell}%` : ""}`,
      headerStyle: (colum, colIndex) => {
        return { width: "96px" };
      },
    },
    {
      dataField: "PKR_amount",
      text: "PKR Amount",
      formatter: (cell, row) => {
        return <b>{numberWithCommas(row?.PKR_amount)}</b>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.PKR_amount ? `${numberWithCommas(row?.PKR_amount)}` : "",
      headerStyle: (colum, colIndex) => {
        return { width: "115px" };
      },
      sort: true,
    },
    {
      dataField: "USD_amount",
      text: "USD Amount",
      formatter: (cell, row) => {
        return (
          <b>
            {row?.USD_amount ? `${numberWithCommas(row?.USD_amount)}` : `-`}
          </b>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.USD_amount ? `${numberWithCommas(row?.USD_amount)}` : ``,
      headerStyle: (colum, colIndex) => {
        return { width: "115px" };
      },
      sort: true,
    },
    {
      dataField: "mode",
      text: "Payment Mode",
      formatter: (cell, row) => {
        return (
          <>
            {row?.type == "debit" && row?.status == "paid"
              ? `${row.booking?.paymentMode}`
              : "-"}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) => {
        return row?.type == "debit" && row?.status == "paid"
          ? `${row.booking?.paymentMode}`
          : "-";
      },

      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
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
      dataField: "action",
      text: "view Notes",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      },
      csvExport: false,
    },
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
        {row?.notes && (
          <Button
            onClick={() => openNotes(row?.notes)}
            className="btn_padding m-1"
            color="primary"
          >
            View Notes
          </Button>
        )}
      </>
    );
  };
  const getTransactions = () => {
    setTableProps({ ...tableProps, loading: true, data: [] });

    let paramString = `?startDate=${convertDateFormate(
      startDate
    )}&endDate=${convertDateFormate(endDate)}`;
    if (status) paramString += `&type=${status}`;

    getFunncarWalletHistory(id, paramString)
      .then((result) => {
        if (result.data.status === true) {
          // Populate Table
          setTotal(result.data.data?.totalAmount);
          setTableProps({
            ...tableProps,
            data: result.data.data.walletHistory
              ? result.data.data.walletHistory
              : [],
            loading: false,
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
    getTransactions();
  }, [status, startDate, endDate]);

  const handleTableChange = () => {
    scrollToDiv(containerId);
  };

  const handleStatusChange = (e) => {
    setStatus(e.currentTarget.value);
  };
  const handleDateChange = (date, label) => {
    let dateVal = date == "" || date == null ? new Date() : date;
    if (label == "endDate") setEndDate(dateVal);
    else {
      setStartDate(dateVal);
      if (dateVal > endDate) setEndDate(dateVal);
    }
  };

  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      if (row?.booking?._id)
        history.push(`/admin/booking/${row?.booking?._id}`);
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
      <GridItem xs={12} sm={12} md={12} id={containerId}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              {role} All Transactions / Wallet History
            </h4>
          </CardHeader>
          <CardBody>
            <FormGroup
              row
              className="d-flex"
              style={{ justifyContent: "space-between" }}
            >
              <GridItem xs={12} sm={6} md={4}>
                <span>Type: </span>
                <select
                  style={{ height: "35px", minWidth: "200px" }}
                  value={status}
                  onChange={handleStatusChange}
                >
                  {transactionStatuses.map((item, i) => {
                    return (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    );
                  })}
                </select>
              </GridItem>
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
            </FormGroup>

            {status != "all" && (
              <GridItem xs={12} sm={12} md={12} className="mt-3">
                <h4>
                  Total Amount {status} : {total}
                </h4>
              </GridItem>
            )}

            <ClientSideTableRendrer
              {...tableProps}
              columns={columns}
              isPagination={true}
              onPageChange={handleTableChange}
              onSizePerPageChange={handleTableChange}
              rowEvents={rowEvents}
            />
          </CardBody>
        </Card>
      </GridItem>
    </>
  );
}
