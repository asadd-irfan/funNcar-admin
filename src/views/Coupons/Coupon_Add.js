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
import { APP_ERROR_MSGS, BASE_URL } from "../../common/constants";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createCoupon, updateCoupon, getCoupon } from "../../actions/bookings";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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

export default function CouponAdd() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { Id } = useParams();
  const history = useHistory();

  // state

  const [FormInputs, setFormInputs] = useState({
    code: "",
    usageLimitPerCoupon: 0,
    percentageDiscount: 0,
    isActive: false,
    expiryDate: new Date(),
  });
  // console.log(formData);
  const handleFormInputChange = (e) => {
    const fieldId = e.currentTarget.id;
    setFormInputs({
      ...FormInputs,
      [fieldId]: e.currentTarget.value,
    });
  };

  const saveCoupon = (body) => {
    dispatch({ type: UPDATE_LOADING, payload: true });

    console.log(body);
    createCoupon(body)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(APP_ERROR_MSGS.SaveMsg);
          history.push("/admin/coupons");
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
      });
  };
  const updateCouponDetails = (param) => {
    dispatch({ type: UPDATE_LOADING, payload: true });

    updateCoupon(Id, param)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(APP_ERROR_MSGS.SaveMsg);
          history.push("/admin/coupons");
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
      });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      parseInt(FormInputs.percentageDiscount) >= 100 ||
      parseInt(FormInputs.percentageDiscount) <= 0
    )
      return alert.error(
        "Percentage Discount must be less than 100% and greater than 0."
      );

    let param = {
      ...FormInputs,
    };

    if (Id) {
      updateCouponDetails(param);
    } else {
      saveCoupon(param);
    }
  };

  useEffect(() => {
    if (Id) {
      dispatch({ type: UPDATE_LOADING, payload: true });
      getCoupon(Id)
        .then((result) => {
          dispatch({ type: UPDATE_LOADING, payload: false });
          console.log(result);
          if (result.data.status === true) {
            let {
              isActive,
              code,
              usageLimitPerCoupon,
              expiryDate,
              percentageDiscount,
            } = result.data.data;
            setFormInputs({
              ...FormInputs,
              isActive,
              code,
              usageLimitPerCoupon,
              expiryDate,
              percentageDiscount,
            });
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
          if (error?.response?.status === 404) history.push("/admin/coupons");
        });
    }
  }, []);

  const handleDate = (date) => {
    setFormInputs({ ...FormInputs, expiryDate: date });
  };
  const handleStatus = (e) => {
    setFormInputs({
      ...FormInputs,
      isActive: e.target.checked,
    });
  };
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
        pathname: "/admin/coupons",
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
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                {Id ? "Edit Coupon" : "Create Coupon"}
              </h4>
            </CardHeader>

            <form
              onSubmit={handleFormSubmit}
              className={classes.root}
              autoComplete="off"
            >
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Coupon Code"
                      id="code"
                      inputProps={{
                        type: "text",
                        value: FormInputs.code,
                        onChange: handleFormInputChange,
                      }}
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        autoOk={true}
                        margin="normal"
                        id="date-picker-inline"
                        label="Expiry Date"
                        value={FormInputs.expiryDate}
                        onChange={(date) => handleDate(date)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Usage Limit Per Coupon"
                      id="usageLimitPerCoupon"
                      inputProps={{
                        type: "number",
                        value: FormInputs.usageLimitPerCoupon,
                        onChange: handleFormInputChange,
                      }}
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Percentage Discount"
                      id="percentageDiscount"
                      inputProps={{
                        type: "number",
                        value: FormInputs.percentageDiscount,
                        onChange: handleFormInputChange,
                      }}
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4}>
                    <FormGroup row className="mt-3">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={FormInputs.isActive}
                            onChange={handleStatus}
                            color="primary"
                          />
                        }
                        label="Active Status"
                      />
                    </FormGroup>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button type="submit" color="primary">
                  SAVE
                </Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
