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
import { Divider, FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { UPDATE_LOADING } from "../../actions/types";
import { useAlert } from 'react-alert'
import { APP_ERROR_MSGS, BASE_URL, GenderEnum } from '../../common/constants';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getUserDetail, updateUser, uploadUserImage, deleteUserGallery, uploadUserGallery } from '../../actions/users';
import { getAllCountries, getCities, getDummyServices } from '../../actions/auth';
import DropDown from "../../components/DropdownRenderer"
import { ConvertToCommaSplitArray, ProcessDataInArray } from "../../common/commonMethods"
import ServicePricing from "../../components/ServicePricing"
import GellaryLoader from "../../components/gellaryLoader"
import AlertDialog from '../../components/Modals/AlertModal'

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

export default function PerformerEdit() {

    // Hooks
    const classes = useStyles();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { Id } = useParams();
    const history = useHistory();
    const FilesInput = React.createRef();
    const GalleryFilesInput = React.createRef();
    const Store = useSelector(state => state);

    // state
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [filteredSubCategoriesList, setFilteredSubCategoriesList] = useState([]);
    const [acheivementsInput, setAcheivementsInput] = useState("");
    const [allCountries, setAllCountries] = useState([]);
    const [processedCountries, setProcessedCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [citiesLoader, setCitiesLoader] = useState(false);
    const [activeTab, setActiveTab] = useState('info_tab')
    const [pricingServices, setPricingServices] = useState([]);
    const [filteredPricingServices, setFilteredPricingServices] = useState([]);

    const [AlertModalProps, setAlertModalProps] = useState({
        open: false,
        title: "",
        message: "",
        firstCallback: () => { },
        secondCallback: () => { }
    });

    const [FormInputs, setFormInputs] = useState({
        categories: [],
        subCategories: [],
        achievements: [],
        services: [],
        mngServices: [],
        averageRate: "",
        firstName: "",
        lastName: "",
        professionalName: "",
        email: "",
        phone: "",
        profileImage: "",
        gender: "",
        country: "",
        city: "",
        bio: "",
        notes: "",
        servicesPricing: [],
        processedServicePriceing: [],
        mainCategory: "",
        isPopular: null,
        gallery: []
    });

    const handleGelleryInputChange = (e) => {
        if (e.target.files.length > 0) {
            let element= e.target
            let formData = new FormData();
            let ins = e.target.files.length;
            for (let x = 0; x < ins; x++) {
                formData.append("gallery", e.target.files[x]);
            }
            dispatch({ type: UPDATE_LOADING, payload: true });
            uploadUserGallery(Id, formData).then(result => {
                element.value = ""
                dispatch({ type: UPDATE_LOADING, payload: false });
                if (result.data.status === true) {
                    alert.success(APP_ERROR_MSGS.SaveMsg)
                    if (result.data.data) {
                        loadData(result.data.data)
                    }
                    else {
                        getUserDetails()
                    }
                }
                else {
                    alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
                }
            }).catch(error => {
                element.value = ""
                dispatch({ type: UPDATE_LOADING, payload: false });
                alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
            });
        }
    }
    const handleFormInputChange = (e) => {
        const fieldId = e.currentTarget.id
        setFormInputs({
            ...FormInputs,
            [fieldId]: e.currentTarget.value,
        })
    }
    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            dispatch({ type: UPDATE_LOADING, payload: true });
            let formData = new FormData();
            formData.append("profileImage", e.target.files[0])
            uploadUserImage(Id, formData).then(result => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                if (result.data.status === true) {
                    // setIsImageChanged(true);
                    setFormInputs({ ...FormInputs, profileImage: result.data.data.profileImage })
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
    const validateForm = () => {
        if (!FormInputs.gender) {
            alert.error("Gender is required")
            return false
        }
        if (!FormInputs.country) {
            alert.error("Country is required")
            return false
        }
        if (!FormInputs.city) {
            alert.error("City is required")
            return false
        }
        if (FormInputs.averageRate === 0) {
            alert.error("Average rate is required")
            return false
        }
        if (!FormInputs.mainCategory) {
            alert.error("Main catagory is required")
            return false
        }
        if (FormInputs.categories.length === 0) {
            alert.error("Please select atleast one category")
            return false
        }
        if (FormInputs.categories.length > 3) {
            alert.error("Categories max limit is 3")
            return false
        }
        if (FormInputs.subCategories.length === 0) {
            alert.error("Please select atleast one sub category")
            return false
        }
        if (FormInputs.subCategories.length > 3) {
            alert.error("Sub Categories max limit is 3")
            return false
        }
        if (FormInputs.services.length === 0) {
            alert.error("Please select atleast one service")
            return false
        }
        if (FormInputs.mngServices.length === 0) {
            alert.error("Please select atleast one MNG service")
            return false
        }
        if (FormInputs.achievements.length === 0) {
            alert.error("Please add atleast one achievement")
            return false
        }
        return true
    }
    const handleFormSubmit = (e) => {

        e.preventDefault();
        if (!validateForm()) return

        let param = {
            averageRate: FormInputs.averageRate,
            firstName: FormInputs.firstName,
            lastName: FormInputs.lastName,
            professionalName: FormInputs.professionalName,
            email: FormInputs.email,
            phone: FormInputs.phone,
            gender: FormInputs.gender,
            country: FormInputs.country,
            city: FormInputs.city,
            bio: FormInputs.bio,
            notes: FormInputs.notes,
            categories: FormInputs.categories,
            subCategories: FormInputs.subCategories,
            services: FormInputs.services,
            mngServices: FormInputs.mngServices,
            achievements: FormInputs.achievements,
            servicesPricing: filteredPricingServices,
            mainCategory: FormInputs.mainCategory,
            isPopular: FormInputs.isPopular,
        }

        dispatch({ type: UPDATE_LOADING, payload: true });
        updateUser(Id, param).then(result => {
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
    const filterSubCategories = (value) => {
        // filter list
        let allSubCategoriesList = Store.auth?.appConfigs?.data?.subCategories
        let selectedCategories = ConvertToCommaSplitArray(value, "id")
        let filteredList = allSubCategoriesList.filter(function (obj) {
            return selectedCategories.indexOf(obj.isBelongTo) > -1
        });

        // filter selected values
        let selected = FormInputs.subCategories
        let filteredListIdArr = ConvertToCommaSplitArray(filteredList, "id")
        let filteredSelected = selected.filter(function (obj) {
            return filteredListIdArr.indexOf(obj.id) > -1
        });
        setFilteredSubCategoriesList(filteredList)
        setFormInputs({ ...FormInputs, subCategories: filteredSelected })
    }
    const filterCities = (value) => {
        if (value === 0 || value === "") {
            setCities([])
        }
        else {
            if (processedCountries[value])
                getCitiesList(processedCountries[value].id)
        }
    }
    const filterServicePricing = (value) => {
        if (value.length === 0) return setFilteredPricingServices([])

        // Filter dummy pricing array 
        let selectedServices = ConvertToCommaSplitArray(value, "id")
        let filteredList = pricingServices.filter(function (obj) {
            return selectedServices.indexOf(obj?.serviceType?.id) > -1
        });

        // Populate filtered dummy array
        let tempProcessed = FormInputs.processedServicePriceing
        for (let i in filteredList) {
            if (tempProcessed[filteredList[i].serviceType?.id]) {
                for (let j in filteredList[i].serviceDetails) {
                    if (tempProcessed[filteredList[i].serviceType?.id].processedPricing[filteredList[i].serviceDetails[j].serviceName?.id]) {
                        filteredList[i].serviceDetails[j].price = tempProcessed[filteredList[i].serviceType?.id].processedPricing[filteredList[i].serviceDetails[j].serviceName?.id].price
                    }
                }
            }
        }
        setFilteredPricingServices(filteredList)
    }
    const HandleAutoSuggestValChange = (fieldId, value) => {
        setFormInputs({ ...FormInputs, [fieldId]: value })
        // if (fieldId === "categories") {
        //     filterSubCategories(value)
        // }
        // if (fieldId === "country") {
        //     filterCities(value)
        // }
        // if(fieldId === "services"){
        //     filterServicePricing(value)
        // }
    }
    const handleAchievementsKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (acheivementsInput) {
                let tempAchievements = FormInputs.achievements
                if (tempAchievements.indexOf(acheivementsInput) === -1) {
                    tempAchievements.push(acheivementsInput)
                }
                setFormInputs({ ...FormInputs, achievements: tempAchievements })
                setAcheivementsInput("")
            }
        }
    }
    const removeAchievement = (val) => {
        let arr = FormInputs.achievements;
        arr = arr.filter(e => e !== val);
        setFormInputs({ ...FormInputs, achievements: arr })
    }
    const loadData = (data) => {
        let { servicesPricing, categories, subCategories, achievements, services, mngServices, averageRate, firstName, lastName, professionalName, gender, country, city, bio, notes, email, phone, profileImage, mainCategory, isPopular, gallery,
        } = data

        let tempPricing = [...servicesPricing]
        let processedServicePriceing = []
        for (let i in tempPricing) {
            tempPricing[i].processedPricing = []
            for (let j in tempPricing[i].serviceDetails) {
                tempPricing[i].processedPricing[tempPricing[i].serviceDetails[j].serviceName?.id] = tempPricing[i].serviceDetails[j]
            }
            processedServicePriceing[tempPricing[i].serviceType?.id] = tempPricing[i]
        }

        setFormInputs({
            ...FormInputs,
            servicesPricing,
            processedServicePriceing,
            email,
            phone,
            profileImage,
            categories,
            subCategories,
            achievements,
            services,
            mngServices,
            averageRate,
            firstName,
            lastName,
            professionalName,
            gender,
            country,
            city,
            bio,
            notes,
            mainCategory: mainCategory ? mainCategory?.id : "",
            isPopular,
            gallery,
        })
    }
    const getAllCountriesList = (call_back) => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getAllCountries().then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                setAllCountries(result.data.data)
                setProcessedCountries(ProcessDataInArray(result.data.data, "name"))
                call_back()
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : "Something went wrong while fetching countries")
        });
    }
    const getCitiesList = (id) => {
        setCitiesLoader(true)
        setCities([])
        getCities(id).then(result => {
            setCitiesLoader(false)
            if (result.data.status === true) {
                setCities(result.data.data)
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            setCitiesLoader(false)
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : "Something went wrong while fetching cities")
        });
    }
    const getUserDetails = () => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getUserDetail(Id).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                loadData(result.data.data)
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
            if (error?.response?.status === 404)
                history.push("/admin/performers")
        });
    }
    const getDummyServicePricing = (call_back) => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        getDummyServices().then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                setPricingServices(result.data.data)
                call_back()
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : "Something went wrong while fetching service pricing")
        });
    }
    const handlePricingValChange = (serviceIndex, priceIndex, value) => {
        let pricingServices = [...filteredPricingServices]
        pricingServices[serviceIndex].serviceDetails[priceIndex].price = value
        setFilteredPricingServices(pricingServices)
    }
    const onDelete = (id) => {
        setAlertModalProps({
            ...AlertModalProps,
            open: true,
            title: "Deleting",
            message: APP_ERROR_MSGS.DeleteConfirmMsg,
            firstCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); DeleteRecord(id) },
            secondCallback: () => { setAlertModalProps({ ...AlertModalProps, open: false }); }
        })
    }
    const DeleteRecord = (id) => {
        dispatch({ type: UPDATE_LOADING, payload: true });
        deleteUserGallery(Id, { files: [id] }).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                alert.success(APP_ERROR_MSGS.DeleteMsg)
                loadData(result.data.data)
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

        window.addEventListener('keydown', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
            return true
        })

        // var d1= $.Deferred();
        // var d2= $.Deferred();
        // getAllCountriesList(()=>{ d1.resolve(); })
        // getDummyServicePricing(()=>{ d2.resolve(); })
        // $.when(d1,d2).done( ()=> {
        //     getUserDetails()
        // });

        getAllCountriesList(() => {
            getDummyServicePricing(() => {
                getUserDetails()
            })
        })

    }, []);

    useEffect(() => {
        filterSubCategories(FormInputs.categories)
    }, [FormInputs.categories]);

    useEffect(() => {
        filterCities(FormInputs.country)
    }, [FormInputs.country]);

    useEffect(() => {
        filterServicePricing(FormInputs.services)
    }, [FormInputs.services]);

    return (
        <>
            <AlertDialog  {...AlertModalProps} setOpen={((resp) => { setAlertModalProps({ ...AlertModalProps, open: resp }) })} />

            <ul className="nav nav-tabs">
                <li onClick={() => setActiveTab('info_tab')} className={activeTab === "info_tab" ? "active" : ""}><a>Info</a></li>
                <li onClick={() => setActiveTab('gallery_tab')} className={activeTab === "gallery_tab" ? "active" : ""}><a>Gallery</a></li>
            </ul>

            {
                activeTab === "info_tab" &&
                <div className={activeTab === "info_tab" ? "tab-pane fade in active" : "tab-pane fade"} >
                    <GridContainer className="mt-40">
                        <GridItem xs={12} sm={12} md={8}>
                            <form onSubmit={handleFormSubmit} className={classes.root} autoComplete="off">

                                <Card>
                                    <CardHeader color="primary">
                                        <h4 className={classes.cardTitleWhite}>Edit Performer</h4>
                                    </CardHeader>
                                    <CardBody>

                                        <GridContainer>

                                            <GridItem xs={12} sm={12} md={4}>
                                                <CustomInput labelText="First Name" id="firstName" inputProps={{ type: "text", value: FormInputs.firstName, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                                            </GridItem>

                                            <GridItem xs={12} sm={12} md={4}>
                                                <CustomInput labelText="Last Name" id="lastName" inputProps={{ type: "text", value: FormInputs.lastName, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                                            </GridItem>

                                            <GridItem xs={12} sm={12} md={4}>
                                                <CustomInput labelText="Professional Name" id="professionalName" inputProps={{ type: "text", value: FormInputs.professionalName, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                                            </GridItem>

                                        </GridContainer>

                                        <GridContainer>

                                            <GridItem xs={12} sm={12} md={4}>
                                                <CustomInput labelText="Email" id="email" inputProps={{ type: "email", value: FormInputs.email, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true }} />
                                            </GridItem>

                                            <GridItem xs={12} sm={12} md={4}>
                                                <CustomInput labelText="Phone" id="phone" inputProps={{ type: "text", value: FormInputs.phone, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true }} />
                                            </GridItem>

                                            <GridItem xs={12} sm={12} md={4} style={{ paddingTop: "20px" }}>
                                                <DropDown
                                                    multi={false}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="gender"
                                                    options={GenderEnum}
                                                    val={FormInputs.gender}
                                                    loading={false}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="id"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="Gender *"
                                                />
                                            </GridItem>

                                        </GridContainer>

                                        <GridContainer>
                                            <GridItem xs={12} sm={12} md={12} style={{ paddingTop: "20px" }}>
                                                {/* <select id="country" value={FormInputs.country} onChange={handleFormInputChange}>
                                            <option value="">Select</option>
                                            {allCountries.map(item => <option value={item.name}>{item.name}</option>)}
                                        </select> */}
                                                <DropDown
                                                    multi={false}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="country"
                                                    options={allCountries}
                                                    val={FormInputs.country}
                                                    loading={false}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="name"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="Country *"
                                                />
                                            </GridItem>

                                        </GridContainer>

                                        <GridContainer>
                                            <GridItem xs={12} sm={12} md={12} style={{ paddingTop: "20px" }}>
                                                <DropDown
                                                    multi={false}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="city"
                                                    options={cities}
                                                    val={FormInputs.city}
                                                    loading={citiesLoader}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="name"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="City *"
                                                />
                                            </GridItem>
                                        </GridContainer>

                                        <GridContainer>

                                            <GridItem xs={12} sm={12} md={4}>
                                                <CustomInput labelText="AVG Rate" id="averageRate" inputProps={{ type: "number", value: FormInputs.averageRate, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                                            </GridItem>

                                            {(FormInputs.isPopular == true || FormInputs.isPopular == false) &&   <GridItem className="flex_end_checbox" xs={12} sm={12} md={4}>
                                                <label className="checkbox-container">Popular
                                            <input type="checkbox" defaultChecked={FormInputs.isPopular == true ? true : false} onClick={() => setFormInputs({ ...FormInputs, isPopular: !FormInputs.isPopular })} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </GridItem>}

                                        </GridContainer>

                                        <GridContainer>

                                            <GridItem xs={12} sm={12} md={12}>
                                                <CustomInput labelText="Bio" id="bio" formControlProps={{ fullWidth: true, required: true }} inputProps={{ multiline: true, rows: 5, value: FormInputs.bio, onChange: handleFormInputChange }} />
                                            </GridItem>

                                            <GridItem xs={12} sm={12} md={12}>
                                                <CustomInput labelText="Notes" id="notes" formControlProps={{ fullWidth: true, required: true }} inputProps={{ multiline: true, rows: 5, value: FormInputs.notes, onChange: handleFormInputChange }} />
                                            </GridItem>

                                        </GridContainer>

                                        <GridContainer className="mt-20">
                                            <GridItem xs={12} sm={12} md={12}>
                                                <DropDown
                                                    multi={false}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="mainCategory"
                                                    options={Store.auth?.appConfigs?.data?.categories}
                                                    val={FormInputs.mainCategory}
                                                    loading={false}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="id"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="Main Category *"
                                                />
                                            </GridItem>
                                        </GridContainer>

                                        <GridContainer className="mt-20">
                                            <GridItem xs={12} sm={12} md={12}>
                                                <DropDown
                                                    multi={true}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="categories"
                                                    options={Store.auth?.appConfigs?.data?.categories}
                                                    val={FormInputs.categories}
                                                    loading={false}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="id"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="Categories *"
                                                />
                                            </GridItem>
                                        </GridContainer>

                                        <GridContainer className="mt-20">
                                            <GridItem xs={12} sm={12} md={12}>
                                                <DropDown
                                                    multi={true}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="subCategories"
                                                    options={filteredSubCategoriesList}
                                                    val={FormInputs.subCategories}
                                                    loading={false}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="id"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="Sub Categories *"
                                                />
                                            </GridItem>
                                        </GridContainer>

                                        <GridContainer className="mt-20">
                                            <GridItem xs={12} sm={12} md={12}>
                                                <DropDown
                                                    multi={true}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="services"
                                                    options={Store.auth?.appConfigs?.data?.services}
                                                    val={FormInputs.services}
                                                    loading={false}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="id"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="Services *"
                                                />
                                            </GridItem>
                                        </GridContainer>

                                        <GridContainer className="mt-20">
                                            <GridItem xs={12} sm={12} md={12}>
                                                <DropDown
                                                    multi={true}
                                                    dropdownRenderer={false}
                                                    contentRenderer={false}
                                                    closeOnSelect={false}
                                                    create={false}
                                                    onChange={HandleAutoSuggestValChange}
                                                    Type="mngServices"
                                                    options={Store.auth?.appConfigs?.data?.mngServices}
                                                    val={FormInputs.mngServices}
                                                    loading={false}
                                                    searchBy="name"
                                                    labelField="name"
                                                    valueField="id"
                                                    AddNew={() => { }}
                                                    clearable={true}
                                                    placeholder="Select"
                                                    inputLabel="MNG Services *"
                                                />
                                            </GridItem>
                                        </GridContainer>

                                        <GridContainer>
                                            <GridItem xs={12} sm={12} md={12}>
                                                <CustomInput labelText="Achievements" id="achievements" inputProps={{ type: "text", value: acheivementsInput, onChange: (e) => setAcheivementsInput(e.currentTarget.value), onKeyDown: handleAchievementsKeyDown }} formControlProps={{ fullWidth: true }} />
                                                {FormInputs?.achievements.length > 0 &&
                                                    <div className="flex" style={{ flexWrap: "wrap" }}>
                                                        {
                                                            FormInputs?.achievements?.map((item, i) => (
                                                                <span className="selected-value-label-tag" key={i}>
                                                                    <span>{item}</span><span onClick={() => removeAchievement(item)} className="selected-value-label-tag-remover">×</span>
                                                                </span>
                                                            ))
                                                        }
                                                    </div>
                                                }
                                            </GridItem>
                                        </GridContainer>

                                    </CardBody>
                                </Card>

                                {/* Service Pricing */}
                                <Card>
                                    <CardHeader color="primary">
                                        <h4 className={classes.cardTitleWhite}>Service Pricing</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <ServicePricing list={filteredPricingServices} onChange={handlePricingValChange} />
                                    </CardBody>
                                    <CardFooter>
                                        <Button type="submit" color="primary">SAVE</Button>
                                    </CardFooter>
                                </Card>

                            </form>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                            <Card profile>
                                <CardAvatar profile>
                                    <img src={isImageChanged ? FormInputs.profileImage : FormInputs.profileImage ? `${BASE_URL}/${FormInputs.profileImage}` : require('../../assets/img/noUser.jpg')} />
                                </CardAvatar>
                                <CardBody profile>
                                    <input type="file" name="myImage" hidden accept="image/*" onChange={handleImageChange} ref={FilesInput} />
                                    <a className="ancher_link" onClick={() => FilesInput.current.click()}>Change</a>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            }

            {
                activeTab === "gallery_tab" &&
                <div className={activeTab === "gallery_tab" ? "tab-pane fade in active" : "tab-pane fade"} >
                    <GridContainer className="mt-40">
                        <GridItem xs={12} sm={12} md={12}>
                            {/* <input type="file" multiple name="myImage" hidden accept="image/*,video/*" onChange={handleGelleryInputChange} ref={GalleryFilesInput} /> */}
                            <input type="file" multiple name="myImage" hidden accept=".png, .jpg, .jpeg,video/*" onChange={handleGelleryInputChange} ref={GalleryFilesInput} />
                            <Button onClick={() => GalleryFilesInput.current.click()} type="button" color="primary" style={{ float: "right" }}>Add</Button>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card>
                                <CardHeader color="primary">
                                    <h4 className={classes.cardTitleWhite}>Gallery</h4>
                                </CardHeader>
                                <CardBody>

                                    <GridItem xs={12} sm={12} md={12}>
                                        <GellaryLoader loading={false} list={FormInputs.gallery} deleteFromGallery={onDelete} />
                                    </GridItem>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            }

        </>
    );
}