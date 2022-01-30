/*eslint-disable*/
import React, { useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
// core components
import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.js";
import { allNotifications } from "../../actions/common";
import { SET_NOTIFICATION_COUNT } from "../../actions/types";
import { useSelector, useDispatch } from "react-redux";

import styles from "../../assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);
const notificationStyle = {
  display: "flex",
  justifyContent: "center",
  fontSize: 11,
  height: 24,
  width: 24,
  borderRadius: "50%",
  background: "#9931B1",
  paddingTop: "2px",
};
export default function Sidebar(props) {
  const dispatch = useDispatch();

  const notificationCount = useSelector(
    (state) => state.auth.notificationCount
  );

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    allNotifications().then((result) => {
      if (result.data && result.data.status === true) {
        dispatch({
          type: SET_NOTIFICATION_COUNT,
          payload: result.data.unReadNotifications,
        });
      }
    });
  };

  const [routes, setRoutes] = React.useState(props.sidebarRoutes);

  const handleSubmenueClick = (index) => {
    let Temroutes = [...routes];
    Temroutes[index].isOpen = !Temroutes[index].isOpen;
    setRoutes(Temroutes);
  };

  const classes = useStyles();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }

  const { color, logo, image, logoText } = props;
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        // Classes
        var activePro = " ";
        var listItemClasses;
        if (prop.path === "/upgrade-to-pro") {
          activePro = classes.activePro + " ";
          listItemClasses = classNames({ [" " + classes[color]]: true });
        } else {
          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(prop.layout + prop.path),
          });
        }
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
        });

        return prop.subMenu ? (
          <div key={key}>
            <ListItem
              style={{ paddingLeft: "30px", paddingRight: "30px" }}
              button
              onClick={() => handleSubmenueClick(key)}
            >
              {/* Menu Icon */}
              {typeof prop.icon === "string" ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive,
                  })}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive,
                  })}
                />
              )}

              {/* Menu Text */}
              <ListItemText
                primary={props.rtlActive ? prop.rtlName : prop.name}
                className={classNames(classes.itemText, whiteFontClasses, {
                  [classes.itemTextRTL]: props.rtlActive,
                })}
                disableTypography={true}
              />

              {/* Submenu Icon */}
              {prop.isOpen ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItem>

            <Collapse
              key={key}
              style={{ paddingLeft: "40px" }}
              in={prop.isOpen}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {prop.subMenu.map((subMenuProps, subMenukey) => {
                  return (
                    <div key={subMenukey}>
                      <NavLink
                        to={subMenuProps.layout + subMenuProps.path}
                        className={activePro + classes.item}
                        activeClassName="active"
                      >
                        <ListItem button className={classes.nested}>
                          {/* Menu Text */}
                          <ListItemText
                            primary={
                              props.rtlActive
                                ? subMenuProps.rtlName
                                : subMenuProps.name
                            }
                            className={classNames(
                              classes.itemText,
                              whiteFontClasses,
                              { [classes.itemTextRTL]: props.rtlActive }
                            )}
                            disableTypography={true}
                          />
                        </ListItem>
                      </NavLink>
                    </div>
                  );
                })}
              </List>
            </Collapse>
          </div>
        ) : (
          <div key={key}>
            <NavLink
              to={prop.layout + prop.path}
              className={activePro + classes.item}
              activeClassName="active"
            >
              <ListItem
                button
                className={classes.itemLink + listItemClasses}
                style={{ display: "flex" }}
              >
                {/* Menu Icon */}
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive,
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive,
                    })}
                  />
                )}

                {/* Menu Text */}
                <ListItemText
                  primary={props.rtlActive ? prop.rtlName : prop.name}
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive,
                  })}
                  disableTypography={true}
                />

                {prop.name == "Notifications" &&
                  notificationCount &&
                  notificationCount != 0 && (
                    <div style={notificationStyle}>
                      <span>{notificationCount}</span>
                    </div>
                  )}
              </ListItem>
            </NavLink>
          </div>
        );
      })}
    </List>
  );

  var brand = (
    <div className={classes.logo}>
      <a
        // href="https://www.creative-tim.com?ref=mdr-sidebar"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive,
        })}
        target="_blank"
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <></> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
