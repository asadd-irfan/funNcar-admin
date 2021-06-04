
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";

import DashboardPage from "./views/Dashboard/Dashboard.js";
// import UserProfile from "./views/UserProfile/UserProfile.js";

import UsersList from "./views/Users/Users_List";
import UserEdit from "./views/Users/Users_Edit";
import UserView from "./views/Users/Users_View";

import FuncarsList from "./views/Funcar/Funcars_List";
import FuncarEdit from "./views/Funcar/Funcars_Edit";
import FuncarView from "./views/Funcar/Funcars_View";

import PerformersList from "./views/Performer/Performers_List";
import PerformerEdit from "./views/Performer/Performers_Edit";
import PerformerView from "./views/Performer/Performers_View";

import ConfigurationsList from "./views/Configurations/Configurations_List.js";
import ConfigurationsAdd from "./views/Configurations/Configurations_Add.js";
import BookingsList from "./views/bookings/bookingsList";
import Booking_View from "./views/bookings/booking_View";
import ContactUs from "./views/ContactUs/ContactUs";
import HomepagePerformer from "./views/HomePage/homepagePerformer";
import HomepageCelebs from "./views/HomePage/homepageCelebs";
import HomeIcon from '@material-ui/icons/Home';

const dashboardRoutes = [

  // Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    showInMenue: true
  },

  // Users
  {
    path: "/users",
    name: "Fans",
    icon: Person,
    component: UsersList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/User_Edit/:Id",
    name: "Edit User",
    icon: Person,
    component: UserEdit,
    layout: "/admin",
    showInMenue: false
  },
  {
    path: "/user/:Id",
    name: "User Details",
    icon: Person,
    component: UserView,
    layout: "/admin",
    showInMenue: false
  },

  // Funcars
  {
    path: "/funncars",
    name: "Funncars",
    icon: Person,
    component: FuncarsList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/Funncar_Edit/:Id",
    name: "Edit Funcar",
    icon: Person,
    component: FuncarEdit,
    layout: "/admin",
    showInMenue: false
  },
  {
    path: "/funncar/:Id",
    name: "Funncar Details",
    icon: Person,
    component: FuncarView,
    layout: "/admin",
    showInMenue: false
  },
  
  // Performers
  {
    path: "/performers",
    name: "Performers",
    icon: Person,
    component: PerformersList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/Performer_Edit/:Id",
    name: "Edit Performer",
    icon: Person,
    component: PerformerEdit,
    layout: "/admin",
    showInMenue: false
  },
  {
    path: "/performer/:Id",
    name: "Performer Details",
    icon: Person,
    component: PerformerView,
    layout: "/admin",
    showInMenue: false
  },

  // Configuration
  {
    path: "/configurations",
    name: "Configurations",
    component: ConfigurationsList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/Configuration_Edit/:Id",
    name: "Edit Configuration",
    component: ConfigurationsAdd,
    layout: "/admin",
  },
  {
    path: "/Configuration_Add",
    name: "",
    component: ConfigurationsAdd,
    layout: "/admin",
  },
  {
    path: "/bookings",
    name: "Bookings",
    component: BookingsList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/booking/:Id",
    name: "Booking Details",
    component: Booking_View,
    layout: "/admin",
  },
  {
    path: "/contact-us",
    name: "Contact Us Data",
    component: ContactUs,
    layout: "/admin",
  },
  {
    path: "/celebs-homepage",
    name: "Celebrities Home Page",
    component: HomepageCelebs,
    icon: HomeIcon,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/performer-homepage",
    icon: HomeIcon,
    name: "Performer Home Page",
    component: HomepagePerformer,
    layout: "/admin",
    showInMenue: true
  },


];

export default dashboardRoutes;
