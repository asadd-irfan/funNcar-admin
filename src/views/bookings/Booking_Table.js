import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardAvatar from "../../components/Card/CardAvatar.js";
import CardBody from "../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';
import { useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import Table from '../../common/tableRendrer'
import { getFunncarBookings, getUserBookings } from '../../actions/bookings';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';

const styles = {

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

export default function BookingTable({
    role,
    Id
}) {
    // Hooks
    const classes = useStyles();
    const alert = useAlert();
    const dispatch = useDispatch();
    const history = useHistory();

    const [tableProps, setTableProps] = useState({
        data: [],
        page: 1,
        sizePerPage: 20,
        totalSize: 0,
        loading: false
    });

    const getBookingsList = () => {
        let paramString = `?page=${tableProps.page}&limit=${tableProps.sizePerPage}`;
        if (role) {
            setTableProps({ ...tableProps, loading: true, data: [] })
            if (role == 'user') {
                getUserBookings(paramString, Id).then(result => {
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
                        }, 300);

                    }
                    else {
                        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
                    }
                }).catch(error => {
                    setTableProps({ ...tableProps, loading: false, })
                    alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
                });
            } else {
                getFunncarBookings(paramString, Id).then(result => {
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
                        }, 300);

                    }
                    else {
                        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
                    }
                }).catch(error => {
                    setTableProps({ ...tableProps, loading: false, })
                    alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
                });
            }
        }



    }

    useEffect(() => {
        getBookingsList();
    }, [role, tableProps.page, tableProps.sizePerPage]);

    const CellMenu = (cell, row) => {
        return (
            <>
                <Link to={`/admin/booking/${row.id}`}>
                    <button data-toggle="tooltip" title="Edit" className="pd-setting-ed"><i className="fa fa-eye" aria-hidden="true"></i></button>
                </Link>
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
        text: 'Details',
        formatter: (cell, row) => { return CellMenu(cell, row) },
    }];

    const handleTableChange = (type, { page, sizePerPage }) => {
        setTableProps({ ...tableProps, page, sizePerPage })
    }

    return (
        <GridItem xs={12} sm={12} md={12}>
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>All Bookings </h4>

                </CardHeader>
                <CardBody>
                    <Table {...tableProps} onTableChange={handleTableChange} columns={columns} />
                </CardBody>
            </Card>
        </GridItem>
    );
}