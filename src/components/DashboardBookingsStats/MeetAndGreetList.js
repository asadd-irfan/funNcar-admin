import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import {
  convertDateFormate,
  ConvertToCurrency,
  ExportToCVS,
} from "../../common/commonMethods";
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

export default function MeetAndGreetList({
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
  const { USD_rate } = useSelector((state) => state.auth.appSettings);

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
    "Booking Id",
    "Booking Cost in PKR",
    "Booking Cost in USD",
    "Booking Date",
    "Created On",
    "Discount",
    "Funncar",
    "Notes",
    "On Tour Booking",
    "Payment Mode",
    "Service",
    "Status",
    "Booking Person",
    "Booking By",
    "Accepted",
    "Public Video",
    "Rating Given",
    "Marked Done",
    "Video For",
    "Video Message",
    "Video Message Delivery Date",
    "Video My Name",
    "Video Dedicated To",
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

  // variables and functions
  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      history.push(`/admin/booking/${row.id}`);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        {/* <Link to={`/admin/booking/${row.id}`} target="_blank"> */}
        <button
          onClick={() => handleListBtnClick(row.id)}
          data-toggle="tooltip"
          title="View"
          className="pd-setting-ed"
        >
          <i className="fa fa-eye" aria-hidden="true"></i>
        </button>
        {/* </Link> */}
      </>
    );
  };
  const columns = [
    {
      dataField: "bookingId",
      text: "Booking Id",
      sort: true,
    },
    {
      dataField: "user.fullName",
      text: "Fan",
      formatter: (cell, row) => {
        return (
          <>
            {row.bookingBy === "user"
              ? row.user?.fullName
              : row.user?.professionalName}
          </>
        );
      },
      csvFormatter: (cell, row, rowIndex) =>
        row.bookingBy === "user"
          ? row.user?.fullName
          : row.user?.professionalName,
    },
    {
      dataField: "funncar.professionalName",
      text: "Celebrity",
    },
    {
      dataField: "service.name",
      text: "Service",
    },
    {
      dataField: "totalCost",
      text: "Rs",
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
  const handleListBtnClick = (id) => {
    let state = {
      redirectToURL: `/admin/dashboard`,
      data: { startDate, endDate, selectedFilterVal },
      search: "",
    };
    let pathName = `/admin/booking/${id}`;
    history.push({
      pathname: pathName,
      state: { backRedirection: state },
    });
  };

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

  const getParamString = (page = 1, exportToCSV = "") => {
    let paramString = `type=${selectedFilterVal}&key=mngTable&page=${page}`;
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
  const populateTable = (page) => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    getTableStats(getParamString(page))
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
    populateTable(tableProps.page);
  }, [tableProps.page]); // , tableProps.sizePerPage
  useEffect(() => {
    populateTable(1);
  }, [btnClickChange, tableProps.sortName, tableProps.sortOrder]);

  const getExportListRows = (list) => {
    let data = [];
    for (let i in list) {
      let TempArray = [
        list[i].bookingId.toString(),
        (list[i].currency === "PKR"
          ? list[i].totalCost
          : ConvertToCurrency(list[i].totalCost, "PKR", USD_rate)
        ).toString(),
        (list[i].currency === "USD"
          ? list[i].totalCost
          : ConvertToCurrency(list[i].totalCost, "USD", USD_rate)
        ).toString(),
        moment(list[i].bookingStartTime).format("YYYY-MM-DD HH:mm"),
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
        list[i].discount.toString(),
        list[i].funncar?.professionalName,
        list[i].notes.replace(/,/g, ""),
        list[i].onTourBooking ? "Yes" : "No",
        list[i].paymentMode ? list[i].paymentMode : "",
        list[i].service?.key.includes("Video")
          ? list[i].service?.name
          : list[i].service?.name + " - " + list[i].eventType?.name,
        list[i].status,
        list[i].bookingBy === "user"
          ? list[i].user?.fullName
          : list[i].user?.professionalName,
        list[i].bookingBy,
        list[i].isAcceptedByFunncar ? "Yes" : "No",
        list[i].isPublicVideo ? "Yes" : "No",
        list[i].isRatingGiven ? "Yes" : "No",
        list[i].markDone ? "Yes" : "No",
        list[i].videoFor ? list[i].videoFor : "",
        list[i].videoMessage ? list[i].videoMessage.replace(/,/g, "") : "",
        moment(list[i].videoMessageDeliveryDateTime).format("YYYY-MM-DD HH:mm"),
        list[i].videoMyName ? list[i].videoMyName : "",
        list[i].videoTheirName ? list[i].videoTheirName : "",
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getTableStats(getParamString(1, "true"))
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(
              result.data.data ? result.data.data.tableResult : []
            ),
            "Celebrities Bookings"
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
          <h4 className={classes.cardTitleWhite}>Celebrities Bookings</h4>
        </CardHeader>
        <CardBody>
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
