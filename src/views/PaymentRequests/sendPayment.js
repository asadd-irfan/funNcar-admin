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
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getPaymentRequest, sendPaymentToFunncar } from '../../actions/payments';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';


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

export default function SendPayment() {

  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { Id } = useParams();
  const [selectedValue, setSelectedValue] = useState('same');
  const [amount, setAmount] = useState();
  const [paymentDetails, setPaymentDetails] = useState()

  const handleSend = () => {

    let body = {}
    if (selectedValue == 'other') {
      body = { amount: amount }
    }
    dispatch({ type: UPDATE_LOADING, payload: true });


    sendPaymentToFunncar(Id, body).then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        alert.success(result.data.message)
        getPaymentDetails(Id)
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });

  }

  const getPaymentDetails = (id) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getPaymentRequest(id).then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        setPaymentDetails(result.data.data)
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
      if (error?.response?.status === 404)
        history.push("/admin/payment-requests")
    });

  }
  useEffect(() => {
    getPaymentDetails(Id)
  }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleInputChange = (e) => {
    setAmount(e.target.value)
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
        pathname: "/admin/payment-requests",
        state: { backRedirection: null }
      })
    }
  }

  return (
    <div>
      <Button onClick={goBack} type="submit" color="primary">
        Back
      </Button>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          {paymentDetails && <Card>

            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Send Payment</h4>
            </CardHeader>

            <form
              className={classes.root} autoComplete="off">
              <CardBody>

                <GridContainer className="p-3">

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 style={{ fontWeight: '600', fontSize: 22,  marginTop: 20 }}>
                      Funncar  Details :</h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText="Name" inputProps={{ readOnly: true, type: "text", value: paymentDetails?.funncarId?.professionalName, }} formControlProps={{ fullWidth: true, }} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText="Email" inputProps={{ readOnly: true, type: "text", value: paymentDetails?.email || paymentDetails?.funncarId.email, }} formControlProps={{ fullWidth: true, }} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText="Phone" inputProps={{ readOnly: true, type: "text", value: paymentDetails?.phone || paymentDetails?.funncarId.phone, }} formControlProps={{ fullWidth: true, }} />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 style={{ fontWeight: '600', fontSize: 22,  marginTop: 20 }}>
                      Funncar Bank Details :</h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText=" Bank Name" inputProps={{ readOnly: true, type: "text", value: paymentDetails?.bankName, }} formControlProps={{ fullWidth: true, }} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText=" Account No. / IBAN" inputProps={{ readOnly: true, type: "text", value: paymentDetails?.accountNumber, }} formControlProps={{ fullWidth: true, }} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText=" Request Amount" inputProps={{ readOnly: true, type: "text", value: paymentDetails?.amount, }} formControlProps={{ fullWidth: true, }} />
                  </GridItem>



                  {!paymentDetails?.isPaid && <GridItem xs={12} sm={12} md={12}>
                    <FormControl component="fieldset">

                      <RadioGroup row value={selectedValue} onChange={handleChange} >
                        <FormControlLabel value="same" control={<Radio />} label="Send Same Amount" />
                        <FormControlLabel value="other" control={<Radio />} label="Send Other Amount" />
                      </RadioGroup>
                    </FormControl>
                  </GridItem>}
                    {(selectedValue == 'other' || (paymentDetails?.isPaid && paymentDetails?.otherAmount)) && <GridItem xs={12} sm={12} md={3}>
                      <CustomInput labelText={paymentDetails?.isPaid ? "Sent Amount" : "Other Amount"} inputProps={{ ...(paymentDetails?.isPaid &&{disabled: true}), type: "number", value: amount || paymentDetails?.otherAmount, onChange: handleInputChange }} formControlProps={{ fullWidth: true, }} />
                    </GridItem>}

                  
                </GridContainer>

              </CardBody>
              {!paymentDetails?.isPaid && <CardFooter>
                <Button type="button" color="primary" onClick={() => handleSend()}>Send</Button>
              </CardFooter>}
            </form>
          </Card>}
        </GridItem>


      </GridContainer>
    </div>
  );
}