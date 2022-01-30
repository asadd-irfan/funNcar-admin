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
import { videoCallRecordsOfBooking } from "../../actions/common";

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

export default function CallRecordsTable({ id }) {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
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
  // console.log('content',content)

  const getCallRecordsAgora = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    videoCallRecordsOfBooking(id)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
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
        dispatch({ type: UPDATE_LOADING, payload: false });
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg
        );
      });
  };

  useEffect(() => {
    getCallRecordsAgora();
  }, []);

  // const showModal = (msg) => {
  //     setModalProps({
  //         ...modalProps,
  //         open: true,
  //         title: "Comments",
  //         message: msg,
  //     })
  // }
  const columns = [
    {
      dataField: "duration",
      text: "Total Call Duration",
      formatter: (cell, row) => {
        return <>{new Date(row.duration * 1000).toISOString().substr(11, 8)}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        new Date(row.duration * 1000).toISOString().substr(11, 8),
    },
    {
      dataField: "start",
      text: "Start Time",
      formatter: (cell, row) => {
        return <>{moment(row?.startDateTime).format("lll")}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        moment(row?.startDateTime).format("lll"),
    },
    {
      dataField: "end",
      text: "End Time",
      formatter: (cell, row) => {
        return <>{moment(row?.endDateTime).format("lll")}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        moment(row?.endDateTime).format("lll"),
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

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Video Call Records </h4>
            </CardHeader>
            <CardBody>
              <Table
                {...tableProps}
                onTableChange={handleTableChange}
                columns={columns}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
