import React, { useState, useEffect, useRef } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
// import Card1 from "../../components/Card/Card.js";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from "react-alert";
import { APP_ERROR_MSGS, BASE_URL } from "../../common/constants";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { videoCallRecordsList } from "../../actions/common";

// import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
// import CardHeader from "@material-ui/core/CardHeader";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import Table from "../../common/tableRendrer";
import CardBody from "../../components/Card/CardBody.js";
import moment from "moment";
import Dialog from "../../components/Modals/ErrorModal";
import FormGroup from "@material-ui/core/FormGroup";
import { scrollToDiv } from "../../common/commonMethods";

const styles = {
  root: {
    minWidth: 275,
    paddingTop: 15,
    marginTop: 15,
    marginBottom: 5,
    paddingBottom: 5,
  },

  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginLeft: 55,
  },
};
const useStyles = makeStyles(styles);

export default function CallRecordsTable() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState(history.location.state?.backRedirection?.search ?? "");

  const [modalProps, setModalProps] = useState({
    open: false,
    title: "",
    message: "",
  });
  // state
  const [tableProps, setTableProps] = useState({
    data: [],
    page: 1,
    sizePerPage: 20,
    totalSize: 0,
    loading: false,
    sortName: "",
    sortOrder: "",
  });

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

  const getCallRecordsAgora = (bookingId = "") => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    let paramString = ``;

    if (bookingId && bookingId != "") {
      paramString = `?bookingId=${bookingId}`;
    }
    // dispatch({ type: UPDATE_LOADING, payload: true });
    videoCallRecordsList(paramString)
      .then((result) => {
        setTableProps({ ...tableProps, loading: false });
        // dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          // Populate Table
          setTableProps({
            ...tableProps,
            data: result.data.data ? result.data.data : [],
            totalSize: result.data.data ? result.data.totalCount : 0,
            loading: false,
          });

          // setTableProps({ ...tableProps, data: [] });
          // setTimeout(() => {
          //   setTableProps({
          //     ...tableProps,
          //     data: result.data.data ? result.data.data : [],
          //     totalSize: result.data.data ? result.data.totalCount : 0,
          //   });
          // }, 30);
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
        // dispatch({ type: UPDATE_LOADING, payload: false });
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg
        );
      });
  };

  const onSearch = (value) => {
    setSearch(value);
    // getCallRecordsAgora(value);
    // if (value.length > 4) {
    //   getCallRecordsAgora(value);
    // }
    // if (value.length == 0) {
    //   getCallRecordsAgora();
    // }
  };

  const showBooking = (id) => {
    let state ={
      redirectToURL: `/admin/call-records`,
      data: { search },
      search: ""
    }
    let pathName = `/admin/booking/${id}`
    history.push({
      pathname: pathName,
      state: { backRedirection: state }
    })
    // history.push("/admin/booking/" + id);
  };

  useEffect(() => {
    getCallRecordsAgora(search);
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
    search
  ]);

  useEffect(() => {
    scrollToDiv("callRecords-list-container");
  }, [tableProps.page, tableProps.sizePerPage]);

  // const showModal = (msg) => {
  //     setModalProps({
  //         ...modalProps,
  //         open: true,
  //         title: "Comments",
  //         message: msg,
  //     })
  // }
  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      showBooking(row?.booking._id);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        <button
          data-toggle="tooltip"
          title="View"
          className="pd-setting-ed"
          onClick={() => showBooking(row?.booking._id)}
        >
          <i className="fa fa-eye" aria-hidden="true"></i>
        </button>
      </>
    );
  };
  const columns = [
    {
      dataField: "i",
      text: "Booking Id",
      formatter: (cell, row) => {
        return <>{row.booking?.bookingId}</>;
      },
      csvFormatter: (cell, row, rowIndex) => row.booking?.bookingId,
    },
    {
      dataField: "uname",
      text: "Booking Person",
      formatter: (cell, row) => {
        return (
          <>
            {row.booking?.user.role == "user"
              ? row.booking?.user.fullName
              : row.booking?.user.professionalName}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row.booking?.user.role == "user"
          ? row.booking?.user.fullName
          : row.booking?.user.professionalName,
    },
    {
      dataField: "fname",
      text: "Funncar",
      formatter: (cell, row) => {
        return <>{row.booking?.funncar.professionalName}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row.booking?.funncar.professionalName,
    },
    {
      dataField: "duration",
      text: "Total Call Duration",
      // sort: true,
    },
    {
      dataField: "actions",
      text: "View Details",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      csvExport: false,
    },
  ];

  return (
    <>
      <Dialog
        {...modalProps}
        setOpen={(resp) => {
          setModalProps({ ...modalProps, open: resp });
        }}
      />

      <GridContainer id="callRecords-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <FormGroup
            row
            className="d-flex"
            style={{ justifyContent: "flex-end" }}
          >
            <input
              type="number"
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
              <h4 className={classes.cardTitleWhite}>
                AGORA Video Call Records{" "}
              </h4>
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
      </GridContainer>
    </>
  );
}
