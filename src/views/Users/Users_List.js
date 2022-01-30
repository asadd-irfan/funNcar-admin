import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, deleteUser, filterUsers } from "../../actions/users";
import Table from "../../common/tableRendrer";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";
import { UPDATE_LOADING } from "../../actions/types";
import { Link } from "react-router-dom";
import AlertDialog from "../../components/Modals/AlertModal";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "../../components/CustomButtons/Button.js";
import { useHistory } from "react-router-dom";
import { getAllCountries, getCities } from "../../actions/auth";
import {
  scrollToDiv,
  ProcessDataInArray,
  getUrlQuerySearchParam,
  ExportToCVS,
} from "../../common/commonMethods";
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

export default function UsersList(props) {
  // Hooks
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(state => state.auth.user);

  const exportColumns = [
    "Id",
    "Full Name",
    ...(user.isSuperAdmin ? ['Email'] : []),
    ...(user.isSuperAdmin ? ['Phone'] : []),
    "Country",
    "City",
    "Registered From Device",
    "Last Login Device",
    "Blocked",
    "Logout",
    "Created On",
  ];

  const urlQuery = new URLSearchParams(props.location.search);
  const filterType = urlQuery.get("type");
  const startDate = urlQuery.get("startDate");
  const endDate = urlQuery.get("endDate");
  const urlQueryString = getUrlQuerySearchParam(filterType, startDate, endDate);

  // state
  const [search, setSearch] = useState(history.location.state?.backRedirection?.search ?? "");
  const [allCountries, setAllCountries] = useState([]);
  const [processedCountries, setProcessedCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState(history.location.state?.backRedirection?.country ?? "");
  const [city, setCity] = useState(history.location.state?.backRedirection?.city ?? "");
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
      history.push(`/admin/user/${row.id}`);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        {/* <Link  to={`/admin/user/${row.id}`} state={setRedirectionState()}> */}
          <button onClick={()=> handleListBtnClick(row.id,"view")} data-toggle="tooltip" title="View" className="pd-setting-ed">
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
        {/* </Link> */}
        {/* <Link to={`/admin/User_Edit/${row.id}`}> */}
          <button onClick={()=> handleListBtnClick(row.id,"edit")} data-toggle="tooltip" title="Edit" className="pd-setting-ed">
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </button>
        {/* </Link> */}
        {/* <button
          onClick={() => {
            onDelete(row.id);
          }}
          data-toggle="tooltip"
          title="Delete"
          className="pd-setting-ed"
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button> */}
      </>
    );
  };
  let columns = [
    {
      dataField: "fullName",
      text: "Full Name",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "phone",
      text: "Phone no.",
      csvFormatter: (cell, row, rowIndex) => `${cell}`,
    },
    {
      dataField: "registeredFromDevice",
      text: "Registered From Device",
      sort: true,
      // headerStyle: (colum, colIndex) => { return { width: '150px' } },
    },
    {
      dataField: "isBlock",
      text: "Blocked",
      formatter: (cell, row) => {
        return <>{cell ? "Yes" : "No"}</>;
      },
      csvFormatter: (cell, row, rowIndex) => (cell ? "Yes" : "No"),
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      },
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
  if (!user.isSuperAdmin) {
    columns = columns.filter(item => {
      if (item.dataField != 'email' && item.dataField != 'phone') {
        return item;
      }
    })
  }
  const handleListBtnClick = (id,type) =>{
    let state ={
      redirectToURL: `/admin/users`,
      data: { search, country, city},
      search: props.location.search ?? "" 
    }
    let pathName=  "";
    if(type === "view") pathName = `/admin/user/${id}`
    if(type === "edit") pathName = `/admin/User_Edit/${id}`
    history.push({
      pathname: pathName,
      state: { backRedirection: state }
    })
  }
  const populateTable = () => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}&role=user`;
    if (tableProps.sortName != "") {
      let order =
        tableProps.sortOrder == "desc"
          ? `-${tableProps.sortName}`
          : tableProps.sortName;
      paramString = `${paramString}&sort=${order}`;
    }
    let dateRange = urlQueryString ? `&${urlQueryString}` : "";
    getUsers(`${paramString}${dateRange}`)
      .then((result) => {
        if (result.data.status === true) {
          setTableProps({
            ...tableProps,
            data: result.data.data ? result.data.data : [],
            totalSize: result.data.data ? result.data.totalCount : 0,
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
  const searchUsers = (body, query = "") => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    dispatch({ type: UPDATE_LOADING, payload: true });
    filterUsers(body, `${query}${urlQueryString ? `&${urlQueryString}` : ""}`)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        setTableProps({ ...tableProps, loading: false });
        if (result.data.status === true) {
          setTableProps({
            ...tableProps,
            loading: false,
            data: result.data.data ? result.data.data : [],
            totalSize: result.data.data ? result.data.totalCount : 0,
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
  const onSearch = (value) => {
    // let body = {};
    setCountry("");
    setCity("");
    setSearch(value);
    // if (value == "") {
    //   populateTable();
    // } else if (value.length > 1) {
    //   body = { search: value };
    //   searchUsers(body);
    // }
  };
  const handleCountryChange = (e) => {
    const value = e.currentTarget.value;
    setSearch("");
    setCity("");
    setCountry(value);
    // searchUsers(null, value ? `&country=${value}` : "");
  };
  const handleCityChange = (e) => {
    const value = e.currentTarget.value;
    setSearch("");
    setCity(value);
    // let query = "";
    // if (country) query = `&country=${country}`;
    // searchUsers(null, value ? `${query}&city=${value}` : query);
  };
  const getExportListRows = (list) => {
    let data = [];
    for (let i in list) {
      let TempArray = [
        list[i].id.toString(),
        list[i].fullName,
        ...(user.isSuperAdmin ? [list[i].email] : []),
        ...(user.isSuperAdmin ? [list[i].phone.toString()] : []),
        list[i].country,
        list[i].city,
        list[i].registeredFromDevice,
        list[i].lastLoginDevice,
        list[i].isBlock ? "Yes" : "No",
        list[i].isLogout ? "Yes" : "No",
        moment(list[i].createdAt).format("YYYY-MM-DD HH:mm"),
      ];
      data.push(...TempArray);
    }
    return data;
  };
  const exportList = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });

    let body = null;
    if (search) body = { search: search };

    let paramString = `&exportToCSV=true`;
    if (country) paramString = `${paramString}&country=${country}`;
    if (city) paramString = `${paramString}&city=${city}`;
    if (tableProps.sortName != "") {
      let order =
        tableProps.sortOrder == "desc"
          ? `-${tableProps.sortName}`
          : tableProps.sortName;
      paramString = `${paramString}&sort=${order}`;
    }
    let dateRange = urlQueryString ? `&${urlQueryString}` : "";
    paramString = `${paramString}${dateRange}`;

    filterUsers(body, paramString)
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data),
            "Fans"
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
  const handleTableChange = (type, newState) => {
    if (type == "sort") {
      setSearch("");
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
  const onDelete = (id) => {
    setAlertModalProps({
      ...AlertModalProps,
      open: true,
      title: "Deleting",
      message: APP_ERROR_MSGS.DeleteConfirmMsg,
      firstCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
        DeleteRecord(id);
      },
      secondCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
      },
    });
  };
  const DeleteRecord = (id) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    deleteUser(id)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(APP_ERROR_MSGS.DeleteMsg);
          populateTable();
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
  const getAllCountriesList = (call_back) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getAllCountries()
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          setAllCountries(result.data.data);
          let processed = ProcessDataInArray(result.data.data, "name")
          setProcessedCountries(processed);
          call_back(processed);
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
            : "Something went wrong while fetching countries"
        );
      });
  };
  const getCitiesList = (id) => {
    // setCitiesLoader(true)
    setCities([]);
    getCities(id)
      .then((result) => {
        // setCitiesLoader(false)
        if (result.data.status === true) {
          setCities(result.data.data);
        } else {
          alert.error(
            result.data.message
              ? result.data.message
              : APP_ERROR_MSGS.StandardErrorMsg
          );
        }
      })
      .catch((error) => {
        // setCitiesLoader(false)
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : "Something went wrong while fetching cities"
        );
      });
  };
  const filterCities = (value,processedList=null) => {
    if (value === 0 || value === "") {
      setCities([]);
    } else {
      let list = processedList ? processedList : processedCountries
      if (list[value])
        getCitiesList(list[value].id);
    }
  };

  useEffect(() => {
    getAllCountriesList((processedList) => {
      if(country){
        filterCities(country,processedList);
      }
    });
  }, []);

  useEffect(() => {
    if(search || country || city)
    { 
      let body = {}
      if(search) body.search = search
      let query = "";
      if (country) query = `${query}&country=${country}`;
      if (city) query = `${query}&city=${city}`;
      searchUsers(body,query);
    }
    else populateTable();
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
    search,
    country,
    city
  ]);

  useEffect(() => {
    scrollToDiv("fans-list-container");
  }, [tableProps.page, tableProps.sizePerPage]);

  useEffect(() => {
    filterCities(country);
  }, [country]);


  return (
    <>
      <AlertDialog
        {...AlertModalProps}
        setOpen={(resp) => {
          setAlertModalProps({ ...AlertModalProps, open: resp });
        }}
      />
      <GridContainer id="fans-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <FormGroup
            row
            className="d-flex"
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={country}
                onChange={handleCountryChange}
              >
                <option value={""}>Select Country</option>
                {allCountries.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>

              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={city}
                onChange={handleCityChange}
              >
                <option value={""}>Select City</option>
                {cities.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>

              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search by name or email"
                style={{ height: "35px", minWidth: "300px", margin: 10 }}
              />
            </div>
          </FormGroup>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Fans List</h4>
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
