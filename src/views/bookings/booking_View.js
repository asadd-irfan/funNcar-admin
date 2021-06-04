import React, { useState, useEffect,useRef } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardAvatar from "../../components/Card/CardAvatar.js";
import CardBody from "../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getBookingDetails } from '../../actions/bookings';
import moment from 'moment';
// import JoditEditor from "jodit-react";
import { Link } from 'react-router-dom';


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
    },
    cardCategory: {
        color: "#999 !important",
        marginTop: "10px",
        textAlign: "center",
        fontWeight: "500"
    },
    description: {
        overflow: "hidden",
        color: "#999 !important",
        textOverflow: "ellipsis",
        whiteSpace: "normal",

    }
};
const useStyles = makeStyles(styles);

export default function BookingView() {
    // Hooks
    const classes = useStyles();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { Id } = useParams();
    const history = useHistory();

    // state
    const [bookingDetails, setBookingDetails] = useState(null);

    const editor = useRef(null)
	const [content, setContent] = useState('')
    // console.log('content',content)
    const getBookingDetailsById = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getBookingDetails(Id).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                setBookingDetails(result.data.data)


            }
            else {

                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });

            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
            if (error?.response?.status === 404)
                history.push("/admin/bookings")
        });
    }

    useEffect(() => {
        getBookingDetailsById()
    }, []);

    return (

        <GridContainer>
            <GridItem xs={12} sm={12} md={12} >

                {/* Basic Details */}
                <Card profile>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Booking Details</h4>
                    </CardHeader>

                    {bookingDetails && bookingDetails &&  <CardBody profile>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Booking Status: </span><span className="Tag_value">{bookingDetails?.status}</span>
                            </GridItem>


                            {bookingDetails?.cancellationReason && <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Cancellation Reason: </span><span className="Tag_value">{bookingDetails?.cancellationReason}</span>
                            </GridItem>}



                        </GridContainer>
                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Booking Id: </span><span className="Tag_value">{bookingDetails?.bookingId}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Service Name: </span><span className="Tag_value">{bookingDetails?.service?.name}</span>
                            </GridItem>



                            {bookingDetails?.eventType && <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Event Name: </span><span className="Tag_value">{bookingDetails?.eventType?.name}</span>
                            </GridItem>}



                        </GridContainer>

                        {(bookingDetails?.eventType && !bookingDetails?.service?.name.includes("Video"))&& <> <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Number of Guests: </span><span className="Tag_value"> {bookingDetails?.numberOfGuests}</span>
                            </GridItem>

                            {/* <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Time Duration: </span><span className="Tag_value"> {bookingDetails?.timeDuration}</span>
                            </GridItem> */}
                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Booking Date & Time: </span><span className="Tag_value"> {bookingDetails?.bookingDateFormatted} from {moment(bookingDetails?.bookingStartTime).format('LT')} - {moment(bookingDetails?.bookingEndTime).format('LT')} </span>
                            </GridItem>


                        </GridContainer>
                            <GridContainer className="mt-20">

                                <GridItem className="align_left" xs={12} sm={12} md={3}>
                                    <span className="Tag_title">City: </span><span className="Tag_value"> {bookingDetails?.city}</span>
                                </GridItem>

                                <GridItem className="align_left" xs={12} sm={12} md={3}>
                                    <span className="Tag_title">Country: </span><span className="Tag_value"> {bookingDetails?.country}</span>
                                </GridItem>
                            </GridContainer>

                            <GridContainer className="mt-20">

                                <GridItem className="align_left" xs={12} sm={12} md={8}>
                                    <span className="Tag_title">Complete Address: </span><span className="Tag_value"> {bookingDetails?.completeAddress}</span>
                                </GridItem>
                                <GridItem className="align_left" xs={12} sm={12} md={4}>
                                    <span className="Tag_title">Location : </span>
                                    <u><a className="Tag_value" href={bookingDetails?.browserLocationURL} target="_blank">Google Maps Location</a></u>

                                </GridItem>

                            </GridContainer>
                        </>}
                        {(!bookingDetails?.eventType && bookingDetails?.service?.name.includes("Video")) && <> 
                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Video For :  </span><span className="Tag_value"> {bookingDetails?.videoFor != 'self' ? "Someone Else" : "My Self"}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">My Name : </span><span className="Tag_value"> {bookingDetails?.videoMyName}</span>
                            </GridItem>
                            {bookingDetails?.videoFor != 'self' && <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Their Name : </span><span className="Tag_value"> {bookingDetails?.videoTheirName} </span>
                            </GridItem>}


                        </GridContainer>

                        <GridContainer className="mt-20">
                        <GridItem className="align_left" xs={12} sm={12} md={12}>
                                <span className="Tag_title">Video Message :  </span><span className="Tag_value"> {bookingDetails?.videoMessage}</span>
                            </GridItem>
                            </GridContainer>

                        <GridContainer className="mt-20">

                        <GridItem className="align_left" xs={12} sm={12} md={6}>
                        {bookingDetails?.service?.name.includes("Video M") ? 
                        (<> <span className="Tag_title">Booking Date & Time: </span><span className="Tag_value"> {bookingDetails?.bookingDateFormatted} at  {bookingDetails?.bookingTimeFormatted} </span> </>) 
                               :
                              (<> <span className="Tag_title">Booking Date & Time: </span><span className="Tag_value"> {bookingDetails?.bookingDateFormatted} from {moment(bookingDetails?.bookingStartTime).format('LT')} - {moment(bookingDetails?.bookingEndTime).format('LT')} </span> </>)}
                            </GridItem>

                            {/* <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Time Duration: </span><span className="Tag_value"> {bookingDetails?.timeDuration}</span>
                            </GridItem> */}
                           


                        </GridContainer>
                        </>}
                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Booking Cost: </span><span className="Tag_value"> {bookingDetails?.bookingCost ? 'PKR '+bookingDetails?.bookingCost : '0'}  </span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={3}>
                                <span className="Tag_title">Discount: </span><span className="Tag_value">  {bookingDetails?.discount ? bookingDetails?.discount : '0'} </span>
                            </GridItem>
                        </GridContainer>

                        <GridContainer className="mt-20 mt_70" >
                            <GridItem xs={12} sm={12} md={6}>
                            <Link to={bookingDetails?.bookingBy == 'user' ? `/admin/user/${bookingDetails?.user._id}` : `/admin/${bookingDetails?.funncar.role}/${bookingDetails?.funncar._id}`}>
                                <Card profile>
                                    <CardAvatar profile>
                                        <img src={bookingDetails?.user?.profileImage ? `${BASE_URL}/${bookingDetails?.user?.profileImage}` : require('../../assets/img/noUser.jpg')} />
                                    </CardAvatar>
                                    <CardBody profile>
                                        <h6 className={classes.cardCategory}>Booking Person Name : {bookingDetails?.bookingBy == 'user' ? bookingDetails?.user?.fullName : bookingDetails?.user?.professionalName}</h6>
                                        <h4 className={classes.cardTitle}>Company Name : {bookingDetails?.companyName ? bookingDetails?.companyName : 'No Company Found'}</h4>
                                        <h4 className={classes.cardTitle}>{bookingDetails?.user?.email} ,  {bookingDetails?.user?.phone}</h4>
                                        {/* <p className={`${classes.description} overme`}>{bookingDetails?.user?.bio}</p> */}

                                    </CardBody>
                                </Card>
                                </Link>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                            <Link to={`/admin/${bookingDetails?.funncar.role}/${bookingDetails?.funncar._id}`}>
                                <Card profile>
                                    <CardAvatar profile>
                                        <img src={bookingDetails?.funncar?.profileImage ? `${BASE_URL}/${bookingDetails?.funncar?.profileImage}` : require('../../assets/img/noUser.jpg')} />
                                    </CardAvatar>
                                    <CardBody profile>
                                        <h6 className={classes.cardCategory}> Funncar Name : {bookingDetails?.funncar?.professionalName}</h6>
                                        <h4 className={classes.cardTitle}>{bookingDetails?.funncar?.mainCategory.name}</h4>
                                        <h4 className={classes.cardTitle}>{bookingDetails?.funncar?.city}, {bookingDetails?.funncar?.country}</h4>
                                        {/* <p className={`${classes.description} overme`}>{bookingDetails?.user?.bio}</p> */}

                                    </CardBody>
                                </Card>
                                </Link>
                            </GridItem>


                        </GridContainer>
                        <GridContainer className="mt-20 mt-5">

                            {bookingDetails?.notes && <GridItem className="align_left" xs={12} sm={12} md={12}>
                                <span className="Tag_title">Notes: </span><span className="Tag_value"> {bookingDetails?.notes}</span>
                            </GridItem>}

                        </GridContainer>

                    </CardBody> }
                </Card>

                {/* <JoditEditor
            	ref={editor}
                value={content}
		tabIndex={1} 
		onBlur={newContent => setContent(newContent)} 
                onChange={newContent => {}}
            /> */}

            </GridItem>
        </GridContainer >
    );
}