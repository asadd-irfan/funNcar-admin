import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import Card1 from "../../components/Card/Card.js";
import CardHeader1 from "../../components/Card/CardHeader.js";

import AlertDialog from "../../components/Modals/AlertModal";
// import Pagination from '@material-ui/lab/Pagination';
import Divider from "@material-ui/core/Divider";

// import GridContainer from "../../components/Grid/GridContainer.js";

import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from "react-alert";
import { APP_ERROR_MSGS, BASE_URL } from "../../common/constants";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CardBody from "../../components/Card/CardBody.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { allNotifications, markReadNotification } from "../../actions/common";
import { SET_NOTIFICATION_COUNT } from "../../actions/types";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "@material-ui/icons";
import FormGroup from "@material-ui/core/FormGroup";

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
      lineHeight: "1",
    },
  },
  root: {
    minWidth: 275,
    paddingTop: 15,
    marginTop: 15,
    marginBottom: 5,
    paddingBottom: 5,
  },

  pos: {
    paddingTop: 10,
    paddingBottom: 10,
  },
};
const useStyles = makeStyles(styles);

export default function Notifications() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();

  const filterTypes = [
    { value: "Profile Approval Request", label: "Profile Approval" },
    { value: "Profile Verification Request", label: "Profile Verification" },
    { value: "Payment Request", label: "Payment Request" },
  ];

  // state
  const [status, setStatus] = useState("");
  const [notificationsList, setNotificationsList] = useState();
  const [AlertModalProps, setAlertModalProps] = useState({
    open: false,
    title: "",
    message: "",
    firstCallback: () => {},
    secondCallback: () => {},
  });

  const handleStatusChange = (e) => {
    setStatus(e.currentTarget.value);
  };

  const getNotifications = () => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    let paramString = status ? `?title=${status}` : "";
    allNotifications(paramString)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          setNotificationsList(result.data.data);
          dispatch({
            type: SET_NOTIFICATION_COUNT,
            payload: result.data.unReadNotifications,
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
      });
  };

  useEffect(() => {
    getNotifications();
  }, [status]);

  const onclickNotification = (path, id, isRead) => {
    if (isRead) {
      history.push(path);
    } else {
      dispatch({ type: UPDATE_LOADING, payload: true });
      markReadNotification(id)
        .then((result) => {
          dispatch({ type: UPDATE_LOADING, payload: false });
          // console.log(result.data);
          if (result.data.status === true) {
            getNotifications();
            history.push(path);
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

  return (
    <>
      <AlertDialog
        {...AlertModalProps}
        setOpen={(resp) => {
          setAlertModalProps({ ...AlertModalProps, open: resp });
        }}
      />

      <GridItem xs={12} sm={12} md={12}>
        <FormGroup
          row
          className="d-flex"
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <select
              style={{ height: "35px", minWidth: "250px", margin: 10 }}
              value={status}
              onChange={handleStatusChange}
            >
              <option value={""}>Notification Type</option>
              {filterTypes.map((item, i) => {
                return (
                  <option key={i} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
          </div>
        </FormGroup>
      </GridItem>

      <GridItem xs={12} sm={12} md={12}>
        <Card1>
          <CardHeader1
            color="primary"
            className="d-flex"
            style={{ justifyContent: "space-between" }}
          >
            <h4 className={classes.cardTitleWhite}>All Notifications</h4>
          </CardHeader1>
          <CardBody>
            {notificationsList?.length == 0 && (
              <div className="row d-flex justify-content-center mt-3">
                No Notifications found!
              </div>
            )}
            {notificationsList?.length > 0 &&
              notificationsList?.map((item, i) => {
                return (
                  <div
                    key={i}
                    style={!item.isRead ? { background: "#d4faff" } : {}}
                  >
                    <ListItem
                      alignItems="flex-start"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        onclickNotification(
                          item.referenceLink,
                          item._id,
                          item.isRead
                        )
                      }
                    >
                      <ListItemText
                        // primary={item.title}
                        secondary={
                          <>
                            <span style={{ fontWeight: "bold" }}>
                              {item.title}
                            </span>{" "}
                            ( {item.description} )
                          </>
                        }
                      />
                    </ListItem>

                    <Divider />
                  </div>
                );
              })}
          </CardBody>
        </Card1>
      </GridItem>
    </>
  );
}
