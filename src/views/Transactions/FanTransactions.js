import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useDispatch } from "react-redux";
import { getUserTransactions } from "../../actions/payments";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";
import Table from "../../common/tableRendrer";
import moment from "moment";
import { numberWithCommas } from "../../common/commonMethods";
import NotesModal from "../../components/Modals/NotesModal";
import Button from "../../components/CustomButtons/Button.js";

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

export default function FanTransactions({ id, role, user, authUser }) {
  const alert = useAlert();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

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
  const columns = [
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
        return { width: "150px" };
      },
    },
    {
      dataField: "",
      text: "Fan",
      csvFormatter: (cell, row, rowIndex) =>
        user?.fullName ? user?.fullName : "",
      hidden: true,
    },
    {
      dataField: "",
      text: `Fan Email`,
      csvFormatter: (cell, row, rowIndex) => user?.email,
      hidden: true,
      csvExport: authUser.isSuperAdmin,
    },
    {
      dataField: "type",
      text: "Status",
      formatter: (cell, row) => {
        return <>{row?.status}</>;
      },
      csvFormatter: (cell, row, rowIndex) => row?.status,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      sort: true,
    },
    {
      dataField: "transactionType",
      text: "Type",
      formatter: (cell, row) => {
        return <>{row?.type || '-'}</>;
      },
      csvFormatter: (cell, row, rowIndex) => row?.type || '-',
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
        `${numberWithCommas(row?.PKR_amount)}`,
      headerStyle: (colum, colIndex) => {
        return { width: "90px" };
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
      csvFormatter: (cell, row, rowIndex) =>
        row?.type == "debit" && row?.status == "paid"
          ? `${row.booking?.paymentMode}`
          : "-",
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
    let paramString = `?type=all`;
    // let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}`;
    if (tableProps.sortName != "") {
      let order =
        tableProps.sortOrder == "desc"
          ? `-${tableProps.sortName}`
          : tableProps.sortName;
      paramString = `${paramString}&sort=${order}`;
    }
    getUserTransactions(id, paramString)
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
    getTransactions();
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
  ]);

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

      {/* <GridContainer> */}
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>{role} All Transactions</h4>
          </CardHeader>
          <CardBody>
            <Table
              {...tableProps}
              onTableChange={handleTableChange}
              columns={columns}
              rowEvents={rowEvents}
            />
          </CardBody>
        </Card>
      </GridItem>
      {/* </GridContainer> */}
    </>
  );
}
