import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/CustomButtons/Button.js";
import Card1 from "../../components/Card/Card.js";
import CardHeader1 from "../../components/Card/CardHeader.js";

import CardBody from "../../components/Card/CardBody.js";
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from "react-alert";
import { APP_ERROR_MSGS, BASE_URL, GenderEnum } from "../../common/constants";
import { useSelector, useDispatch } from "react-redux";
import {
  getWebsiteHomePageData,
  deleteWebsiteHomePageFile,
  uploadWebsiteHomePageFile,
} from "../../actions/websiteHomepage";
import AlertDialog from "../../components/Modals/AlertModal";
import ErrorDialog from "../../components/Modals/ErrorModal";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

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

export default function CelebHomePages() {
  // Hooks
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const FilesInput = React.createRef();
  const [allPopularFunncars, setAllPopularFunncars] = useState([]);
  const [websiteHomePageId, setWebsiteHomePageId] = useState(null);
  const [websiteHomePageData, setWebsiteHomePageData] = useState(null);
  const [AlertModalProps, setAlertModalProps] = useState({
    open: false,
    title: "",
    message: "",
    firstCallback: () => {},
    secondCallback: () => {},
  });
  const [ErrorModalProps, setErrorModalProps] = useState({
    open: false,
    title: "",
    message: "",
  });

  const getHomeData = (type) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    getWebsiteHomePageData(type)
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          setWebsiteHomePageData(result.data.data);
          setWebsiteHomePageId(result.data.data._id);
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
    getHomeData('website');
  }, []);

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      dispatch({ type: UPDATE_LOADING, payload: true });
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      uploadWebsiteHomePageFile('website',formData)
        .then((result) => {
          dispatch({ type: UPDATE_LOADING, payload: false });
          if (result.data.status === true) {
            alert.success(APP_ERROR_MSGS.SaveMsg);
            getHomeData('website');
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
  const deleteFile = (file) => {
    setAlertModalProps({
      ...AlertModalProps,
      open: true,
      title: "Deleting",
      message: APP_ERROR_MSGS.DeleteConfirmMsg,
      firstCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
        DeleteHomeFile(file);
      },
      secondCallback: () => {
        setAlertModalProps({ ...AlertModalProps, open: false });
      },
    });
  };
  const DeleteHomeFile = (file) => {
    dispatch({ type: UPDATE_LOADING, payload: true });
    deleteWebsiteHomePageFile(websiteHomePageId, {
      file: file,
    })
      .then((result) => {
        dispatch({ type: UPDATE_LOADING, payload: false });
        if (result.data.status === true) {
          alert.success(APP_ERROR_MSGS.DeleteMsg);
          getHomeData('website');
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

  return (
    <>
      <AlertDialog
        {...AlertModalProps}
        setOpen={(resp) => {
          setAlertModalProps({ ...AlertModalProps, open: resp });
        }}
      />
      <ErrorDialog
        {...ErrorModalProps}
        setOpen={(resp) => {
          setErrorModalProps({ ...ErrorModalProps, open: resp });
        }}
      />

      {websiteHomePageData && (
        <GridContainer className="mt-40">
          <GridItem xs={12} sm={12} md={12}>
            <input
              type="file"
              multiple
              name="myImage"
              hidden
              accept="video/mp4,video/x-m4v,video/*"
              // accept="video/*"
              onChange={handleInputChange}
              ref={FilesInput}
            />
            <Button
              onClick={() => FilesInput.current.click()}
              type="button"
              color="primary"
              style={{ float: "right" }}
            >
              Add
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card1>
              <CardHeader1 color="primary">
                <h4 className={classes.cardTitleWhite}>Top Slider</h4>
              </CardHeader1>
              <CardBody>
                <GridItem xs={12} sm={12} md={12}>
                  <Carousel
                    showIndicators={true}
                    showArrows={true}
                    showThumbs={false}
                    showIndicators={false}
                    infiniteLoop={true}
                  >
                    {websiteHomePageData &&
                      websiteHomePageData?.mediaFiles.map((item, i) => {
                        if (item.match(/\.(jpeg|jpg|png|webp)$/) != null) {
                          return (
                            <div key={i}>
                              <img
                                src={`${BASE_URL}/${item}`}
                                style={{ width: "100%", height: 600 }}
                              />
                              <Button
                                onClick={() => deleteFile(item)}
                                type="button"
                                color="primary"
                                style={{ marginRight: 30, float: "right" }}
                              >
                                Delete
                              </Button>
                            </div>
                          );
                        } else {
                          return (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                                key={i}
                              >
                                <video
                                  style={{ width: "100%", height: 600 }}
                                  controls
                                >
                                  <source src={`${BASE_URL}/${item}`} />
                                </video>
                              </div>
                              <Button
                                onClick={() => deleteFile(item)}
                                type="button"
                                color="primary"
                                style={{ marginRight: 30, float: "right" }}
                              >
                                Delete
                              </Button>
                            </>
                          );
                        }
                      })}
                  </Carousel>
                </GridItem>
              </CardBody>
            </Card1>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
}
