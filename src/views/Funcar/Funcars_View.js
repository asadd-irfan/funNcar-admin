import React, { useState, useEffect } from "react";

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
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getUserDetail, approveUser, verifyUser } from '../../actions/users';
import ImageViewerContainer from "../../components/ImageViewer"
import VideoViewerContainer from "../../components/VideoViewer"
import  BookingTable from '../bookings/Booking_Table';
import ReviewsList from '../Reviews/reviewsList';

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

export default function FuncarView() {
    // Hooks
    const classes = useStyles();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { Id } = useParams();
    const history = useHistory();

    // state
    const [FuncarDetails, setFuncarDetails] = useState(null);
    const [activeTab,setActiveTab] = useState('images_tab')
    const [imageViewerProps, setImageViewerProps] = useState({
        images: [],
        loading: true,
    });
    const [galleryImages, setgalleryImages] = useState({
        images: [],
        loading: true,
    });
    const [galleryVideos, setGalleryVideos] = useState({
        list: [],
        loading: true,
    });

    const approve = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        approveUser(Id).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                alert.success("Aapproved Successfully")
                getUser()
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
            if (error?.response?.status === 404)
                history.push("/admin/funncars")
        });
    }
    const verify = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        verifyUser(Id).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                alert.success("Verified Successfully")
                getUser()
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
            if (error?.response?.status === 404)
                history.push("/admin/funncars")
        });
    }
    const getUser = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getUserDetail(Id).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                setFuncarDetails(result.data.data)

                // verification docs
                let TempImageViewerProps = { ...imageViewerProps }
                TempImageViewerProps.loading = false
                TempImageViewerProps.images=[]
                if (result.data.data.verificationDocument1) TempImageViewerProps.images.push(`${BASE_URL}/${result.data.data.verificationDocument1}`)
                if (result.data.data.verificationDocument2) TempImageViewerProps.images.push(`${BASE_URL}/${result.data.data.verificationDocument2}`)
                setImageViewerProps(TempImageViewerProps)

                // Gallery
                let TempGalleryImages = { ...galleryImages }
                let TempGalleryVideos = { ...galleryVideos }
                TempGalleryImages.loading = false
                TempGalleryVideos.loading = false
                for (let i in result.data.data.gallery) {
                    if (result.data.data.gallery[i].match(/\.(jpeg|jpg|gif|png|webp)$/) != null) {
                        TempGalleryImages.images.push(`${BASE_URL}/${result.data.data.gallery[i]}`)
                    }
                    else {
                        TempGalleryVideos.list.push(`${BASE_URL}/${result.data.data.gallery[i]}`)
                    }
                }
                setgalleryImages(TempGalleryImages)
                setGalleryVideos(TempGalleryVideos)
            }
            else {
                setImageViewerProps({ ...imageViewerProps, loading: false })
                setgalleryImages({ ...galleryImages, loading: false })
                setGalleryVideos({ ...galleryVideos, loading: false })
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            setImageViewerProps({ ...imageViewerProps, loading: false })
            setgalleryImages({ ...galleryImages, loading: false })
            setGalleryVideos({ ...galleryVideos, loading: false })
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
            if (error?.response?.status === 404)
                history.push("/admin/funncars")
        });
    }

    useEffect(() => {
        getUser()
    }, []);

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={8}>

                {/* Basic Details */}
                <Card profile>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Funncar Preview</h4>
                    </CardHeader>

                    <CardBody profile>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">First Name: </span><span className="Tag_value">{FuncarDetails?.firstName}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Last Name: </span><span className="Tag_value">{FuncarDetails?.lastName}</span>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Phone: </span><span className="Tag_value">{FuncarDetails?.phone}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Email: </span><span className="Tag_value">{FuncarDetails?.email}</span>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">City: </span><span className="Tag_value"> {FuncarDetails?.city}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Country: </span><span className="Tag_value"> {FuncarDetails?.country}</span>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Gender: </span><span className="Tag_value"> {FuncarDetails?.gender}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Attend Private Parties: </span><span className="Tag_value"> {FuncarDetails?.attendPrivateParties === false ? "No" : "Yes"}</span>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Popular: </span><span className="Tag_value"> {FuncarDetails?.isPopular === false ? "No" : "Yes"}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">AVG Rate: </span><span className="Tag_value"> {FuncarDetails?.averageRate}</span>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">Profile Status: </span><span className="Tag_value"> {FuncarDetails?.profileStatus}</span>
                            </GridItem>

                            <GridItem className="align_left" xs={12} sm={12} md={6}>
                                <span className="Tag_title">AVG Rating: </span><span className="Tag_value"> {FuncarDetails?.averageRating}</span>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left flex" xs={12} sm={12} md={12}>
                                <div>
                                    <div className="Tag_title">Categories: </div>
                                </div>
                                <div>
                                    <div className="Tag_value flex" style={{ flexWrap: "wrap" }}>
                                        {FuncarDetails?.categories && FuncarDetails?.categories.length > 0 && FuncarDetails?.categories?.map((item, index) => (
                                            <div className="labe_Tag" key={index}>{item.name}</div>
                                        ))}
                                    </div>
                                </div>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left flex" xs={12} sm={12} md={12}>
                                <div>
                                    <div className="Tag_title">SubCategories: </div>
                                </div>
                                <div>
                                    <div className="Tag_value flex" style={{ flexWrap: "wrap" }}>
                                        {FuncarDetails?.subCategories && FuncarDetails?.subCategories.length > 0 && FuncarDetails?.subCategories?.map((item, index) => (
                                            <div className="labe_Tag" key={index}>{item.name}</div>
                                        ))}
                                    </div>
                                </div>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left flex" xs={12} sm={12} md={12}>
                                <div>
                                    <div className="Tag_title">Achievements: </div>
                                </div>
                                <div>
                                    <div className="Tag_value flex" style={{ flexWrap: "wrap" }}>
                                        {FuncarDetails?.achievements && FuncarDetails?.achievements.length > 0 && FuncarDetails?.achievements?.map((item, index) => (
                                            <div className="labe_Tag" key={index}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left flex" xs={12} sm={12} md={12}>
                                <div>
                                    <div className="Tag_title">Services: </div>
                                </div>
                                <div>
                                    <div className="Tag_value flex" style={{ flexWrap: "wrap" }}>
                                        {FuncarDetails?.services && FuncarDetails?.services.length > 0 && FuncarDetails?.services?.map((item, index) => (
                                            <div className="labe_Tag" key={index}>{item.name}</div>
                                        ))}
                                    </div>
                                </div>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left flex" xs={12} sm={12} md={12}>
                                <div>
                                    <div className="Tag_title">MNG Services: </div>
                                </div>
                                <div>
                                    <div className="Tag_value flex" style={{ flexWrap: "wrap" }}>
                                        {FuncarDetails?.mngServices && FuncarDetails?.mngServices.length > 0 && FuncarDetails?.mngServices?.map((item, index) => (
                                            <div className="labe_Tag" key={index}>{item.name}</div>
                                        ))}
                                    </div>
                                </div>
                            </GridItem>

                        </GridContainer>

                        <GridContainer className="mt-20">

                            <GridItem className="align_left" xs={12} sm={12} md={12}>
                                <span className="Tag_title">Notes: </span><span className="Tag_value"> {FuncarDetails?.notes}</span>
                            </GridItem>

                        </GridContainer>

                    </CardBody>
                </Card>

                {/* Services pricing */}
                <Card>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Services Pricing</h4>
                    </CardHeader>
                    <CardBody>
                        <GridItem className="align_left" xs={12} sm={12} md={12}>
                            {FuncarDetails?.servicesPricing && FuncarDetails?.servicesPricing.length > 0 && FuncarDetails?.servicesPricing?.map((item, index) => (
                                <div key={index} style={{ background: "#fafafa", marginTop: "10px", padding: "15px" }}>
                                    <div style={{ borderBottom: "1px solid #eee", marginBottom: "10px" }}>
                                        <span style={{ fontSize: "17px" }}>{item.serviceType?.name ? item.serviceType?.name : "Instruments"}</span>
                                        {item.timeDuration && <span style={{ float: "right" }}><i className="fa fa-clock-o" aria-hidden="true"></i> {item.timeDuration}</span>}
                                    </div>
                                    <div>
                                        {item?.serviceDetails && item?.serviceDetails.length > 0 && item?.serviceDetails?.map((detailItem, index) => (
                                            <GridContainer className="mt-10" key={index}>
                                                <GridItem className="align_left" xs={12} sm={12} md={12}>
                                                    <span className="">{detailItem?.serviceName?.name}: </span><span className="Tag_value">{detailItem?.price}</span>
                                                </GridItem>
                                            </GridContainer>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </GridItem>
                    </CardBody>
                </Card>

                {/* verification documents */}
                <Card>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Verification Documents</h4>
                    </CardHeader>
                    <CardBody>
                        <ImageViewerContainer {...imageViewerProps} />
                    </CardBody>
                </Card>

                {/* Gallery */}
                <Card>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Gallery</h4>
                    </CardHeader>
                    <CardBody>

                        <ul className="nav nav-tabs">
                            <li onClick={()=>setActiveTab('images_tab')} className={activeTab==="images_tab" ? "active" :""}><a>Images</a></li>
                            <li onClick={()=>setActiveTab('videos_tab')} className={activeTab==="videos_tab" ? "active" :""}><a>Videos</a></li>
                        </ul>

                        <div className="tab-content">
                            <div className={activeTab==="images_tab" ? "tab-pane fade in active" : "tab-pane fade"} >
                                <GridContainer className="mt-20">
                                    <GridItem xs={12} sm={12} md={12}>
                                        <ImageViewerContainer {...galleryImages} />
                                    </GridItem>
                                </GridContainer>
                            </div>
                            <div className={activeTab==="videos_tab" ? "tab-pane fade in active" : "tab-pane fade"}>
                                <GridContainer className="mt-20">
                                    <GridItem xs={12} sm={12} md={12}>
                                        <VideoViewerContainer {...galleryVideos} />
                                    </GridItem>
                                </GridContainer>
                            </div>
                        </div>

                    </CardBody>
                </Card>

            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
                <Card profile>
                    <CardAvatar profile>
                        <img src={FuncarDetails?.profileImage ? `${BASE_URL}/${FuncarDetails?.profileImage}` : require('../../assets/img/noUser.jpg')} />
                    </CardAvatar>
                    <CardBody profile>
                        <h6 className={classes.cardCategory}>{FuncarDetails?.mainCategory.name}</h6>
                        <h4 className={classes.cardTitle}>{FuncarDetails?.professionalName}</h4>
                        <p className={`${classes.description} overme`}>{FuncarDetails?.bio}</p>
                        {FuncarDetails ? (FuncarDetails?.profileApproved.status === false ?
                            <Button onClick={approve} color="primary" round>Approve</Button> :
                            <Button color="primary" round disabled><i className="fa fa-check" aria-hidden="true" style={{ paddingRight: "5px" }}></i>Approved</Button>) : ""
                        }
                        {FuncarDetails ? (FuncarDetails?.isVerified === false ?
                            <Button onClick={verify} color="primary" round>Verify</Button> :
                            <Button color="primary" round disabled><i className="fa fa-check" aria-hidden="true" style={{ paddingRight: "5px" }}></i>Verified</Button>) : ""
                        }
                    </CardBody>
                </Card>
            </GridItem>
            <BookingTable role={FuncarDetails?.role} Id={Id}/>
            <ReviewsList Id={Id} AverageRating={FuncarDetails?.averageRating} />
        </GridContainer >
    );
}