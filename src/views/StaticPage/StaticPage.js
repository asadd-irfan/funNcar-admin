import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { convertFromHTML, ContentState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch } from "react-redux";
import {
  termsConditions,
  termPrivacy,
  postNewPrivacy,
} from "../../actions/common";
import { UPDATE_LOADING } from "../../actions/types";
import { APP_ERROR_MSGS } from "../../common/constants";
import { useAlert } from "react-alert";

const styleObj = {
  fontSize: 14,
  background: "#8e24aa",
  color: "#ffff",
  textAlign: "center",
  padding: "10px",
  border: "none",
};
export default function TextEditor() {
  const location = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();
  let obj = { pageName: "" };
  const [contentState, setContentState] = useState();
  const [editorText, seteditorText] = useState();
  const [newData, setNewData] = useState(false);
  const [block, setBlock] = useState();
  const [draft, setdraft] = useState();
  const [staticPageId, setStaticPageId] = useState();
  let path = location.pathname;
  let paramString;
  useEffect(() => {
    if (path === "/admin/terms-conditions") {
      paramString = "terms_of_service";
    } else {
      paramString = "privacy_policy";
    }
    dispatch({ type: UPDATE_LOADING, payload: true });
    termsConditions(paramString)
      .then((res) => {
        if (res.data.status === true) {
          let result = res.data.hasOwnProperty("data");
          if (result == true) {
            let description = res.data.data[0].description;
            const contentBlocks = convertFromHTML(
              description == null || description == "<p></p>\n"
                ? "<p>...</p>"
                : description
            );
            const contentState = ContentState.createFromBlockArray(
              contentBlocks.contentBlocks,
              contentBlocks.entityMap
            );
            let draft = convertToRaw(contentState);
            setdraft(draft);
            seteditorText(
              htmlToDraft(
                description == null || description == "<p></p>\n"
                  ? "<p>...</p>"
                  : description
              )
            );
            setContentState(description);
            setStaticPageId(res.data.data[0]._id);
            dispatch({ type: UPDATE_LOADING, payload: false });
          } else {
            setNewData(true);
          }
        } else {
          dispatch({ type: UPDATE_LOADING, payload: false });
          alert.error(
            res.data.message
              ? res.data.message
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
  }, []);

  const handleChange = (contentState) => {
    setBlock(contentState);
    let draf = draftToHtml(contentState);
    setContentState(draf);
  };
  const handleSubmit = (state) => {
    console.log(contentState);
    dispatch({ type: UPDATE_LOADING, payload: true });
    let object = { description: "" };
    if (path === "/admin/terms-conditions") {
      object = { ...object, description: contentState };
    } else {
      object = { ...object, description: contentState };
    }
    if (block && block.blocks[0].text == "") {
      alert.show("Empty page Not Update");
      dispatch({ type: UPDATE_LOADING, payload: false });
    } else {
      if (newData == true) {
        obj = {
          ...obj,
          pageName:
            path === "/admin/terms-conditions"
              ? "terms_of_service"
              : "privacy_policy",
          description: contentState,
        };
        postNewPrivacy(obj)
          .then((result) => {
            if (result.data.status === true) {
              dispatch({ type: UPDATE_LOADING, payload: false });
              alert.success("New Record Created!");
            } else {
              dispatch({ type: UPDATE_LOADING, payload: false });
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
      } else {
        termPrivacy(object, staticPageId)
          .then((result) => {
            if (result.data.status === true) {
              dispatch({ type: UPDATE_LOADING, payload: false });
              alert.success("data Update Successfully!");
            } else {
              dispatch({ type: UPDATE_LOADING, payload: false });
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
    }
  };

  return (
    <>
      <Editor
        contentState={draft}
        onContentStateChange={handleChange}
        editorStyle={{
          height: "200px",
          border: "1px solid #f4f4f4",
          fontWeight: "100",
        }}
      />
      <button onClick={handleSubmit} style={styleObj}>
        Submit
      </button>
    </>
  );
}
