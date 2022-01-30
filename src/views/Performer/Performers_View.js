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
import { useHistory, useParams, Link } from 'react-router-dom'
import { getUserDetail, approveUser, verifyUser, updateUser } from '../../actions/users';
import ImageViewerContainer from "../../components/ImageViewer"
import VideoViewerContainer from "../../components/VideoViewer"
import BookingTable from '../bookings/Booking_Table';
import ReviewsList from '../Reviews/reviewsList';
import { numberWithCommas } from "../../common/commonMethods"
import moment from 'moment';
import UserTransactions from '../Transactions/UserTransactions';
import Wallet from '../Wallet/index';

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

export default function PerformerView() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { Id } = useParams();
  const history = useHistory();
  const user = useSelector(state => state.auth.user);

  // state
  const [FuncarDetails, setFuncarDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('images_tab')
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
        history.push("/admin/performers")
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
        history.push("/admin/performers")
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
        TempImageViewerProps.images = []
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
        history.push("/admin/performers")
    });
  }

  useEffect(() => {
    getUser()
  }, []);

  const undoVerify = () => {

    let param = {
      isVerified: false
    }

    dispatch({ type: UPDATE_LOADING, payload: true });
    updateUser(Id, param).then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        alert.success(APP_ERROR_MSGS.SaveMsg)
        getUser()
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });
  }

  const undoApprove = () => {

    let param = {
      profileApproved: {
        status: false
      }
    }

    dispatch({ type: UPDATE_LOADING, payload: true });
    updateUser(Id, param).then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        alert.success(APP_ERROR_MSGS.SaveMsg)
        getUser()
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });

  }

  const goBack = () =>{
    let redirectState = history.location.state?.backRedirection ? history.location.state?.backRedirection : null
    if(redirectState){
      history.push({
        pathname: redirectState.redirectToURL,
        search: redirectState.search,
        state: { backRedirection: redirectState.data }
      })
    } else {
      history.push({
        pathname: "/admin/performers",
        state: { backRedirection: null }
      })
    }
  }
  const editRecord = () =>{
    let state ={
      redirectToURL: `/admin/performer/${Id}`,
      data: null,
      search: null
    }
    history.push({
      pathname: `/admin/Performer_Edit/${Id}`,
      state: { backRedirection: state }
    })
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={8}>

      <Button onClick={goBack} type="submit" color="primary">
        Back
      </Button>

        <Button onClick={editRecord} type="button" color="primary">
          Edit
        </Button>

        {/* Basic Details */}
        <Card profile>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Performer Preview</h4>
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

          {user.isSuperAdmin && <GridContainer className="mt-20">

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Phone: </span><span className="Tag_value">{FuncarDetails?.phone}</span>
              </GridItem>

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Email: </span><span className="Tag_value">{FuncarDetails?.email}</span>
              </GridItem>

            </GridContainer>}

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

              {/* <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Attend Private Parties: </span><span className="Tag_value"> {FuncarDetails?.attendPrivateParties === false ? "No" : "Yes"}</span>
              </GridItem> */}

            </GridContainer>

            <GridContainer className="mt-20">

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Popular: </span><span className="Tag_value"> {FuncarDetails?.isPopular === false ? "No" : "Yes"}</span>
              </GridItem>

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Starting from: </span><span className="Tag_value"> {numberWithCommas(FuncarDetails?.averageRate)}  {FuncarDetails?.currency}</span>
              </GridItem>

            </GridContainer>

            <GridContainer className="mt-20">

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Registered From Device: </span>
                <span className="Tag_value">{FuncarDetails?.registeredFromDevice} </span>
              </GridItem>

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">AVG Rating: </span><span className="Tag_value"> {FuncarDetails?.averageRating}</span>
              </GridItem>

            </GridContainer>

            <GridContainer className="mt-20">
              <GridItem className="align_left" xs={12} sm={12} md={12}>
                <span className="Tag_title">Joining Date: </span><span className="Tag_value">{FuncarDetails?.createdAt ? moment(FuncarDetails?.createdAt).format("llll") : ""}</span>
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
              <GridItem className="align_left" xs={12} sm={12} md={12}>
                <span className="Tag_title">Excludes: </span><span className="Tag_value"> {FuncarDetails?.excludes}</span>
              </GridItem>
              <GridItem className="align_left" xs={12} sm={12} md={12}>
                <span className="Tag_title">Includes: </span><span className="Tag_value"> {FuncarDetails?.includes}</span>
              </GridItem>

            </GridContainer>
            <GridContainer className="mt-20">

              <GridItem className="align_left" xs={12} sm={12} md={12}>
                <span className="Tag_title">Service Charges Status: </span>
                <span className="Tag_value"> {FuncarDetails?.serviceCharges?.status ? "Enable" : "Disable"} </span>
              </GridItem>
              {FuncarDetails?.serviceCharges?.status && <><GridItem className="align_left" xs={12} sm={12} md={12}>
                <span className="Tag_title">Service Charges Percentage: </span>
                <span className="Tag_value"> {FuncarDetails?.serviceCharges?.percentage} %</span>
              </GridItem>
                <GridItem className="align_left" xs={12} sm={12} md={4}>
                  <span className="Tag_title">Start Date: </span>
                  <span className="Tag_value"> {moment(FuncarDetails?.serviceCharges?.startDate).format('YYYY-MM-DD')}</span>
                </GridItem>
                <GridItem className="align_left" xs={12} sm={12} md={4}>
                  <span className="Tag_title">End Date: </span>
                  <span className="Tag_value"> {moment(FuncarDetails?.serviceCharges?.endDate).format('YYYY-MM-DD')}</span>
                </GridItem></>}

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
                <div style={{ background: "#fafafa", marginTop: "10px", padding: "15px" }} key={index}>
                  <div style={{ borderBottom: "1px solid #eee", marginBottom: "10px" }}>
                    <span style={{ fontSize: "17px" }}>{item.serviceType?.name}</span>
                    {item.timeDuration && <span style={{ float: "right" }}><i className="fa fa-clock-o" aria-hidden="true"></i> {item.timeDuration}</span>}
                  </div>
                  <div>
                    {item?.serviceDetails && item?.serviceDetails.length > 0 && item?.serviceDetails?.map((detailItem, index) => (<>
                      {(detailItem?.serviceName?.name && detailItem?.price && detailItem?.price != 0) ? <GridContainer className="mt-10" key={index}>
                        <GridItem className="align_left" xs={12} sm={12} md={12}>
                          <span >{detailItem?.serviceName?.name}:</span><span className="Tag_value ml-2">{numberWithCommas(detailItem?.price)} {FuncarDetails?.currency}</span>
                        </GridItem>
                      </GridContainer> : <></>} </>
                    ))}
                  </div>
                </div>
              ))}
            </GridItem>
          </CardBody>
        </Card>

        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Commission Rates</h4>
          </CardHeader>
          <CardBody>
            <GridContainer className="mt-20">

              {!FuncarDetails?.serviceCharges?.status && <GridItem className="align_left" xs={12} sm={12} md={12}>
                <span className="Tag_title">Status: </span>
                <span className="Tag_value"> {FuncarDetails?.serviceCharges?.status ? "Enable" : "Disable"} </span>
              </GridItem>}
              {FuncarDetails?.serviceCharges?.status && <>
                {FuncarDetails?.commissionRate?.map((item, i) => {
                  return (<><div key={i}>
                    <GridContainer className="mt-20">
                      <GridItem xs={12} sm={12} md={8}>
                        <span className="Tag_title">Card Title: </span>
                        <span className="Tag_value"> {item.cardTitle}</span>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                        <span className="Tag_title">Percentage: </span>
                        <span className="Tag_value"> {item.percentage} %</span>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <span className="Tag_title">Card Description: </span>
                        <span className="Tag_value"> {item.cardDescription}</span>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <span className="Tag_title">Start Date: </span>
                        <span className="Tag_value"> {moment(item.startDate).format('YYYY-MM-DD')}</span>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <span className="Tag_title">End Date: </span>
                        <span className="Tag_value"> {moment(item.endDate).format('YYYY-MM-DD')}</span>
                      </GridItem>
                    </GridContainer>
                  </div> <hr /> </>
                  )
                })}
              </>}

            </GridContainer>
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
              <li onClick={() => setActiveTab('images_tab')} className={activeTab == "images_tab" ? "active" : ""}><a>Images</a></li>
              <li onClick={() => setActiveTab('videos_tab')} className={activeTab == "videos_tab" ? "active" : ""}><a>Videos</a></li>
            </ul>

            <div className="tab-content">
              <div className={activeTab == "images_tab" ? "tab-pane fade in active" : "tab-pane fade"} >
                <GridContainer className="mt-20">
                  <GridItem xs={12} sm={12} md={12}>
                    <ImageViewerContainer {...galleryImages} />
                  </GridItem>
                </GridContainer>
              </div>
              <div className={activeTab == "videos_tab" ? "tab-pane fade in active" : "tab-pane fade"}>
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
          <CardBody profile className="pl-0 pr-0">
            <h6 className={classes.cardCategory}>{FuncarDetails?.mainCategory.name}</h6>
            <h4 className={classes.cardTitle}>{FuncarDetails?.professionalName}</h4>
            <p className={`${classes.description} overme pl-3 pr-3`}>{FuncarDetails?.bio}</p> <br />
            <b> Approved Status:</b> {FuncarDetails?.profileApproved?.status ? "Approved" : "Not Approved"} <br />
            <b>Verify Status:</b> {FuncarDetails?.isVerified ? "Verified" : "Not Verified"} <br />

            {FuncarDetails ? (FuncarDetails?.profileApproved.status === false ?
              <Button className="my-3" onClick={approve} color="primary" round>Approve</Button> :
              <Button className="my-3" onClick={undoApprove} color="danger" round >
                {/* <i className="fa fa-check" aria-hidden="true" style={{ paddingRight: "5px" }}></i> */}
                Undo Approved</Button>) : ""
            }
            {FuncarDetails ? (FuncarDetails?.isVerified === false ?
              <Button className="my-3" onClick={verify} color="primary" round>Verify</Button> :
              <Button className="my-3" onClick={undoVerify} color="danger" round >
                {/* <i className="fa fa-check" aria-hidden="true" style={{ paddingRight: "5px" }}></i> */}
                Undo Verified</Button>) : ""
            }
          </CardBody>
        </Card>
      </GridItem>
      <BookingTable role={FuncarDetails?.role} Id={Id} status="notCompleted" />
      <BookingTable role={FuncarDetails?.role} Id={Id} status="completed" />
      <ReviewsList Id={Id} AverageRating={FuncarDetails?.averageRating} />

      <Wallet wallet={FuncarDetails?.wallet} id={Id} getUser={getUser} />
      <UserTransactions id={Id} role={'Performer'} user={FuncarDetails} authUser={user}/>
    </GridContainer >
  );
}