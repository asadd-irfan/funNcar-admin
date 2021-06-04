import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import {  useDispatch } from 'react-redux'
import { getUsers,deleteUser } from '../../actions/users';
import Table from '../../common/tableRendrer'
import { APP_ERROR_MSGS } from '../../common/constants';
import { useAlert } from 'react-alert'
import { UPDATE_LOADING } from "../../actions/types";
import { Link } from 'react-router-dom';
import AlertDialog from '../../components/Modals/AlertModal'

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

export default function PerformersList() {
  // Hooks
  const alert = useAlert();
  const dispatch = useDispatch();
  const classes = useStyles();

  // state
  const [AlertModalProps, setAlertModalProps] = useState({
    open:false,
    title:"",
    message:"",
    firstCallback:() => {},
    secondCallback:() => {}
  });
  const [tableProps, setTableProps] = useState({
    data: [],
    page: 1,
    sizePerPage: 20,
    totalSize: 0,
    loading: false
  });

  // variables and functions

  const CellMenu = (cell, row) => {
    return (
      <>
        <Link to={`/admin/performer/${row.id}`}><button data-toggle="tooltip" title="View" className="pd-setting-ed"><i className="fa fa-eye" aria-hidden="true"></i></button></Link>
        <Link to={`/admin/Performer_Edit/${row.id}`}><button data-toggle="tooltip" title="Edit" className="pd-setting-ed"><i className="fa fa-pencil" aria-hidden="true"></i></button></Link>
        <button onClick={(()=>{onDelete(row.id)})} data-toggle="tooltip" title="Delete" className="pd-setting-ed"><i className="fa fa-trash" aria-hidden="true"></i></button>
      </>
    )
  }
  const columns = [{
    dataField: 'professionalName',
    text: 'Professional Name'
  }, {
    dataField: 'email',
    text: 'Email'
  }, {
    dataField: 'phone',
    text: 'Phone no.'
  },{
    dataField: 'isPopular',
    text: 'Popular',
    formatter: (cell, row) => { return (<>{row.isPopular ? "Yes" : "No"}</>) },
  },{
    dataField: 'isVerified',
    text: 'Verified',
    formatter: (cell, row) => { return (<>{cell ? "Yes" : "No"}</>) },
  },{
    dataField: 'apr',
    text: 'Approved',
    formatter: (cell, row) => { return (<>{row.profileApproved.status ? "Yes" : "No"}</>) },
    // headerStyle: (colum, colIndex) => { return { width: '100px' } },
  },{
    dataField: 'Category',
    text: 'Main Category',
    formatter: (cell, row) => { return (<>{row.mainCategory.name}</>) },
  },{
    dataField: 'registeredFromDevice',
    text: 'Registered From Device',
    formatter: (cell, row) => { return (<>{row.registeredFromDevice}</>) },
    // headerStyle: (colum, colIndex) => { return { width: '150px' } },
  },{
    dataField: '',
    text: 'Actions',
    formatter: (cell, row) => { return CellMenu(cell, row) },
    csvExport: false,
    headerStyle: (colum, colIndex) => { return { width: '200px',  } },
  }];

  const handleTableChange = (type, { page, sizePerPage }) => {
    setTableProps({ ...tableProps, page, sizePerPage })
  }
  const populateTable = () => {
    setTableProps({ ...tableProps, loading: true, data: [] })
    let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}&role=performer`
    getUsers(paramString).then(result => {
      setTableProps({ ...tableProps, loading: false, })
      if (result.data.status === true) {
        setTableProps({
          ...tableProps,
          data: result.data.data ? result.data.data : [],
          totalSize: result.data.data ? result.data.totalCount : 0
        })
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      setTableProps({ ...tableProps, loading: false })
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });
  }
  const onDelete=(id)=>{
    setAlertModalProps({
      ...AlertModalProps,
      open: true,
      title:"Deleting",
      message:APP_ERROR_MSGS.DeleteConfirmMsg,
      firstCallback:() => {setAlertModalProps({...AlertModalProps,open:false});DeleteRecord(id)},
      secondCallback:() => {setAlertModalProps({...AlertModalProps,open:false});}
    })
  }
  const DeleteRecord=(id)=>{
    dispatch({type: UPDATE_LOADING,payload:true});
    deleteUser(id).then(result => {
      dispatch({type: UPDATE_LOADING,payload:false});
      if(result.data.status === true){
        alert.success(APP_ERROR_MSGS.DeleteMsg)
        populateTable()
      }
      else{
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({type: UPDATE_LOADING,payload:false});
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });
  }

  useEffect(() => { populateTable(); }, [tableProps.page, tableProps.sizePerPage]);

  return (<>
  <AlertDialog  {...AlertModalProps} setOpen={((resp)=>{setAlertModalProps({...AlertModalProps,open:resp})})}/>
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Performers List</h4>

          </CardHeader>
          <CardBody>
            <Table {...tableProps} onTableChange={handleTableChange} columns={columns} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  </>);
}