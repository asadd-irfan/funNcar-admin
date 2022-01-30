import React, { useState, useEffect } from "react";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import GridItem from "../Grid/GridItem.js";
import GridContainer from "../Grid/GridContainer.js";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CustomInput from "../CustomInput/CustomInput.js";


export default function CommissionRate({ commissionRate, serviceCharges, updateCommissionRates }) {
    const [serviceChargesStatus, setServiceChargesStatus] = useState(false);

    const handleServiceChargesStatus = (e) => {
        setServiceChargesStatus(e.target.checked);
    }

    const [data, setCommissionRate] = useState([{
        "percentage": 10,
        "startDate": new Date(),
        "endDate": new Date(),
        "cardTitle": "Commission Rate - 1st Year",
        "cardDescription": "You will be charged special commission as per your services"
    },
    {
        "percentage": 15,
        "startDate": new Date(),
        "endDate": new Date(),
        "cardTitle": "Commission Rate - 2nd Year",
        "cardDescription": "You will be charged special commission as per your services"
    },
    {
        "percentage": 20,
        "startDate": new Date(),
        "endDate": new Date(),
        "cardTitle": "Commission Rate - 3rd Year",
        "cardDescription": "You will be charged special commission as per your services"
    }])

    const handleInputChange = (i, e) => {
        const fieldId = e.currentTarget.id
        let ratesArray = [...data];
        ratesArray[i][fieldId] = e.currentTarget.value
        setCommissionRate(ratesArray)

    }
    const handleDate = (date, type, i) => {
        let ratesArray = [...data];
        ratesArray[i][type] = date;
        setCommissionRate(ratesArray)
    }
    const onClickSave = () => {
        let body;
        if (serviceChargesStatus == true) {
            body = {
                serviceCharges: {status: true},
                commissionRate: data
            }
        }
        if (serviceChargesStatus == false) {
            body = {
                serviceCharges: {status: false},
                commissionRate: []
            }
        }
        updateCommissionRates(body)
    }


    useEffect(() => {
        if (commissionRate?.length) {
            setCommissionRate(commissionRate);
        }
        if (serviceCharges && serviceCharges) {
            setServiceChargesStatus(serviceCharges?.status)
        }
    }, [commissionRate, serviceCharges]);

    return (
        <Card>
            <CardHeader color="primary">
                <h4 >Commission Rate</h4>
            </CardHeader>
            <CardBody>
                <>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={1} />
                        <GridItem xs={12} sm={12} md={7}>
                            <h4 style={{ fontWeight: '600', fontSize: 20, marginBottom: 10, marginTop: 10 }}>
                                Funncar Service Charges</h4>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={4}>
                            <FormGroup row className="mt-3">

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={serviceChargesStatus}
                                            onChange={handleServiceChargesStatus}
                                            color="primary"
                                        />
                                    }
                                    label="Status"
                                />
                            </FormGroup>
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem className="align_left" xs={12} sm={12} md={11}>
                            {serviceChargesStatus && <>
                                {data?.map((item, index) => {
                                    return (<div key={index}>
                                        <hr style={{ borderTop: '4px solid black' }} />
                                        <GridContainer className=" p-1">
                                            <GridItem md={1} />
                                            <GridItem xs={12} sm={12} md={7}>
                                                <CustomInput labelText="Card Title" id="cardTitle" inputProps={{ type: "text", value: item.cardTitle, onChange: (e) => handleInputChange(index, e) }} formControlProps={{ fullWidth: true, required: true, }} />
                                            </GridItem>
                                            <GridItem md={1} />
                                            <GridItem xs={12} sm={12} md={3}>
                                                <CustomInput labelText="Percentage" id="percentage" inputProps={{ type: "number", value: item.percentage, onChange: (e) => handleInputChange(index, e) }} formControlProps={{ fullWidth: true, required: true, }} />
                                            </GridItem>
                                            <GridItem md={1} />
                                            <GridItem xs={12} sm={12} md={11}>
                                                <CustomInput labelText="Card Description" id="cardDescription" inputProps={{ type: "text", value: item.cardDescription, onChange: (e) => handleInputChange(index, e) }} formControlProps={{ fullWidth: true, required: true, }} />
                                            </GridItem>
                                            <GridItem md={1} />
                                            <GridItem xs={12} sm={12} md={4}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker className="mb-3"
                                                        disableToolbar
                                                        variant="inline"
                                                        format="MM/dd/yyyy"
                                                        autoOk={true} margin="normal"
                                                        id="date-picker-inline"
                                                        label="Start Date"
                                                        value={item.startDate}
                                                        onChange={(date) => handleDate(date, 'startDate', index)}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}

                                                    />
                                                </MuiPickersUtilsProvider>
                                            </GridItem>
                                            <GridItem md={1} />
                                            <GridItem xs={12} sm={12} md={6}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker className="mb-3"
                                                        disableToolbar
                                                        variant="inline"
                                                        format="MM/dd/yyyy"
                                                        autoOk={true} margin="normal"
                                                        id="date-picker-inline"
                                                        label="End Date"
                                                        value={item.endDate}
                                                        onChange={(date) => handleDate(date, 'endDate', index)}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}

                                                    />
                                                </MuiPickersUtilsProvider>
                                            </GridItem>
                                        </GridContainer>

                                    </div>

                                    )
                                })}
                            </>}

                        </GridItem>
                    </GridContainer>
                </>
            </CardBody>
            <CardFooter>
                <Button type="button" color="primary" onClick={onClickSave}>SAVE</Button>
            </CardFooter>
        </Card>
    )
}