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
import CardAvatar from "../../components/Card/CardAvatar.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getAppSettings, updateAppSettings } from '../../actions/common';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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

export default function Settings() {

  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();

  const [FormInputs, setFormInputs] = useState({
    percentage: 0,
    startDate: new Date(),
    endDate: new Date(),
    rejectBookingPercentage: 0,
    cancelBookingPercentage: 0,
    USD_rate: 0,
  });

  const handleDate = (date, type) => {
    if (type == 'start') setFormInputs({ ...FormInputs, startDate: date })
    if (type == 'end') setFormInputs({ ...FormInputs, endDate: date })
  }
  const handleFormInputChange = (e) => {
    const fieldId = e.currentTarget.id
    setFormInputs({
      ...FormInputs,
      [fieldId]: e.currentTarget.value,
    })
  }


  const handleFormSubmit = (e) => {
    console.log(FormInputs);
    e.preventDefault();
    if ((parseInt(FormInputs.percentage) < 1 || parseInt(FormInputs.percentage) > 100) ||
      (parseInt(FormInputs.cancelBookingPercentage) < 1 || parseInt(FormInputs.cancelBookingPercentage) > 100) ||
      (parseInt(FormInputs.rejectBookingPercentage) < 1 || parseInt(FormInputs.rejectBookingPercentage) > 100)) {
      alert.error("Percentage must be less than 100 and greater than 0")
    } else {
      dispatch({ type: UPDATE_LOADING, payload: true });


      let param = {
        "funncarServiceCharges": {
          "percentage": FormInputs.percentage,
          "startDate": FormInputs.startDate,
          "endDate": FormInputs.endDate
        },
        "cancelBookingPercentage": FormInputs.cancelBookingPercentage,
        "rejectBookingPercentage": FormInputs.rejectBookingPercentage,
        "USD_rate": FormInputs.USD_rate,
      }

      updateAppSettings(param).then(result => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(APP_ERROR_MSGS.SaveMsg)
        }
        else {
          alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
        }
      }).catch(error => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
      });
    }
  }

  useEffect(() => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getAppSettings().then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        const { funncarServiceCharges, cancelBookingPercentage, rejectBookingPercentage, USD_rate } = result.data.data
        setFormInputs({
          ...FormInputs,
          "percentage": funncarServiceCharges.percentage,
          "startDate": funncarServiceCharges.startDate,
          "endDate": funncarServiceCharges.endDate
          , cancelBookingPercentage, rejectBookingPercentage, USD_rate
        })
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
      if (error?.response?.status === 404)
        history.push("/admin/dashboard")
    });
  }, []);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>

            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Update App Settings</h4>
              {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
            </CardHeader>

            <form onSubmit={handleFormSubmit} className={classes.root} autoComplete="off">
              <CardBody>

                <GridContainer className="p-3">

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 style={{ fontWeight: '600', fontSize: 22, marginBottom: 10, marginTop: 10 }}>
                      Funncar Service Charges</h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText="Funncar Service Charges Percentage" id="percentage" inputProps={{ type: "number", value: FormInputs.percentage, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />

                  <GridItem xs={12} sm={12} md={3} className="m-2">

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker className="mb-3"
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        autoOk={true} margin="normal"
                        id="date-picker-inline"
                        label="Start Date"
                        value={FormInputs.startDate}
                        onChange={(date) => handleDate(date, 'start')}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}

                      />
                    </MuiPickersUtilsProvider>

                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />

                  <GridItem xs={12} sm={12} md={3} className="m-2">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                      <KeyboardDatePicker className="mb-3"
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        autoOk={true} margin="normal"
                        id="date-picker-inline"
                        label="End Date"
                        value={FormInputs.endDate}
                        onChange={(date) => handleDate(date, 'end')}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}

                      />
                    </MuiPickersUtilsProvider>
                    {/* <CustomInput labelText="End Date" id="phone" inputProps={{ type: "text", value: FormInputs.endDate, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true }} /> */}
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 style={{ fontWeight: '600', fontSize: 22, marginBottom: 10, marginTop: 10 }}>
                      Funncar Reject Booking Percentage</h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText=" Reject Booking Percentage" id="rejectBookingPercentage" inputProps={{ type: "number", value: FormInputs.rejectBookingPercentage, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 style={{ fontWeight: '600', fontSize: 22, marginBottom: 10, marginTop: 10 }}>
                      Funncar Cancel Booking Percentage</h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText=" Cancel Booking Percentage" id="cancelBookingPercentage" inputProps={{ type: "number", value: FormInputs.cancelBookingPercentage, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 style={{ fontWeight: '600', fontSize: 22, marginBottom: 10, marginTop: 10 }}>
                      USD Rate In App</h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput labelText=" USD Rate" id="USD_rate" inputProps={{ type: "number", value: FormInputs.USD_rate, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                  </GridItem>
                </GridContainer>

              </CardBody>
              <CardFooter>
                <Button type="submit" color="primary">SAVE</Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>


      </GridContainer>
    </div>
  );
}