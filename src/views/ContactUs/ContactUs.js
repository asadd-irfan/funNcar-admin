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
import { contactUsList } from "../../actions/common";

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
import {
  scrollToDiv,
  ExportToCVS,
  convertArrayToString,
} from "../../common/commonMethods";
import CustomeCSVExportbtn from "../../common/CustomeCSVExportbtn";

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

export default function ContactUs() {
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
  const [contactUsData, setContactUsData] = useState(null);
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

  const getContactUsData = () => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    // dispatch({ type: UPDATE_LOADING, payload: true });
    contactUsList(getParamString())
      .then((result) => {
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

  useEffect(() => {
    getContactUsData();
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
  ]);

  useEffect(() => {
    scrollToDiv("contactUs-list-container");
  }, [tableProps.page, tableProps.sizePerPage]);

  const showModal = (msg) => {
    setModalProps({
      ...modalProps,
      open: true,
      title: "Comments",
      message: msg,
    });
  };

  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      showModal(row?.comments);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        <button
          data-toggle="tooltip"
          title="View"
          className="pd-setting-ed"
          onClick={() => {
            showModal(row?.comments);
          }}
        >
          <i className="fa fa-eye" aria-hidden="true"></i>
        </button>
      </>
    );
  };
  const columns = [
    {
      dataField: "fullName",
      text: "User Name",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      formatter: (cell, row) => {
        return <>{cell ? <a href={`mailto:${cell}`}>{cell}</a> : ""}</>;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "160px" };
      },
    },
    {
      dataField: "phone",
      text: "Phone no",
    },
    {
      dataField: "comments",
      text: "Message",
      formatter: (cell, row) => {
        return (
          <>
            {row?.comments.length > 180
              ? `${row?.comments.substring(0, 180)} ...`
              : row?.comments}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.comments.length > 180
          ? `${row?.comments.substring(0, 180)} ...`
          : row?.comments,
      headerStyle: (colum, colIndex) => {
        return { width: "300px", height: "100px" };
      },
    },
    {
      dataField: "sentFromApp",
      text: "From",
      formatter: (cell, row) => {
        return <>{cell ? cell : "Mobile App"}</>;
      },
      csvFormatter: (cell, row, rowIndex) => (cell ? cell : "Mobile App"),
    },
    {
      dataField: "createdAt",
      text: "Date",
      formatter: (cell, row) => {
        return <>{moment(row?.createdAt).format("LL")}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        moment(row?.createdAt).format("LL"),
      sort: true,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
  ];

  const exportColumns = [
    "User Name",
    "Email",
    "Phone no",
    "Message",
    "From",
    "Date",
  ];

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
        list[i].fullName,
        list[i].email,
        list[i].phone,
        list[i].comments ? list[i].comments.replace(/,/g, "") : "",
        list[i].sentFromApp ? list[i].sentFromApp : "Mobile App",
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    contactUsList(getParamString("true"))
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data),
            "Contact Us"
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
      <Dialog
        {...modalProps}
        setOpen={(resp) => {
          setModalProps({ ...modalProps, open: resp });
        }}
      />

      <GridContainer id="contactUs-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>ContactUs List</h4>
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
