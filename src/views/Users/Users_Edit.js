import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
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
import { FormControl } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from "react-alert";
import { APP_ERROR_MSGS, BASE_URL } from "../../common/constants";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  getUserDetail,
  updateUser,
  uploadUserImage,
} from "../../actions/users";


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

export default function UserEdit() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { Id } = useParams();
  const history = useHistory();
  const FilesInput = React.createRef();
  const user = useSelector(state => state.auth.user);

  // state
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [FormInputs, setFormInputs] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    profileImage: "",
    createdAt: "",
    updatedAt: "",
    isBlock: false,
  });

  const handleFormInputChange = (e) => {
    const fieldId = e.currentTarget.id;
    setFormInputs({
      ...FormInputs,
      [fieldId]: e.currentTarget.value,
    });
  };
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      dispatch({ type: UPDATE_LOADING, payload: true });
      let formData = new FormData();
      formData.append("profileImage", e.target.files[0]);
      uploadUserImage(Id, formData)
        .then((result) => {
          dispatch({ type: UPDATE_LOADING, payload: false });
          if (result.data.status === true) {
            // setIsImageChanged(true);
            setFormInputs({
              ...FormInputs,
              profileImage: result.data.data.profileImage,
            });
            alert.success(APP_ERROR_MSGS.SaveMsg);
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
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: UPDATE_LOADING, payload: true });
    let param = {
      fullName: FormInputs.fullName,
      email: FormInputs.email,
      phone: FormInputs.phone,
      isBlock: FormInputs.isBlock,
    };
    updateUser(Id, param)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(APP_ERROR_MSGS.SaveMsg);
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

  useEffect(() => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getUserDetail(Id)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          let {
            fullName,
            email,
            phone,
            role,
            profileImage,
            createdAt,
            updatedAt,
            isBlock,
          } = result.data.data;
          setFormInputs({
            ...FormInputs,
            fullName,
            email,
            phone,
            role,
            createdAt,
            updatedAt,
            profileImage,
            isBlock,
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
        if (error?.response?.status === 404) history.push("/admin/users");
      });
  }, []);

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
        pathname: "/admin/users",
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
              <h4 className={classes.cardTitleWhite}>Edit Fan</h4>
              {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
            </CardHeader>

            <form
              onSubmit={handleFormSubmit}
              className={classes.root}
              autoComplete="off"
            >
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Full Name"
                      id="fullName"
                      inputProps={{
                        type: "text",
                        value: FormInputs.fullName,
                        onChange: handleFormInputChange,
                      }}
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </GridItem>

                  {user.isSuperAdmin &&<>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      inputProps={{
                        type: "email",
                        value: FormInputs.email,
                        onChange: handleFormInputChange,
                      }}
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Phone"
                      id="phone"
                      inputProps={{
                        type: "text",
                        value: FormInputs.phone,
                        onChange: handleFormInputChange,
                      }}
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </GridItem>
                  </>}

                  <GridItem className="mt-2" xs={12} sm={12} md={12}>
                    <label className="checkbox-container">
                      Blocked
                      <input
                        type="checkbox"
                        defaultChecked={FormInputs.isBlock == true ? true : false}
                        onClick={() =>
                          setFormInputs({
                            ...FormInputs,
                            isBlock: !FormInputs.isBlock,
                          })
                        }
                      />
                      <span className="checkmark"></span>
                    </label>
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
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <img
                src={
                  isImageChanged
                    ? FormInputs.profileImage
                    : FormInputs.profileImage
                    ? `${BASE_URL}/${FormInputs.profileImage}`
                    : require("../../assets/img/noUser.jpg")
                }
              />
            </CardAvatar>
            <CardBody profile>
              <input
                type="file"
                name="myImage"
                hidden
                accept="image/*"
                onChange={handleImageChange}
                ref={FilesInput}
              />
              <a
                className="ancher_link"
                onClick={() => FilesInput.current.click()}
              >
                Change
              </a>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
