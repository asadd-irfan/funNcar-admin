import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useSelector, useDispatch } from "react-redux";
import { getTableStats } from "../../actions/common";
import Table from "../../common/tableRendrer";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";
import { UPDATE_LOADING } from "../../actions/types";
import { Link } from "react-router-dom";
import { convertDateFormate, ConvertToCurrency, ExportToCVS, convertArrayToString } from "../../common/commonMethods";
import { useHistory } from "react-router-dom";
import CustomeCSVExportbtn from "../../common/CustomeCSVExportbtn";
import moment from "moment";

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

export default function ApprovalAndVerificationList({
  startDate,
  endDate,
  selectedFilterVal,
  btnClickChange,
}) {
  // Hooks
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(state => state.auth.user);
  const sizePerPageList = [
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
  ];

  const exportColumns = [
    "Id",
    "First Name",
    "Last Name",
    "Professional Name",
    ...(user.isSuperAdmin ? ['Phone'] : []),
    ...(user.isSuperAdmin ? ['Email'] : []),
    "Gender",
    "Country",
    "City",
    "Bio",
    "Notes",
    "Popular",
    "Profile Completed",
    "Verified",
    "Profile Approved",
    "Request For Approval",
    "Request For Verification",
    "Average Rate",
    "Average Rating",
    // "Attend Private Parties",
    "Service Charges",
    "Main Category",
    "Achievements",
    "MNG Services",
    "Services",
    "Categories",
    "Sub Categories",
    "Includes",
    "Excludes",
    "Registered From Device",
    "Last Login Device",
    "Profile Status",
    "Total Earned",
    "Current Balance",
    "Created On",
  ];

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
  const [isApprovalListView, setIsApprovalListView] = useState(true);

  // variables and functions
  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      let page = row.role == "funncar" ? "funncar" : "performer";
      history.push(`/admin/${page}/${row.id}`);
    },
  };
  const CellMenu = (cell, row) => {
    let page = row.role == "funncar" ? "funncar" : "performer";
    return (
      <>
        {/* <Link to={`/admin/${page}/${row.id}`} target="_blank"> */}
          <button onClick={()=> handleListBtnClick(`/admin/${page}/${row.id}`)} data-toggle="tooltip" title="View" className="pd-setting-ed">
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
        {/* </Link> */}
      </>
    );
  };
  const columns = [
    // {
    //   dataField: "id",
    //   text: "Id",
    // },
    {
      dataField: "professionalName",
      text: "Name",
      sort: true,
    },
    {
      dataField: "role",
      text: "Type",
      formatter: (cell, row) => {
        return row.role == "funncar" ? "Funncar" : "Performer";
      },
      csvFormatter: (cell, row, rowIndex) =>
        row.role == "funncar" ? "Funncar" : "Performer",
      sort: true,
    },
    {
      dataField: "mainCategory.name",
      text: "Category",
    },
    {
      dataField: "createdAt",
      text: "Date",
      headerStyle: (colum, colIndex) => {
        return { width: "90px" };
      },
      formatter: (cell, row) => {
        return convertDateFormate(cell, 2);
      },
      csvFormatter: (cell, row, rowIndex) => convertDateFormate(cell, 2),
      sort: true,
    },
    {
      dataField: "action",
      text: "",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      csvExport: false,
    },
  ];
  const handleListBtnClick = (url) =>{
    let state ={
      redirectToURL: `/admin/dashboard`,
      data: { startDate, endDate, selectedFilterVal },
      search: "" 
    }
    history.push({
      pathname: url,
      state: { backRedirection: state }
    })
  }

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
        // sizePerPage: newState.sizePerPage,
      });
    }
  };
  const getParamString = (Key,  page = 1, exportToCSV = "" ) => {
    let paramString = `type=${selectedFilterVal}&key=${Key}&page=${page}`;
    if (selectedFilterVal == "custom") {
      paramString =
        paramString +
        `&startDate=${convertDateFormate(
          startDate
        )}&endDate=${convertDateFormate(endDate)}`;
    }
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
  const populateTable = (page, Key) => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    getTableStats(getParamString(Key, page))
      .then((result) => {
        if (result.data.status === true) {
          setTableProps({
            ...tableProps,
            data: result.data.data ? result.data.data.tableResult : [],
            totalSize: result.data.data ? result.data.totalCount : 0,
            loading: false,
            page: page,
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
    populateTable(
      tableProps.page,
      isApprovalListView ? "approveTable" : "verifyTable"
    );
  }, [tableProps.page]); // , tableProps.sizePerPage
  useEffect(() => {
    populateTable(1, isApprovalListView ? "approveTable" : "verifyTable");
  }, [btnClickChange, tableProps.sortName, tableProps.sortOrder]);

  const getExportListRows = (list) => {
    let data = [];
    for (let i in list) {
      let TempArray = [
        list[i].id.toString(),
        list[i].firstName,
        list[i].lastName,
        list[i].professionalName,
        ...(user.isSuperAdmin ? [list[i].phone.toString()] : []),
        ...(user.isSuperAdmin ? [list[i].email] : []),
        list[i].gender,
        list[i].country ? list[i].country : "",
        list[i].city ? list[i].city : "",
        list[i].bio ? list[i].bio.replace(/,/g, "") : "",
        list[i].notes ? list[i].notes.replace(/,/g, "") : "",
        list[i].isPopular ? "Yes" : "No",
        list[i].isProfileCompleted ? "Yes" : "No",
        list[i].isVerified ? "Yes" : "No",
        list[i].profileApproved.status ? "Yes" : "No",
        list[i].requestForApproval ? "Yes" : "No",
        list[i].requestForVerification ? "Yes" : "No",
        list[i].averageRate,
        list[i].averageRating,
        // list[i].attendPrivateParties ? "Yes" : "No",
        list[i].serviceCharges?.status ? "Yes" : "No",
        list[i].mainCategory?.name ? list[i].mainCategory?.name : "",
        convertArrayToString(list[i].achievements," | "),
        convertArrayToString(list[i].mngServices," | ", "name"),
        convertArrayToString(list[i].services," | ", "name"),
        convertArrayToString(list[i].categories," | ", "name"),
        convertArrayToString(list[i].subCategories," | ", "name"),
        list[i].includes ? list[i].includes.replace(/,/g, "") : "",
        list[i].excludes ? list[i].excludes.replace(/,/g, "") : "",
        list[i].registeredFromDevice ? list[i].registeredFromDevice : "",
        list[i].lastLoginDevice ? list[i].lastLoginDevice : "",
        list[i].profileStatus ? list[i].profileStatus : "",
        list[i].wallet?.totalEarned,
        list[i].wallet?.currentBalance,
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getTableStats(getParamString(isApprovalListView ? "approveTable" : "verifyTable", 1 ,"true"))
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data ? result.data.data.tableResult : []),
            isApprovalListView ? "Pending For Profile Approval" : "Pending For Profile Verification"
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
      <Card className="card-height-fixed">
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            Pending For Profile Approval And Verification
          </h4>
        </CardHeader>
        <CardBody>
          <div>
            <label className="custome-radio-container">
              For Approval
              <input
                type="radio"
                name="App_veri_Radio"
                defaultChecked={isApprovalListView}
                onClick={() => {
                  setIsApprovalListView(true);
                  populateTable(1, "approveTable");
                }}
              />
              <span className="checkmark"></span>
            </label>
            <label className="custome-radio-container">
              For Verification
              <input
                type="radio"
                name="App_veri_Radio"
                defaultChecked={!isApprovalListView}
                onClick={() => {
                  setIsApprovalListView(false);
                  populateTable(1, "verifyTable");
                }}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="Dashboard-Table">
           <CustomeCSVExportbtn onClick={exportList} />
            <Table
              {...tableProps}
              onTableChange={handleTableChange}
              columns={columns}
              isTotalShow={false}
              sizePerPageList={sizePerPageList}
              rowEvents={rowEvents}
              exportBtn={false}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
