import React, { useState, useEffect } from "react";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import MeetAndGreetList from "./MeetAndGreetList"
import PerformersList from "./PerformersList"
import ApprovalAndVerificationList from "./ApprovalAndVerificationList"
import CancelRequestsList from "./CancelRequestsList"

export default function FuncarsList(props) {
  return (<>
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
          <MeetAndGreetList {...props} />
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
          <PerformersList {...props}/>
      </GridItem>
    </GridContainer>
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
          <ApprovalAndVerificationList {...props}/>
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
          <CancelRequestsList {...props} />
      </GridItem>
    </GridContainer>
  </>);
}