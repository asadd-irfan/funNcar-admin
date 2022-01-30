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
import { getUsers, deleteUser, filterFunncars } from "../../actions/users";
import Table from "../../common/tableRendrer";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";
import { UPDATE_LOADING } from "../../actions/types";
import { Link } from "react-router-dom";
import AlertDialog from "../../components/Modals/AlertModal";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "../../components/CustomButtons/Button.js";
import { useHistory } from "react-router-dom";
import {
  scrollToDiv,
  ProcessDataInArray,
  getUrlQuerySearchParam,
  ExportToCVS,
  convertArrayToString
} from "../../common/commonMethods";
import { getAllCountries, getCities } from "../../actions/auth";
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

export default function FuncarsList(props) {
  // Hooks
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const classes = useStyles();
  const appConfigs = useSelector((state) => state.auth.appConfigs);
  const user = useSelector(state => state.auth.user);
  const allCategories = appConfigs.data["categories"];

  const urlQuery = new URLSearchParams(props.location.search);
  const filterType = urlQuery.get("type");
  const startDate = urlQuery.get("startDate");
  const endDate = urlQuery.get("endDate");
  const urlQueryString = getUrlQuerySearchParam(filterType, startDate, endDate);

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

  const DropDownFilters = [
    { label: "Approved", value: "approved" },
    { label: "Not Approved", value: "notApproved" },
    { label: "Verified", value: "verified" },
    { label: "Not Verified", value: "notVerified" },
    { label: "Popular", value: "popular" },
  ];

  // state
  const [categoryType, setCategoryType] = useState(history.location.state?.backRedirection?.categoryType ?? "");
  const [filter, setFilter] = useState(history.location.state?.backRedirection?.filter ?? "");
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
    firstCallback: () => { },
    secondCallback: () => { },
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

  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      history.push(`/admin/funncar/${row.id}`);
    },
  };
  const CellMenu = (cell, row) => {
    return (
      <>
        {/* <Link to={`/admin/funncar/${row.id}`}> */}
        <button onClick={() => handleListBtnClick(row.id, "view")} data-toggle="tooltip" title="View" className="pd-setting-ed">
          <i className="fa fa-eye" aria-hidden="true"></i>
        </button>
        {/* </Link> */}
        {/* <Link to={`/admin/Funncar_Edit/${row.id}`}> */}
        <button onClick={() => handleListBtnClick(row.id, "edit")} data-toggle="tooltip" title="Edit" className="pd-setting-ed">
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
      dataField: "professionalName",
      text: "Name",
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      sort: true,
    },
    {
      dataField: "phone",
      text: "Phone no.",
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "isPopular",
      text: "Popular",
      formatter: (cell, row) => {
        return <>{row.isPopular ? "Yes" : "No"}</>;
      },
      csvFormatter: (cell, row, rowIndex) => (row.isPopular ? "Yes" : "No"),
      headerStyle: (colum, colIndex) => {
        return { width: "73px" };
      },
      sort: true,
    },
    {
      dataField: "isVerified",
      text: "Verified",
      formatter: (cell, row) => {
        return <>{cell ? "Yes" : "No"}</>;
      },
      csvFormatter: (cell, row, rowIndex) => (cell ? "Yes" : "No"),
      headerStyle: (colum, colIndex) => {
        return { width: "73px" };
      },
      sort: true,
    },
    {
      dataField: "row.profileApproved.status",
      text: "Approved",
      formatter: (cell, row) => {
        return <>{row.profileApproved.status ? "Yes" : "No"}</>;
      },
      csvFormatter: (cell, row, rowIndex) =>
        row.profileApproved.status ? "Yes" : "No",
      headerStyle: (colum, colIndex) => {
        return { width: "77px" };
      },
      // sort: true,
    },
    // {
    //   dataField: "Category",
    //   text: "Categories",
    //   formatter: (cell, row) => {
    //     return <>{row.categories.map((item) => item.name).join(",")}</>;
    //   },
    //   csvFormatter: (cell, row, rowIndex) =>
    //     row.categories.map((item) => item.name).join(","),
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "200px" };
    //   },
    // },
    // {
    //   dataField: "registeredFromDevice",
    //   text: "Registered From Device",
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "150px" };
    //   },
    // },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cell, row) => {
        return CellMenu(cell, row);
      },
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      // classes: 'table_row_min_width'
    },
  ];

  if (!user.isSuperAdmin) {
    columns = columns.filter(item => {
      if (item.dataField != 'email' && item.dataField != 'phone') {
        return item;
      }
    })
  }

  const handleListBtnClick = (id, type) => {
    let state = {
      redirectToURL: `/admin/funncars`,
      data: { search, country, city, categoryType, filter },
      search: props.location.search ?? ""
    }
    let pathName = "";
    if (type === "view") pathName = `/admin/funncar/${id}`
    if (type === "edit") pathName = `/admin/Funncar_Edit/${id}`
    history.push({
      pathname: pathName,
      state: { backRedirection: state }
    })
  }
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
        convertArrayToString(list[i].achievements, " | "),
        convertArrayToString(list[i].mngServices, " | ", "name"),
        convertArrayToString(list[i].services, " | ", "name"),
        convertArrayToString(list[i].categories, " | ", "name"),
        convertArrayToString(list[i].subCategories, " | ", "name"),
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

    let body = null;
    if (search) body = { search: search };
    if (categoryType) body = { ...body, category: categoryType };
    if (filter == "approved") body = { ...body, approved: true };
    if (filter == "notApproved") body = { ...body, approved: false };
    if (filter == "verified") body = { ...body, verified: true };
    if (filter == "notVerified") body = { ...body, verified: false };
    if (filter == "popular") body = { ...body, popular: true };

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

    filterFunncars(body, paramString)
      .then((result) => {
        if (result.data.status === true) {
          dispatch({ type: UPDATE_LOADING, payload: false });
          ExportToCVS(
            exportColumns,
            getExportListRows(result.data.data),
            "Funncars"
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
      setCategoryType("");
      setFilter("");
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
  const populateTable = () => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}&role=funncar`;
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
  const handleCategoryChange = (e) => {
    const value = e.currentTarget.value;
    setSearch("");
    setCategoryType(value);
    // let body = {};
    // let query = "";
    // if (filter == "approved") body = { ...body, approved: true };
    // if (filter == "notApproved") body = { ...body, approved: false };
    // if (filter == "verified") body = { ...body, verified: true };
    // if (filter == "notVerified") body = { ...body, verified: false };
    // if (filter == "popular") body = { ...body, popular: true };
    // body = { ...body, category: value };
    // if (country) query = `${query}&country=${country}`;
    // if (city) query = `${query}&city=${city}`;
    // onClickFilter(body, query);
  };
  const handleFilterChange = (e) => {
    // let body = {};
    // let query = "";
    const value = e.currentTarget.value;
    setSearch("");
    setFilter(value);
    // if (value == "approved") body = { ...body, approved: true };
    // if (value == "notApproved") body = { ...body, approved: false };
    // if (value == "verified") body = { ...body, verified: true };
    // if (value == "notVerified") body = { ...body, verified: false };
    // if (value == "popular") body = { ...body, popular: true };
    // if (categoryType) body = { ...body, category: categoryType };
    // if (country) query = `${query}&country=${country}`;
    // if (city) query = `${query}&city=${city}`;
    // onClickFilter(body, query);
  };
  const onSearch = (value) => {
    // let body = {};
    setCategoryType("");
    setFilter("");
    setCountry("");
    setCity("");
    setSearch(value);
    // if (value === "") {
    //   populateTable();
    // }
    // if (value.length > 1) {
    //   body = { search: value };
    //   onClickFilter(body);
    // }
  };
  const onClickFilter = (body, query = "") => {
    setTableProps({ ...tableProps, loading: true, data: [] });
    dispatch({ type: UPDATE_LOADING, payload: true });
    filterFunncars(
      body,
      `${query}${urlQueryString ? `&${urlQueryString}` : ""}`
    )
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
  const resetPage = (value) => {
    setCategoryType("");
    setFilter("");
    setSearch("");
    setCountry("");
    setCity("");
    populateTable();
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
  const filterCities = (value, processedList = null) => {
    if (value === 0 || value === "") {
      setCities([]);
    } else {
      let list = processedList ? processedList : processedCountries
      if (list[value])
        getCitiesList(list[value].id);
    }
  };
  const handleCountryChange = (e) => {
    const value = e.currentTarget.value;
    setSearch("");
    setCity("");
    setCountry(value);
    // let body = {};
    // if (filter == "approved") body = { ...body, approved: true };
    // if (filter == "notApproved") body = { ...body, approved: false };
    // if (filter == "verified") body = { ...body, verified: true };
    // if (filter == "notVerified") body = { ...body, verified: false };
    // if (filter == "popular") body = { ...body, popular: true };
    // if (categoryType) body = { ...body, category: categoryType };
    // onClickFilter(body, value ? `&country=${value}` : "");
  };
  const handleCityChange = (e) => {
    const value = e.currentTarget.value;
    setSearch("");
    setCity(value);
    // let body = {};
    // let query = "";
    // if (filter == "approved") body = { ...body, approved: true };
    // if (filter == "notApproved") body = { ...body, approved: false };
    // if (filter == "verified") body = { ...body, verified: true };
    // if (filter == "notVerified") body = { ...body, verified: false };
    // if (filter == "popular") body = { ...body, popular: true };
    // if (categoryType) body = { ...body, category: categoryType };
    // if (country) query = `&country=${country}`;
    // onClickFilter(body, value ? `${query}&city=${value}` : query);
  };

  useEffect(() => {
    getAllCountriesList((processedList) => {
      if (country) {
        filterCities(country, processedList);
      }
    });
  }, []);

  useEffect(() => {
    if (search || country || city || categoryType || filter) {

      let body = {}
      if (search) body.search = search
      if (categoryType) body.category = categoryType;
      if (filter == "approved") body.approved = true
      if (filter == "notApproved") body.approved = false
      if (filter == "verified") body.verified = true
      if (filter == "notVerified") body.verified = false
      if (filter == "popular") body.popular = true

      let query = "";
      if (country) query = `${query}&country=${country}`;
      if (city) query = `${query}&city=${city}`;
      onClickFilter(body, query);
    }
    else populateTable();
  }, [
    tableProps.page,
    tableProps.sizePerPage,
    tableProps.sortName,
    tableProps.sortOrder,
    search,
    country,
    city,
    categoryType,
    filter
  ]);

  useEffect(() => {
    scrollToDiv("fanncars-list-container");
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
      <GridContainer id="fanncars-list-container">
        <GridItem xs={12} sm={12} md={12}>
          <FormGroup
            row
            className="d-flex"
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={filter}
                onChange={handleFilterChange}
              >
                <option value={""}>Select Filters </option>
                {DropDownFilters.map((item, i) => {
                  return (
                    <option key={i} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </select>

              <select
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
                value={categoryType}
                onChange={handleCategoryChange}
              >
                <option value={""}>Select Category</option>
                {allCategories.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>

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
                style={{ height: "35px", minWidth: "250px", margin: 10 }}
              />

              <Button
                type="button"
                color="primary"
                style={{ float: "right" }}
                onClick={() => resetPage()}
              >
                Reset
              </Button>
            </div>
          </FormGroup>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Celebrities List</h4>
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
