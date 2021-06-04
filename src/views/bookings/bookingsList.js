import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { useDispatch } from 'react-redux'
import { getAllBookings, deleteBookingById } from '../../actions/bookings';
import { APP_ERROR_MSGS } from '../../common/constants';
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom';
import AlertDialog from '../../components/Modals/AlertModal'
import Table from '../../common/tableRendrer'
import Chip from '@material-ui/core/Chip';
import { UPDATE_LOADING } from "../../actions/types";
import moment from 'moment';

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

export default function BookingsList() {

    const alert = useAlert();
    const classes = useStyles();
    const dispatch = useDispatch();


    // state
    const [selectedType, setSelectedType] = useState("");
    const [AlertModalProps, setAlertModalProps] = useState({
        open: false,
        title: "",
        message: "",
        firstCallback: () => { },
        secondCallback: () => { }
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
                <Link to={`/admin/booking/${row.id}`}>
                    <button data-toggle="tooltip" title="Edit" className="pd-setting-ed"><i className="fa fa-eye" aria-hidden="true"></i></button>
                </Link>
                <button onClick={(() => { onDelete(row.id) })} data-toggle="tooltip" title="Delete" className="pd-setting-ed"><i className="fa fa-trash" aria-hidden="true"></i></button>
            </>
        )
    }
    const columns = [{
        dataField: "bookingId",
        text: "Booking Id"
    }, {
        dataField: 'username',
        text: 'Booking Person',
        formatter: (cell, row) => { return (<>{row.bookingBy === 'user' ? row.user?.fullName : row.user?.professionalName}</>) },

    }, {
        dataField: 'funncar',
        text: 'Funncar',
        formatter: (cell, row) => { return (<>{row.funncar?.professionalName}</>) },
    }, {
        dataField: 'service',
        text: 'Service',
        formatter: (cell, row) => {
            return (<>
                {
                    row.service?.name.includes("Video") ? row.service?.name
                        : row.service?.name + ' - ' + row.eventType?.name
                }

            </>)
        },
    }, {
        dataField: 'status',
        text: 'Status',
        formatter: (cell, row) => {
            return (<>
                {row.status === 'pending' && <Chip label={row.status} className="bg_yellow" />}
                {row.status === 'booked' && <Chip label={row.status} color="primary" />}
                {row.status === 'completed' && <Chip label={row.status} className="bg_green" />}
                {row.status === 'cancelled' && <Chip label={row.status} color="secondary" />}
            </>)
        },

    }, {
        dataField: 'date',
        text: 'Created Date',
        formatter: (cell, row) => { return (<>{moment(row?.createdAt).format('llll')}</>) },
    }, {
        dataField: 'actions',
        text: 'Actions',
        formatter: (cell, row) => { return CellMenu(cell, row) },
        csvExport: false
    }];



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
        deleteBookingById(id).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                alert.success(APP_ERROR_MSGS.DeleteMsg)
                getBookingsList();
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
        });
    }



    const getBookingsList = () => {
        setTableProps({ ...tableProps, loading: true, data: [] })
        let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}`
        getAllBookings(paramString).then(result => {
            setTableProps({ ...tableProps, loading: false, })
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
            setTableProps({ ...tableProps, loading: false, })
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
        });
    }

    useEffect(() => {
        getBookingsList();
    }, [tableProps.page, tableProps.sizePerPage]);

    const handleTableChange = (type, { page, sizePerPage }) => {
        setTableProps({ ...tableProps, page, sizePerPage })
    }
    return (<>

        <AlertDialog  {...AlertModalProps} setOpen={((resp) => { setAlertModalProps({ ...AlertModalProps, open: resp }) })} />

        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Bookings List</h4>

                    </CardHeader>
                    <CardBody>
                        <Table {...tableProps} onTableChange={handleTableChange} columns={columns} />
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>

    </>);
}