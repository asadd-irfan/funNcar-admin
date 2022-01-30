import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "../routes.js";

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle.js";
import { useLocation } from 'react-router-dom';
import { adminSideBar, managerSideBar, staffSideBar } from '../common/constants';
import { useSelector } from "react-redux";

import logo from "../assets/img/logo.png";

let ps;


const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const user = useSelector(state => state.auth.user);
  let allRoutes = [], route = '/dashboard';
  if (user.isSuperAdmin) {
    allRoutes = adminSideBar
    route = '/dashboard';
  }
  if (user.isManager) {
    allRoutes = managerSideBar
    route = '/dashboard';
  }
  if (user.isStaff) {
    allRoutes = staffSideBar
    route = '/bookings';
  }


  const switchRoutes = (
    <Switch>
      {routes.map((prop, ind) => {
        if (prop.layout === "/admin" && (
          (user.isStaff && (prop.path.includes("booking") || prop.path.includes("/transactions") || prop.path.includes("/contact-us") || prop.path.includes("/call-records")))
          || (user.isManager && (!prop.path.includes("/configuration") && !prop.path.includes("-homepage") && !prop.path.includes("coupon") && !prop.path.includes("/payment-request") ))
          || (user.isSuperAdmin)
        )) {
          return (
            <Route key={`${ind}}`}
              path={prop.layout + prop.path}
              component={prop.component}
            />
          );
        }
        return null;
      })}
      <Redirect from="/admin" to={"/admin" + route} />
    </Switch>
  );
  const location = useLocation();
  let str = location.pathname
  route = str.substring(6, str.length);

  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  // const [image, setImage] = React.useState(bgImage);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        sidebarRoutes={allRoutes}
        logoText={"Funncar Admin"}
        logo={logo}
        // image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={"blue"}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
      </div>
    </div>
  );
}
