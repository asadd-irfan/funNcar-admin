import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react';
import {SHOW_ALERT} from './actions/types';

export default function AlertWrapper({ store }) {
  const alert = useAlert()
  const { type, message } = useSelector(state => state.alert);
  const dispatch = useDispatch();


  useEffect(() => {
    if (message == "")
      return

    if (type == 0)
      alert.error(message)

    if (type == 1)
      alert.success(message)

    if (type == 2)
      alert.info(message)

    dispatch({type: SHOW_ALERT,payload:{type:1,message:""}});

  }, [message]);

  return (<></>);
}