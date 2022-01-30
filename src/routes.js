
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
import DisputeBookingsList from "./views/bookings/disputeBookingsList";
import SendBookingPayment from "./views/bookings/sendBookingPayment";
import ContactUs from "./views/ContactUs/ContactUs";
import SubscribeEmail from "./views/SubscribeEmail/subscribeEmail.js";
import VideoCallRecords from "./views/VideoCallrecords/videoCallRecords";
import Notifications from "./views/Notifications/notifications";
import HomepagePerformer from "./views/HomePage/homepagePerformer";
import Settings from "./views/Settings/index";
import HomepageCelebs from "./views/HomePage/homepageCelebs";
import WebSiteHomePage from "./views/WebSiteHomePage/index.js";
import PaymentRequests from "./views/PaymentRequests/paymentRequests";
import SendPayment from "./views/PaymentRequests/sendPayment";
import AllTransactions from "./views/Transactions/allTransactions";
import couponsTable from "./views/Coupons/coupon";
import HomeIcon from '@material-ui/icons/Home';
import CouponAdd from "./views/Coupons/Coupon_Add";
import StaticPage from "./views/StaticPage/StaticPage.js";

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
    name: "Celebrities",
    icon: Person,
    component: FuncarsList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/Funncar_Edit/:Id",
    name: "Edit Celebrity",
    icon: Person,
    component: FuncarEdit,
    layout: "/admin",
    showInMenue: false
  },
  {
    path: "/funncar/:Id",
    name: "Celebrity Details",
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
    name: "App Configurations",
    component: ConfigurationsList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/configuration_Edit/:Id",
    name: "Edit Configuration",
    component: ConfigurationsAdd,
    layout: "/admin",
  },
  {
    path: "/configuration_Add",
    name: "",
    component: ConfigurationsAdd,
    layout: "/admin",
  },

  // Bookings
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

  // Dispute Bookings
  {
    path: "/dispute-bookings",
    name: "Dispute Bookings",
    component: DisputeBookingsList,
    layout: "/admin",
    showInMenue: true
  },
  {
    path: "/dispute-booking/:Id",
    name: "Send Booking Payment",
    component: SendBookingPayment,
    layout: "/admin",
  },
  {
    path: "/call-records",
    name: "Agora Video Call Records",
    component: VideoCallRecords,
    layout: "/admin",
  },
  {
    path: "/contact-us",
    name: "Contact Us Queries",
    component: ContactUs,
    layout: "/admin",
  },
  // content
  {
    path: "/terms-conditions",
    name: "Terms & Conditions",
    component: StaticPage,
    layout: "/admin",
  },
  {
    path: "/privacy-policy",
    name: "Privacy & Policy",
    component: StaticPage,
    layout: "/admin",
  },

  {
    path: "/contact-email",
    name: "Subscription",
    component: SubscribeEmail,
    layout: "/admin",
  },
  // {
  //   path: "/settings",
  //   name: "App Settings",
  //   component: Settings,
  //   layout: "/admin",
  // },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
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
    path: "/website_homepage",
    name: "WebSite Home Page",
    component: WebSiteHomePage,
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
  {
    path: "/transactions",
    name: "Transactions",
    component: AllTransactions,
    layout: "/admin",
  },
  {
    path: "/payment-requests",
    name: "Payment Requests",
    component: PaymentRequests,
    layout: "/admin",
  },
  {
    path: "/payment-request/:Id",
    name: "Payment Request",
    component: SendPayment,
    layout: "/admin",
  },
  {
    path: "/coupons",
    name: "Coupons ",
    component: couponsTable,
    layout: "/admin",
  },
  {
    path: "/add_coupon",
    name: "Create Coupon",
    component: CouponAdd,
    layout: "/admin",
  },
  {
    path: "/coupon/:Id",
    name: "Edit Coupon",
    component: CouponAdd,
    layout: "/admin",
  },
  
];

export default dashboardRoutes;
