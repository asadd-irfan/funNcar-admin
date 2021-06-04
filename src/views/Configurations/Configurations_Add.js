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
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { saveConfig, loadAppConfigs, updateConfig, getConfigDetail } from '../../actions/auth';
import DropDown from "../../components/DropdownRenderer"


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

export default function ConfigurationsAdd() {
    const FilesInput = React.createRef();

    // Hooks
    const classes = useStyles();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { Id } = useParams();
    const history = useHistory();

    const categoriesList = useSelector(state => state.auth.appConfigs.data.categories);
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const ConfigurationTypes = Object.keys(appConfigs.data);

    // state
    const [formData, setFormDate] = useState(null);
    const [isImageChanged, setIsImageChanged] = useState('');
    const [FormInputs, setFormInputs] = useState({
        name: "",
        file: "",
        type: localStorage.getItem('config'),
        isBelongTo: "",
    });
    // console.log(formData);
    const handleFormInputChange = (e) => {
        const fieldId = e.currentTarget.id
        setFormInputs({
            ...FormInputs,
            [fieldId]: e.currentTarget.value,
        })
    }
    const HandleAutoSuggestValChange = (fieldId, value) => {
        setFormInputs({ ...FormInputs, [fieldId]: value })
    }
    const saveConfiguration = (param) => {
        let body;
        dispatch({ type: UPDATE_LOADING, payload: true });
        if (param.type == 'categories' && isImageChanged) {
            let newFormData = formData;
            newFormData.append("name", param.name);
            newFormData.append("type", param.type);
            body = newFormData
        }else {
            body = param
        }
        saveConfig(body).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                dispatch(loadAppConfigs());
                alert.success(APP_ERROR_MSGS.SaveMsg)
                setFormInputs({
                    ...FormInputs,
                    name: "",
                    type: localStorage.getItem('config'),
                    file: "",
                    isBelongTo: "",
                })
                setIsImageChanged('')
                setFormDate(null)
            }
            else {
                alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
            }
        }).catch(error => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
        });
    }
    const updateConfiguration=(param)=>{
        let body;
        dispatch({ type: UPDATE_LOADING, payload: true });
        if (param.type == 'categories' && isImageChanged) {
            let newFormData = formData;
            newFormData.append("name", param.name);
            newFormData.append("type", param.type);
            body = newFormData
        } else {
            body = param
        }
        updateConfig(Id,body).then(result => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            if (result.data.status === true) {
                dispatch(loadAppConfigs());
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
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (FormInputs.type === "subCategories" && !FormInputs.isBelongTo) return alert.error("Category is required")
        let param = {
            name: FormInputs.name,
            type: FormInputs.type,
        }
        if (FormInputs.type === "subCategories") {
            param.isBelongTo = FormInputs.isBelongTo
        }
        if (Id) {
            updateConfiguration(param)
        }
        else {
            saveConfiguration(param)
        }
    }

    useEffect(() => {
        if (Id) {
            dispatch({ type: UPDATE_LOADING, payload: true });
            getConfigDetail(Id).then(result => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                if (result.data.status === true) {
                    let { name, type, isBelongTo, file  } = result.data.data
                    setFormInputs({
                        ...FormInputs,
                        name, type, file,
                        isBelongTo : isBelongTo ? isBelongTo : ""
                    })
                }
                else {
                    alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
                }
            }).catch(error => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
                if (error?.response?.status === 404)
                    history.push("/admin/configurations")
            });
        }
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            let formData = new FormData();
            formData.append("file", e.target.files[0]);
            setFormDate(formData);
            setIsImageChanged(URL.createObjectURL(e.target.files[0]));

            // console.log(e.target.files[0]);
        }
    }

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Card>

                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>{Id ? "Edit Configuration" : "Add Configuration"}</h4>
                        </CardHeader>

                        <form onSubmit={handleFormSubmit} className={classes.root} autoComplete="off">
                            <CardBody>
                                <GridContainer>

                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput labelText="Name" id="name" inputProps={{ type: "text", value: FormInputs.name, onChange: handleFormInputChange }} formControlProps={{ fullWidth: true, required: true, }} />
                                    </GridItem>

                                    <GridItem xs={12} sm={12} md={6}>
                                        <label style={{ marginTop: "25px" }}>Type *</label>
                                        <select disabled={Id ? true : false} className="singleline-input" required id="type" onChange={handleFormInputChange} value={FormInputs.type}>
                                            {ConfigurationTypes.map((item, i) => {
                                                return (
                                                    <option value={item} key={i}>{item}</option>
                                                )
                                            })}
                                        </select>
                                    </GridItem>

                                    {
                                        FormInputs.type === "subCategories" &&
                                        <GridItem className="mt-20" xs={12} sm={12} md={12}>
                                            <DropDown
                                                multi={false}
                                                dropdownRenderer={false}
                                                contentRenderer={false}
                                                closeOnSelect={false}
                                                create={false}
                                                onChange={HandleAutoSuggestValChange}
                                                Type="isBelongTo"
                                                options={categoriesList}
                                                val={FormInputs.isBelongTo}
                                                loading={false}
                                                searchBy="name"
                                                labelField="name"
                                                valueField="id"
                                                AddNew={() => { }}
                                                clearable={true}
                                                placeholder="Select"
                                                inputLabel="Category *"
                                                disabled={Id ? true : false}
                                            />
                                        </GridItem>
                                    }

                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <Button type="submit" color="primary">SAVE</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </GridItem>
                {FormInputs.type == 'categories' ? <GridItem xs={12} sm={12} md={4}>
                            <Card profile>
                                    <img src={(!Id && !isImageChanged) ?  require('../../assets/img/placeholder.jpeg') : isImageChanged ? isImageChanged : FormInputs.file ? `${BASE_URL}/${FormInputs.file}` : '' } />
                                    {/* <img src={isImageChanged ? isImageChanged : require('../../assets/img/placeholder.jpeg')} /> */}
                                <CardBody profile>
                                    <input type="file" name="myImage" hidden accept="image/*" 
                                    onChange={handleImageChange} ref={FilesInput} 
                                    />
                                    <a className="ancher_link" 
                                    onClick={() => FilesInput.current.click()}
                                    > {Id ? 'Change' : "Upload"}</a>
                                </CardBody>
                            </Card>
                        </GridItem> : <> </>}
            </GridContainer>
        </div>
    );
}