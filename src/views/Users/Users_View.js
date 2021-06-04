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
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';
import {  useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getUserDetail } from '../../actions/users';
import  BookingTable from '../bookings/Booking_Table';

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

export default function UserView() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { Id } = useParams();
  const history = useHistory();

  // state
  const [UserDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    profileImage: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getUserDetail(Id).then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        let { fullName, email, phone, role, profileImage, createdAt, updatedAt } = result.data.data
        setUserDetails({
          ...UserDetails,
          fullName, email, phone, role, createdAt, updatedAt, profileImage
        })
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
      if (error?.response?.status === 404)
        history.push("/admin/users")
    });
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={8}>
        <Card profile>
          <CardHeader  color="primary">
            <h4 className={classes.cardTitleWhite}>Fan Preview</h4>
          </CardHeader>

          <CardBody >
            <CardAvatar isPreview={true} profile>
              <img src={UserDetails.profileImage ? `${BASE_URL}/${UserDetails.profileImage}` : require('../../assets/img/noUser.jpg')} />
            </CardAvatar>

            <GridContainer className="mt-20">

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Full Name: </span><span className="Tag_value">{UserDetails.fullName}</span>
              </GridItem>

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Email: </span><span className="Tag_value">{UserDetails.email}</span>
              </GridItem>

            </GridContainer>

            <GridContainer className="mt-20">

              <GridItem className="align_left" xs={12} sm={12} md={6}>
                <span className="Tag_title">Phone: </span><span className="Tag_value">{UserDetails.phone}</span>
              </GridItem>

            </GridContainer>

          </CardBody>
        </Card>
      </GridItem>
      <BookingTable role={UserDetails?.role} Id={Id}/>
    </GridContainer>
  );
}