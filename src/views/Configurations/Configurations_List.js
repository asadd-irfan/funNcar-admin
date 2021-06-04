import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useSelector, useDispatch } from 'react-redux'
import { getAppConfigs, deleteConfiguration } from '../../actions/auth';
import { APP_ERROR_MSGS } from '../../common/constants';
import { useAlert } from 'react-alert'
import { UPDATE_LOADING, APP_CONFIGS_LOADED } from "../../actions/types";
import { Link } from 'react-router-dom';
import AlertDialog from '../../components/Modals/AlertModal'
import ClientSideTableRendrerfrom from "../../common/clientSideTableRendrer"
// import Button from "../../components/CustomButtons/Button.js";


const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
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
      lineHeight: "1"
    }
  }
};
const useStyles = makeStyles(styles);

export default function ConfigurationsList() {

  const alert = useAlert();
  const dispatch = useDispatch();
  const classes = useStyles();
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const ConfigurationTypes = Object.keys(appConfigs.data);
  const allCategories = appConfigs.data['categories'];

  // state
  const [selectedType, setSelectedType] = useState("");
  localStorage.setItem('config', selectedType)
  const [categoryType, setCategoryType] = useState("");
  const [AlertModalProps, setAlertModalProps] = useState({
    open: false,
    title: "",
    message: "",
    firstCallback: () => { },
    secondCallback: () => { }
  });
  const [tableProps, setTableProps] = useState({
    data: [],
    loading: false,
  });

  // variables and functions

  const CellMenu = (cell, row) => {
    return (
      <>
        <Link to={`/admin/Configuration_Edit/${row.id}`}><button data-toggle="tooltip" title="Edit" className="pd-setting-ed"><i className="fa fa-pencil" aria-hidden="true"></i></button></Link>
        <button onClick={(() => { onDelete(row.id) })} data-toggle="tooltip" title="Delete" className="pd-setting-ed"><i className="fa fa-trash" aria-hidden="true"></i></button>
      </>
    )
  }
  const columns = [{
    dataField: 'name',
    text: 'Name'
  }, {
    dataField: '',
    text: '',
    formatter: (cell, row) => { return CellMenu(cell, row) },
    csvExport: false
  }];

  const populateTable = (type) => {
    let list = appConfigs.data[type]
    setTableProps({ ...tableProps, data: list })
  }
  const onDelete = (id) => {
    setAlertModalProps({
      ...AlertModalProps,
      open: true,
      title: "Deleting",
      message: APP_ERROR_MSGS.DeleteConfirmMsg,
      firstCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); DeleteRecord(id) },
      secondCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); }
    })
  }
  const DeleteRecord = (id) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    deleteConfiguration(id).then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        alert.success(APP_ERROR_MSGS.DeleteMsg)
        getAllAppConfigs(selectedType);
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });
  }

  const handleConfigTypeChange = (e) => {
    setTableProps({ ...tableProps, data: [] })
    let value = e.currentTarget.value
    setSelectedType(value)
    setCategoryType('')
    if (value != 'subCategories') {
      setTimeout(() => {
        populateTable(value)
      }, 30);
    }
  }

  const handleCategoryChange = (e) => {
    setTableProps({ ...tableProps, data: [] })
    let value = e.currentTarget.value;
    setCategoryType(value)
    let list = appConfigs.data['subCategories']
    list = list.filter(item => item.isBelongTo.toString() == value.toString());
    setTableProps({ ...tableProps, data: list })
  }

  const getAllAppConfigs = (type = 'services') => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getAppConfigs().then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {

        // Populate Table
        setTableProps({ ...tableProps, data: [] })
        let list = result.data.data[type]
        if (type == 'subCategories') {
          list = list.filter(item => item.isBelongTo.toString() == categoryType.toString());
        }
        setTimeout(() => {
          setSelectedType(type)
          setTableProps({ ...tableProps, data: list })
        }, 30);

        // Update redux
        dispatch({ type: APP_CONFIGS_LOADED, payload: result.data });

      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });
  }

  useEffect(() => {
    getAllAppConfigs();
  }, []);

  return (<>

    <AlertDialog  {...AlertModalProps} setOpen={((resp) => { setAlertModalProps({ ...AlertModalProps, open: resp }) })} />

    <GridContainer>

      <GridItem xs={12} sm={selectedType == 'subCategories' ? 5 : 10} md={selectedType == 'subCategories' ? 5 : 10}>
        <label style={{ paddingRight: "15px" }}>Type:</label>
        <select id="configTypeINput" onChange={handleConfigTypeChange} style={{ height: "35px", minWidth: "300px" }} value={selectedType}>
          {ConfigurationTypes.map((item, i) => {
            return (
              // <option key={i} value={item}>{item.replace(/([A-Z])/g, ' $1').trim()}</option>
              <option key={i} value={item}>{item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, ' $1').trim()}</option>
            )
          })}
        </select>
      </GridItem>
      {selectedType == 'subCategories' ? <GridItem xs={12} sm={5} md={5}>
        <label style={{ paddingRight: "15px" }}>Category:</label>
        <select onChange={handleCategoryChange} style={{ height: "35px", minWidth: "300px" }} value={categoryType}>
        <option value={''}>Select Category</option>
          {allCategories.map((item, i) => {
            return (
              <option key={i} value={item._id}>{item.name}</option>
            )
          })}
        </select>
      </GridItem> : <> </>}

      <GridItem xs={12} sm={2} md={2}>
        <Link style={{ float: "right" }} className="link-btn" to="/admin/Configuration_Add">ADD</Link>
      </GridItem>

    </GridContainer>

    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}><span style={{ textTransform: "capitalize", fontWeight: "100", fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif" }}>{selectedType}</span> List</h4>
          </CardHeader>
          <CardBody>
            <ClientSideTableRendrerfrom
              {...tableProps}
              columns={columns}
              isPagination={true}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>

  </>);
}