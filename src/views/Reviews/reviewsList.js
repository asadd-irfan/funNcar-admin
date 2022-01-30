import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import Card1 from "../../components/Card/Card.js";
import CardHeader1 from "../../components/Card/CardHeader.js";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import AlertDialog from '../../components/Modals/AlertModal'
// import Pagination from '@material-ui/lab/Pagination';


// import GridContainer from "../../components/Grid/GridContainer.js";

import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getAllFunncarReviews, deleteAReview } from '../../actions/reviews';

import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';

import IconButton from '@material-ui/core/IconButton';
import CardBody from "../../components/Card/CardBody.js";


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
            lineHeight: "1"
        }
    },
    root: {
        minWidth: 275,
        paddingTop: 15,
        marginTop: 5,
        marginBottom: 5,
        // paddingBottom: 5,
    },
   
    pos: {
        paddingTop: 10,
        paddingBottom: 10,
    },
   


};
const useStyles = makeStyles(styles);

export default function ReviewsList({Id, AverageRating}) {
    // Hooks
    const classes = useStyles();
    const alert = useAlert();
    const dispatch = useDispatch();
    const history = useHistory();

    // state
    const [reviewsData, setReviewsData] = useState(null);
    const [AlertModalProps, setAlertModalProps] = useState({
        open:false,
        title:"",
        message:"",
        firstCallback:() => {},
        secondCallback:() => {}
      });
    // console.log('content',content)

    const getReviewsList = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getAllFunncarReviews(Id).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            // console.log(result.data);
            if (result.data.status === true) {
                setReviewsData(result.data.data)
            }
            else {

                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
        });
    }

    useEffect(() => {
        getReviewsList()
    }, []);

    const onDelete=(id)=>{
        setAlertModalProps({
          ...AlertModalProps,
          open: true,
          title:"Deleting",
          message: 'Are you sure you want to delete this review?',
          firstCallback:() => {setAlertModalProps({...AlertModalProps,open:false});DeleteRecord(id)},
          secondCallback:() => {setAlertModalProps({...AlertModalProps,open:false});}
        })
      }
      const DeleteRecord=(id)=>{
        dispatch({type: UPDATE_LOADING,payload:true});
        deleteAReview(id).then(result => {
          dispatch({type: UPDATE_LOADING,payload:false});
          if(result.data.status === true){
            alert.success(APP_ERROR_MSGS.DeleteMsg)
            getReviewsList();
          }
          else{
            alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
          }
        }).catch(error => {
          dispatch({type: UPDATE_LOADING,payload:false});
          alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
        });
      }

    return (<>
              <AlertDialog  {...AlertModalProps} setOpen={((resp)=>{setAlertModalProps({...AlertModalProps,open:resp})})}/>
        <GridItem xs={12} sm={12} md={12}>
            <Card1 style={{height:700, overflow: 'auto'}}>
                <CardHeader1 color="primary" className="d-flex" style={ {justifyContent: 'space-between', marginTop:20}}> 
                    <h4 className={classes.cardTitleWhite}>Ratings and Reviews </h4>
                    <h4 className={classes.cardTitleWhite}>Average Rating: {AverageRating} </h4>
                </CardHeader1>
                <CardBody>
                {reviewsData?.reviews?.length == 0 && <div className="row d-flex justify-content-center mt-3">No Reviews found!</div>}
                    {reviewsData?.reviews?.length > 0 && reviewsData?.reviews?.map((review, i) => {
                        return (
                            <Card className={classes.root} key={i}>
                                <CardHeader className="cardHeader"
                                    avatar={
                                        <Avatar alt="fan" src={`${BASE_URL}/${review?.user?.profileImage}`} />
                                    }
                                    action={<>
                                        {review?.comments && <IconButton className="mx-3" aria-label="settings" onClick={(()=>{onDelete(review?._id)})}>
                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                         </IconButton>}

                                         </>}
                                    title={review?.user?.fullName ? review?.user?.fullName : review?.user?.professionalName}
                                    subheader={<>
                                        {/* <span>{review?.funncar.professionalName}</span> */}
                                        <Rating name="read-only" precision={0.5} value={review?.rating} size="small" readOnly />
                                    </>}

                                />
                                <CardContent className="cardContent">
                                    {/* <Typography className={classes.pos} color="textSecondary"> */}
                                        {review?.comments}
                                    {/* </Typography> */}
                                </CardContent>
                            </Card>
                        )
                    })}
                    {/* <Pagination count={reviewsData?.count / 20}        rowsPerPage={1} variant="outlined" /> */}

                </CardBody>
            </Card1>
        </GridItem>
        </>
    );
}