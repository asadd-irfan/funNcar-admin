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
import { getAllCoupons } from "../../actions/bookings";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import AlertDialog from "../../components/Modals/AlertModal";
import Table from "../../common/tableRendrer";
import Chip from "@material-ui/core/Chip";
import { UPDATE_LOADING } from "../../actions/types";
import moment from "moment";
import { scrollToDiv, ExportToCVS, convertArrayToString } from "../../common/commonMethods";
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

export default function Coupons() {
  const history = useHistory();
  const alert = useAlert();
  const classes = useStyles();
  const dispatch = useDispatch();

  // state
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
      history.push(`/admin/coupon/${row.id}`);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        {/* <Link to={`/admin/coupon/${row.id}`}> */}
          <button onClick={()=> handleListBtnClick(row.id)} data-toggle="tooltip" title="Edit" className="pd-setting-ed">
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </button>
        {/* </Link> */}
      </>
    );
  };
  const handleListBtnClick = (id) =>{
    let state ={
      redirectToURL: `/admin/coupons`,
      data: null,
      search: "" 
    }
    let pathName = `/admin/coupon/${id}`
    history.push({
      pathname: pathName,
      state: { backRedirection: state }
    })
  }

  const columns = [
    {
      dataField: "code",
      text: "Coupon Code",
      sort: true,
    },
    {
      dataField: "usageLimitPerCoupon",
      text: "Usage Limit Per Coupon",
      sort: true,
    },
    {
      dataField: `percentageDiscount`,
      text: "Percentage Discount",
      formatter: (cell, row) => {
        return <>{row?.percentageDiscount + " %"}</>;
      },
      csvFormatter: (cell, row, rowIndex) => row?.percentageDiscount + " %",
      sort: true,
    },
    {
      dataField: "expiryDate",
      text: "Expiry Date",
      formatter: (cell, row) => {
        return <>{moment(row?.expiryDate).format("LL")}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        moment(row?.expiryDate).format("LL"),
      sort: true,
    },
    {
      dataField: "createdAt",
      text: "Created Date",
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
      dataField: "isActive",
      text: "Is Active",
      formatter: (cell, row) => {
        return <>{row?.isActive ? "Active" : "In Active"}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row?.isActive ? "Active" : "In Active",
      csvExport: false,
      sort: true,
    },
    {
      dataField: "actions",
      text: "Update",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      csvExport: false,
    },
  ];

  const exportColumns = [
    "Coupon Code",
    "Usage Limit Per Coupon",
    "Percentage Discount",
    "Expiry Date",
    "Created Date",
    "Active",
  ];

  const getCouponDetails = () => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    getAllCoupons(getParamString())
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
    getCouponDetails();
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
  ]);

  useEffect(() => {
    scrollToDiv("coupons-list-container");
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
        list[i].code.toString(),
        list[i].usageLimitPerCoupon.toString(),
        list[i].percentageDiscount + " %",
        moment(list[i].expiryDate).format("YYYY-MM-DD"),
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
        list[i].isActive ? "Yes" : "No",
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getAllCoupons(getParamString("true"))
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data),
            "Coupons"
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

      <GridContainer id="coupons-list-container">
        {/* <GridItem xs={0} sm={0} md={10}></GridItem> */}
        <GridItem xs={12} sm={12} md={12} style={{ display: "flex", justifyContent: 'end' }}>
          <Link
            style={{ float: "right" }}
            className="link-btn"
            to="/admin/add_coupon"
          >
            Create New Coupon
          </Link>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>All Coupons </h4>
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
