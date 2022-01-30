import React, { useState, useEffect } from "react";

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
import { subscribeEmailList } from "../../actions/common";

// import Card from '@material-ui/core/Card';

// import CardHeader from "@material-ui/core/CardHeader";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import Table from "../../common/tableRendrer";
import CardBody from "../../components/Card/CardBody.js";
import { scrollToDiv, ExportToCVS } from "../../common/commonMethods";
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

export default function SubscribeEmail() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();

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
    subscribeEmailList()
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
    scrollToDiv("subscriptionEmail-list-container");
  }, [tableProps.page, tableProps.sizePerPage]);

  const columns = [
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
  ];

  const exportColumns = ["Email"];

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
      let TempArray = [list[i].email];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    subscribeEmailList(getParamString("true"))
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data),
            "Subscription"
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
      <GridContainer id="subscriptionEmail-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Subscribe Email List</h4>
            </CardHeader>
            <CardBody>
              <CustomeCSVExportbtn onClick={exportList} />
              <Table
                {...tableProps}
                onTableChange={handleTableChange}
                columns={columns}
                exportBtn={false}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
