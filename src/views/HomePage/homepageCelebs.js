import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import Card1 from "../../components/Card/Card.js";
import CardHeader1 from "../../components/Card/CardHeader.js";


import CardAvatar from "../../components/Card/CardAvatar.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import { Divider, FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL, GenderEnum } from '../../common/constants';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getHomePageData, deleteHomePageFile, uploadHomePageFile, updateHomePageData, getHomePopularFunncar } from '../../actions/homepage';
import DropDown from "../../components/DropdownRenderer"
import { ConvertToCommaSplitArray, ProcessDataInArray } from "../../common/commonMethods"
import ServicePricing from "../../components/ServicePricing"
import GellaryLoader from "../../components/gellaryLoader"
import AlertDialog from '../../components/Modals/AlertModal'
import ErrorDialog from '../../components/Modals/ErrorModal'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import DragNDrop from './Dragndrop';
import Select from 'react-select';


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

export default function CelebHomePages() {

    // Hooks
    const classes = useStyles();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { Id } = useParams();
    const history = useHistory();
    const FilesInput = React.createRef();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [popularFunncars, setPopularFunncars] = useState(null);
    const [allPopularFunncars, setAllPopularFunncars] = useState([]);
    const [homeCategories, setHomeCategories] = useState([]);
    const [selectedFunncar, setSelectedFunncar] = useState([]);

    const [homePageId, setHomePageId] = useState(null);
    const [homePageData, setHomePageData] = useState(null);
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const allCategories = appConfigs.data['categories'];

    const [AlertModalProps, setAlertModalProps] = useState({
        open: false,
        title: "",
        message: "",
        firstCallback: () => { },
        secondCallback: () => { }
    });
    const [ErrorModalProps, setErrorModalProps] = useState({
        open: false,
        title: "",
        message: "",
    });

    const getHomeData = (type) => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getHomePageData(type).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            // console.log(result.data);
            if (result.data.status === true) {
                // let files = result.data.data.map(item => {
                //     return `${BASE_URL}/${item.url}`;
                // })
                setHomePageData(result.data.data)
                setPopularFunncars(result.data.data.popularFunncars)
                setHomePageId(result.data.data._id);
            }
            else {

                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
        });
    }

    const getPopularFunncar = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getHomePopularFunncar().then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            // console.log('getPopularFunncar', result.data);
            if (result.data.status === true) {
                setAllPopularFunncars(result.data.data)
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
        getPopularFunncar()
        getHomeData('funncar')
    }, []);

    useEffect(() => {
        if (homePageData?.categories?.length) {

            setSelectedCategories(homePageData?.categories)
        }
        if (homePageData?.popularFunncars?.length) {

            const selected = homePageData?.popularFunncars?.map((item, i) => {

                return ({
                    value: item.funncar._id,
                    label: `${item.funncar.professionalName} - ${item.funncar.mainCategory.name}`,
                })
            })
            setSelectedFunncar(selected)
        }

    }, [homePageData]);




    const handleInputChange = (e) => {
        if (e.target.files.length > 0) {
            dispatch({ type: UPDATE_LOADING, payload: true });
            let formData = new FormData();
            formData.append("file", e.target.files[0])
            uploadHomePageFile('funncar', formData).then(result => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                if (result.data.status === true) {
                    alert.success(APP_ERROR_MSGS.SaveMsg)
                    getHomeData('funncar')
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
    const deleteFile = (file) => {
        setAlertModalProps({
            ...AlertModalProps,
            open: true,
            title: "Deleting",
            message: APP_ERROR_MSGS.DeleteConfirmMsg,
            firstCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); DeleteHomeFile(file) },
            secondCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); }
        })
    }
    const DeleteHomeFile = (file) => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        deleteHomePageFile(homePageId, {
            "file": file
        }).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                alert.success(APP_ERROR_MSGS.DeleteMsg)
                getHomeData('funncar')
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
        });
    }

    // console.log(selectedFunncar);

    const HandleAutoSuggestValChange = (fieldId, value) => {
        // let categories = value.map(item => {
        //     return item._id
        // })
        setSelectedCategories(value)
    }
    const onSaveCategories = () => {
        // console.log(selectedCategories);
        if (selectedCategories.length == 0) {
            setErrorModalProps({
                ...ErrorModalProps,
                open: true,
                title: "Error",
                message: "Please Select at least one category.",
            })

        } else {
            dispatch({ type: UPDATE_LOADING, payload: true });
            let body = {};
            let categories = selectedCategories.map(item => {
                return item._id
            })
            body = { categories }
            updateHomePageData(homePageId, body).then(result => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                if (result.data.status === true) {
                    getHomeData('funncar')
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
    const onSavePopularFunncar = () => {

        if (popularFunncars.length == 0) {
            setErrorModalProps({
                ...ErrorModalProps,
                open: true,
                title: "Error",
                message: "Please Select at least one Popular Funncar.",
            })

        } else {
            dispatch({ type: UPDATE_LOADING, payload: true });
            let body = {};
            let res = popularFunncars.map((item, i) => {
                return {
                    "funncar": item.funncar._id,
                    "priority": i + 1
                }
            })
            body = { popularFunncars: res }
            updateHomePageData(homePageId, body).then(result => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                if (result.data.status === true) {
                    getHomeData('funncar')
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

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        let funncar = reorder(
            popularFunncars,
            result.source.index,
            result.destination.index
        );
        // console.log('funncar', funncar);

        setPopularFunncars(funncar);
    }


    // const uniqueResult = allPopularFunncars?.filter((obj) => {
    //     return !popularFunncars?.some((obj2) => {
    //         return obj._id == obj2.funncar._id;
    //     });
    // });
    // console.log('uniqueResult',uniqueResult)

    // const commonResult = allPopularFunncars?.filter(a => popularFunncars?.some(b => a._id == b.funncar._id));  
    // console.log('commonResult',commonResult)

    const selectOptions = allPopularFunncars?.map((item, i) => {

        return ({
            value: item._id,
            label: `${item.professionalName} - ${item.mainCategory.name}`,
            // profileImage: item.profileImage,
            // mainCategory: item.mainCategory.name,
            // averageRate: item.averageRate,
        })
    })

    // const CustomOption = props => {
    //     const { data, innerRef, innerProps } = props;

    //     return (
    //         <Card className={classes.root} key={data?.value}>
    //             <CardHeader className="cardHeader"
    //                 avatar={
    //                     !data?.profileImage ? <Avatar variant="square" className={classes.large}>{data?.label?.charAt(0).toUpperCase()}</Avatar> :
    //                         <Avatar alt="funncar" variant="square" className={classes.large} src={`${BASE_URL}/${data?.profileImage}`} />

    //                 }

    //                 title={data?.label}
    //                 subheader={data?.mainCategory}


    //             />
    //             <CardContent className="cardContent">
    //                 <Typography className={classes.pos} style={{ float: 'right', marginRight: 20 }} color="textSecondary">
    //                     Rs {data?.averageRate}
    //                 </Typography>
    //             </CardContent>
    //         </Card>
    //     )
    // }

    const handleSelectChange = selectedOption => {
        if (selectedOption.length < 11) {


            setSelectedFunncar(selectedOption);
            let funncarArray = [];
            selectedOption.forEach(element => {
                let found = allPopularFunncars.find(item => item._id.toString() == element.value)
                funncarArray.push({ funncar: found })
            });

            setPopularFunncars(funncarArray)
        } else {
            setErrorModalProps({
                ...ErrorModalProps,
                open: true,
                title: "Warning",
                message: "Maximum selection range is 10.",
            })
        }
    }

    return (
        <>
            <AlertDialog  {...AlertModalProps} setOpen={((resp) => { setAlertModalProps({ ...AlertModalProps, open: resp }) })} />
            <ErrorDialog  {...ErrorModalProps} setOpen={((resp) => { setErrorModalProps({ ...ErrorModalProps, open: resp }) })} />

            {homePageData && <> <GridContainer className="mt-40">
                <GridItem xs={12} sm={12} md={12}>
                    <input type="file" multiple name="myImage" hidden accept=".png, .jpg, .jpeg,video/*"
                        onChange={handleInputChange}
                        ref={FilesInput} />
                    <Button onClick={() => FilesInput.current.click()} type="button" color="primary" style={{ float: "right" }}>Add</Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Card1>
                        <CardHeader1 color="primary">
                            <h4 className={classes.cardTitleWhite}>Top Slider</h4>
                        </CardHeader1>
                        <CardBody>

                            <GridItem xs={12} sm={12} md={12}>

                                <Carousel showIndicators={true} showArrows={true} showThumbs={false} showIndicators={false} infiniteLoop={true}>
                                    {homePageData && homePageData?.mediaFiles.map((item, i) => {
                                        if (item.match(/\.(jpeg|jpg|png|webp)$/) != null) {
                                            return (<div key={i}>
                                                <img src={`${BASE_URL}/${item}`} style={{ width: '100%', height: 600 }} />
                                                <Button onClick={() => deleteFile(item)} type="button" color="primary" style={{ marginRight: 30, float: 'right' }}>Delete</Button>
                                            </div>)
                                        } else {
                                            return (<>
                                                <div style={{ display: 'flex', justifyContent: 'center' }} key={i}>

                                                    <video style={{ width: '100%', height: 600 }} controls>
                                                        <source src={`${BASE_URL}/${item}`} />
                                                    </video>
                                                </div>
                                                <Button onClick={() => deleteFile(item)} type="button" color="primary" style={{ marginRight: 30, float: 'right' }}>Delete</Button>
                                            </>
                                            )
                                        }

                                    })}

                                </Carousel>
                            </GridItem>
                        </CardBody>
                    </Card1>
                </GridItem>


            </GridContainer>

                <GridContainer className="mt-20">
                    <GridItem xs={12} sm={12} md={12}>
                        <h3>Categories List </h3>
                        <DropDown
                            multi={true}
                            dropdownRenderer={false}
                            contentRenderer={false}
                            closeOnSelect={false}
                            onChange={HandleAutoSuggestValChange}
                            create={false}
                            // Type="categories"
                            options={allCategories}
                            val={selectedCategories}
                            loading={false}
                            searchBy="name"
                            labelField="name"
                            valueField="id"
                            AddNew={() => { }}
                            clearable={true}
                            placeholder="Select"
                        // inputLabel="Categories List"
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <Button onClick={() => onSaveCategories()} type="button" color="primary" style={{ marginRight: 30, float: 'right' }}>Save Categories</Button>
                    </GridItem>
                </GridContainer>
                <GridContainer className="mt-20">
                    <GridItem xs={12} sm={12} md={12}>
                        <h3>Popular Funncar List </h3>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={3}>
                        <DragNDrop list={popularFunncars} onDragEnd={onDragEnd} />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={1}></GridItem>

                    <GridItem xs={12} sm={12} md={8} className="pt-5 mt-5">
                        {/* <Select components={{ Option: CustomOption }} placeholder="All Popular Funncars" /> */}
                        <Select
                            isMulti
                            onChange={handleSelectChange}
                            // defaultMenuIsOpen={true}
                            // components={{ Option: CustomOption }}
                            options={selectOptions}
                            value={selectedFunncar && selectedFunncar}
                            placeholder="All Popular Funncars"
                        /> <br />
                        <Button
                            onClick={() => onSavePopularFunncar()}
                            type="button" color="primary" style={{ marginRight: 30, float: 'right' }}>Save Popular Funncar</Button>

                    </GridItem>
                </GridContainer> </>}

        </>
    );
}

