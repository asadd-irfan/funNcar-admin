import React, { useState, useEffect, useRef } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
// import Card1 from "../../components/Card/Card.js";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { contactUsList } from '../../actions/common';

// import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
// import CardHeader from "@material-ui/core/CardHeader";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import Table from '../../common/tableRendrer'
import CardBody from "../../components/Card/CardBody.js";
import moment from 'moment';

const styles = {

    root: {
        minWidth: 275,
        paddingTop: 15,
        marginTop: 15,
        marginBottom: 5,
        paddingBottom: 5,
    },
   
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
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

    // state
    const [contactUsData, setContactUsData] = useState(null);
    const [tableProps, setTableProps] = useState({
        data: [],
        page: 1,
        sizePerPage: 20,
        totalSize: 0,
        loading: false
    });
    const handleTableChange = (type, { page, sizePerPage }) => {
        setTableProps({ ...tableProps, page, sizePerPage })
    }
    // console.log('content',content)

    const getContactUsData = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        contactUsList().then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
               // Populate Table
               setTableProps({ ...tableProps, data: [] })

               setTimeout(() => {
                   setTableProps({
                       ...tableProps,
                       data: result.data.data ? result.data.data : [],
                       totalSize: result.data.data ? result.data.totalCount : 0
                   })
               }, 30);

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
        getContactUsData()
    }, []);

    const columns = [{
        dataField: "fullName",
        text: "User Name"
    }, {
        dataField: 'email',
        text: 'Email',

    }, {
        dataField: 'phone',
        text: 'Phone no',
    }, {
        dataField: 'comments',
        text: 'Message',
        headerStyle: (colum, colIndex) => { return { width: '300px', height:'100px' } },
       
    }, {
        dataField: 'createdAt',
        text: 'Date',
        formatter: (cell, row) => { return (<>{moment(row?.createdAt).format('LL')}</>) },


    }];


    return (

        // <GridContainer>
        // <GridItem xs={12} sm={12} md={12}>

        //     {contactUsData && contactUsData.map((user, i) => {
        //         return (
                   
        //             <Card className={classes.root} key={i}>
        //             <CardHeader className="cardHeader"
        //                 avatar={
        //                 <Avatar>{user.fullName.charAt(0).toUpperCase()}</Avatar>
        //                 }
                        
        //                 title={user.fullName}
        //                 subheader={user.email}
                        

        //             />
        //             <CardContent className="cardContent">
        //                 <Typography className={classes.pos} color="textSecondary">
        //                     {user.comments}
        //                 </Typography>
        //             </CardContent>
        //         </Card>
        //         )
        //     })
        //     }
        //     </GridItem>
        // </GridContainer >
         <GridContainer>
         <GridItem xs={12} sm={12} md={12}>
             <Card>
                 <CardHeader color="primary">
                     <h4 className={classes.cardTitleWhite}>ContactUs List</h4>

                 </CardHeader>
                 <CardBody>
                     <Table {...tableProps} onTableChange={handleTableChange} columns={columns} />
                 </CardBody>
             </Card>
         </GridItem>
     </GridContainer>
    );
}