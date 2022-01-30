import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from "react-alert";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  getBookingDetails,
  sendDisputeBookingPayment,
} from "../../actions/bookings";

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

export default function SendBookingPayment() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { Id } = useParams();
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [disputeResolved, setDisputeResolved] = useState(true);
  const [bookingDetails, setBookingDetail] = useState(null);
  const { USD_rate } = useSelector((state) => state.auth?.appSettings);

  const BookingTotalCost = bookingDetails?.currency == 'PKR' ? bookingDetails?.totalCost : bookingDetails?.totalCost * USD_rate;
  const handleSend = (e) => {
    e.preventDefault();
    let body = {
      amount: amount ? parseInt(amount) : 0,
      disputeResolved,
      disputeBookingUserNotes: description,
    };
    dispatch({ type: UPDATE_LOADING, payload: true });
    sendDisputeBookingPayment(Id, body)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(result.data.message);
        } else {
          alert.error(
            result.data.message
              ? result.data.message
              : APP_ERROR_MSGS.StandardErrorMsg
          );
        }
        getBookingDetailById(Id);
      })
      .catch((error) => {
        getBookingDetailById(Id);
        dispatch({ type: UPDATE_LOADING, payload: false });
        alert.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : APP_ERROR_MSGS.StandardErrorMsg
        );
      });
  };
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleInputChange = (e) => setAmount(e.target.value);
  const getBookingDetailById = (id) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getBookingDetails(id)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          setBookingDetail(result.data.data);
          let total = result.data.data?.currency == 'PKR' ? result.data.data?.totalCost : result.data.data?.totalCost * USD_rate;
          setAmount(total - result.data.data?.paymentReturnToBookingUser);
          setDescription(result.data?.data?.disputeBookingUserNotes || "");
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
        if (error?.response?.status === 404)
          history.push("/admin/dispute-bookings");
      });
  };
  const goBack = () => {
    let redirectState = history.location.state?.backRedirection
      ? history.location.state?.backRedirection
      : null;
    if (redirectState) {
      history.push({
        pathname: redirectState.redirectToURL,
        search: redirectState.search,
        state: { backRedirection: redirectState.data },
      });
    } else {
      history.push({
        pathname: "/admin/dispute-bookings",
        state: { backRedirection: null },
      });
    }
  };
  useEffect(() => {
    getBookingDetailById(Id);
  }, []);

  return (
    <div>
      <Button onClick={goBack} type="submit" color="primary">
        Back
      </Button>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Send Payment to Booking Person</h4>
            </CardHeader>

            <form
              onSubmit={handleSend}
              className={classes.root}
              autoComplete="off"
            >
              <CardBody>
                <GridContainer className="p-3">
               {bookingDetails && <>
               <GridItem className="align_left mb-3" xs={12} sm={12} md={3}>
                        <span className="Tag_title"> Booking ID: </span>
                        <span className="Tag_value">
                        {bookingDetails?.bookingId}
                        </span>
                      </GridItem>
               <GridItem className="align_left mb-3" xs={12} sm={12} md={3}>
                        <span className="Tag_title"> Booking Status: </span>
                        <span className="Tag_value">
                        {bookingDetails?.status}
                        </span>
                      </GridItem>
               <GridItem className="align_left mb-3" xs={12} sm={12} md={6}>
                        <span className="Tag_title">Total Booking Cost / Net Amount: </span>
                        <span className="Tag_value">
                        {BookingTotalCost}
                        </span>
                      </GridItem>
                      <GridItem className="align_left" xs={12} sm={12} md={6}>
                      <span className="Tag_title">Amount Sent To Booking Person: </span>
                        <span className="Tag_value">
                          {bookingDetails?.paymentReturnToBookingUser}
                        </span>
                      </GridItem>
                      <GridItem className="align_left" xs={12} sm={12} md={6}>
                        <span className="Tag_title">Remaining Amount Of Booking Person: </span>
                        <span className="Tag_value">
                          {BookingTotalCost - bookingDetails?.paymentReturnToBookingUser}
                        </span>
                      </GridItem></>}
                      </GridContainer>
                      <GridContainer className="p-3">
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Amount:"
                      inputProps={{
                        type: "number",
                        disabled: BookingTotalCost == bookingDetails?.paymentReturnToBookingUser,
                        value: amount,
                        onChange: handleInputChange,
                      }}
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </GridItem>

                  {/* <GridItem className="flex_end_checbox" xs={12} sm={12} md={4}>
                    <label className="checkbox-container">
                      Dispute Resolved
                      <input
                        type="checkbox"
                        defaultChecked={disputeResolved}
                        onClick={() => setDisputeResolved(!disputeResolved)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </GridItem> */}

                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Description"
                      id="description"
                      formControlProps={{ fullWidth: true, required: true }}
                      inputProps={{
                        disabled: BookingTotalCost == bookingDetails?.paymentReturnToBookingUser,
                        multiline: true,
                        rows: 8,
                        value: description,
                        onChange: handleDescriptionChange,
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button type="submit" color="primary"
                disabled={BookingTotalCost == bookingDetails?.paymentReturnToBookingUser}
                >
                  Send
                </Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
