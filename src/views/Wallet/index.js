import React, { useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import { UPDATE_LOADING } from "../../actions/types";
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { updateWallet } from '../../actions/users';
import { useAlert } from 'react-alert'
import { numberWithCommas } from "../../common/commonMethods"
import CustomInput from "../../components/CustomInput/CustomInput.js";
import { APP_ERROR_MSGS, BASE_URL } from '../../common/constants';

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
  w_400: {
    width: 400
  },
};
const useStyles = makeStyles(styles);

export default function Wallet({ wallet, id, getUser, showTotalEarned = true }) {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  console.log('showTotalEarned',showTotalEarned);

  // state
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const walletStatuses = [
    { value: "deposit", label: "Deposit" },
    { value: "others", label: "Others" },
  ];
  const [walletTab, setWalletTab] = useState('send')


  const resetStates = () => {
    setStatus("")
    setAmount(0)
    setNotes("")
  }

  const updateWalletBalance = () => {
    if (amount < 0)  {
      alert.error('Enter Correct Amount ( must be greater than 0)')
      return;
    }
    if (status == '' || amount < 0 || notes == '') {
      alert.error('All fields are required')
      return;
    }
    let param = {};
    param = {
      "amount": amount,
      ...(walletTab == 'send' ? {"type": "add"} : {"type": "deduct"}),
      ...(status == 'deposit' ? {"status": "deposit"} : {"status": "others"}),
      "notes": notes
  }

    dispatch({ type: UPDATE_LOADING, payload: true });
    updateWallet(id, param).then(result => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      if (result.data.status === true) {
        alert.success(result.data.message)
        getUser()
        resetStates()
        setEditMode(false)
      }
      else {
        alert.error(result.data.message ? result.data.message : APP_ERROR_MSGS.StandardErrorMsg)
      }
    }).catch(error => {
      dispatch({ type: UPDATE_LOADING, payload: false });
      alert.error(error?.response?.data?.error ? error?.response?.data?.error : APP_ERROR_MSGS.StandardErrorMsg)
    });

  }



  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Wallet</h4>
      </CardHeader>
      <CardBody>
        <GridContainer className="mt-20">

          <GridItem xs={12} sm={12} md={5}>
            <span className="Tag_title">Current Balance: </span>
            <span className="Tag_value">{numberWithCommas(wallet?.currentBalance)} {wallet?.currency}</span>
          </GridItem>
          <GridItem xs={12} sm={12} md={5}>
            {showTotalEarned && <><span className="Tag_title">Total Earned: </span>
            <span className="Tag_value"> {numberWithCommas(wallet?.totalEarned)} {wallet?.currency}</span></>}
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            {editMode ?
              <Button className="my-3" onClick={() => setEditMode(false)} color="danger" >Cancel</Button> :
              <Button className="my-3" onClick={() => setEditMode(true)} color="primary">Update Wallet</Button>}
          </GridItem>

        </GridContainer>

        {editMode && <>
          <ul className="nav nav-tabs">
            <li onClick={() => {
              resetStates()
              setWalletTab('send')
            }} className={walletTab === "send" ? "active" : ""}>
              <a>Send Amount to Wallet</a></li>
            <li onClick={() => {
              resetStates()
              setWalletTab('deduct')
              setStatus('others')
            }} className={walletTab === "deduct" ? "active" : ""}>
              <a>Deduct Amount from Wallet</a></li>
          </ul>

          <div className="tab-content">
            <div className={walletTab === "send" ? "tab-pane fade in active p-5" : "tab-pane fade"} >
              <GridContainer className="mt-20">

                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput labelText="Amount" id="sAmount" inputProps={{ type: "number", value: amount, onChange: (e) => setAmount(e.currentTarget.value) }} formControlProps={{ required:true, className: classes.w_400 }} />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <select
                    style={{ height: "40px", minWidth: "300px", margin: 30 }}
                    value={status}
                    onChange={(e) => setStatus(e.currentTarget.value)}
                  >
                    <option value={""}>Select type </option>
                    {walletStatuses.map((item, i) => {
                      return (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      );
                    })}
                  </select>
                </GridItem>
                 <GridItem xs={12} sm={12} md={12}>

                  <CustomInput labelText="Notes" id="notes" formControlProps={{ required:true,fullWidth: true }} inputProps={{ multiline: true, rows: 7, value: notes, onChange: (e) => setNotes(e.currentTarget.value) }} />
                </GridItem>
                <Button className="my-3" onClick={() => updateWalletBalance()} color="primary">Send Amount</Button>
              </GridContainer>
            </div>
            <div className={walletTab === "deduct" ? "tab-pane fade in active p-5" : "tab-pane fade"}>
              <GridContainer className="mt-20">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput labelText="Amount" id="dAmount" inputProps={{ type: "number", value: amount, onChange: (e) => setAmount(e.currentTarget.value) }} formControlProps={{ required:true, className: classes.w_400 }} />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>

                  <CustomInput labelText="Notes" id="notes" formControlProps={{ required:true,fullWidth: true }} inputProps={{ multiline: true, rows: 7, value: notes, onChange: (e) => setNotes(e.currentTarget.value) }} />
                </GridItem>
                <Button className="my-3" onClick={() => updateWalletBalance()} color="primary">Deduct Amount</Button>
              </GridContainer>
            </div>
          </div> </>}
      </CardBody>
    </Card>
  );
}