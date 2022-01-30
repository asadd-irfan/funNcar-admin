import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import EventNoteIcon from "@material-ui/icons/EventNote";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import CallIcon from "@material-ui/icons/Call";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PaymentIcon from "@material-ui/icons/Payment";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";

// export const BASE_URL = 'http://localhost:8080';

// let base_url = "http://localhost:8080";
let base_url = "https://api.stage.funncar.com";
// let base_url = "https://api.funncar.com";
if (process.env.REACT_APP_ENV) {
  base_url = process.env.REACT_APP_API_URL;
}

export const BASE_URL = base_url;

export const PAGE_LIMIT = 20;
export const MOMENT_DATE_FORMAT = "DD-MMM-YYYY";

export const APP_ERROR_MSGS = {
  StandardErrorMsg: "Something Went wrong. Please try Again.",
  FormValidationMsg: "Please fix the errors and try again.",
  SaveMsg: "Saved successfully",
  DeleteMsg: "Deleted successfully",
  noRecordFound: "No record found.",
  DeleteConfirmMsg: "Are you sure you want to delete this record?",
  NoPermission: "You don't have permission.",
};

export const GenderEnum = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "rather-not-say", name: "Rather not say" },
  { id: "others", name: "Others" },
];

export const paymentModes = [
  { value: "jazzcash", label: "Jazzcash" },
  { value: "easypaisa", label: "Easypaisa" },
  { value: "HBLPAY", label: "HBL Pay" },
  { value: "wallet", label: "Wallet" },
];

export const APIUrls = {
  // Auth
  Login: `${BASE_URL}/api/admin/login`,
  GetMe: `${BASE_URL}/api/admin/me`,
  getAppConfigs: `${BASE_URL}/api/configs`,
  GetAllCountries: `${BASE_URL}/api/locations/countries`,
  GetCities: `${BASE_URL}/api/locations/cities`,
  GetDummyServices: `${BASE_URL}/api/user/services`,
  DeleteConfiguration: `${BASE_URL}/api/configs/`,
  saveConfiguration: `${BASE_URL}/api/configs`,
  UpdateConfiguration: `${BASE_URL}/api/configs/`,
  GetConfigDetail: `${BASE_URL}/api/configs/`,

  // Users
  GetUsers: `${BASE_URL}/api/admin/users`,
  DeleteUsers: `${BASE_URL}/api/admin/users/`,
  GetUserDetail: `${BASE_URL}/api/admin/users/`,
  UpdateUser: `${BASE_URL}/api/admin/users/`,
  ApproveUser: `${BASE_URL}/api/admin/users/approve/`,
  VerifyUser: `${BASE_URL}/api/admin/users/verify/`,
  FilterFunncar: `${BASE_URL}/api/admin/filter-users?role=funncar`,
  FilterPerformer: `${BASE_URL}/api/admin/filter-users?role=performer`,
  FilterUser: `${BASE_URL}/api/admin/filter-users?role=user`,
  UploadUserImage: `${BASE_URL}/api/admin/users/upload-docs/`,
  RemoveUserGallery: `${BASE_URL}/api/admin/users/remove-gallery/`,
  UploadUserGallery: `${BASE_URL}/api/admin/users/upload-gallery/`,

  // Bookings
  getAllBookings: `${BASE_URL}/api/admin/bookings`,
  getUserBookings: `${BASE_URL}/api/admin/user-bookings/`,
  getFunncarBookings: `${BASE_URL}/api/admin/funncar-bookings/`,
  getUserBookingsAndTransactions: `${BASE_URL}/api/admin/user-all-transactions/`,
  getBooking: `${BASE_URL}/api/admin/bookings/`,
  updateBooking: `${BASE_URL}/api/admin/bookings/`,
  deleteBooking: `${BASE_URL}/api/admin/bookings/`,
  disputeBookingPayment: `${BASE_URL}/api/admin/send-booking-payment/`,

  coupons: `${BASE_URL}/api/admin/coupon`,
  coupon: `${BASE_URL}/api/admin/coupon/`,

  // contact Us
  contactUsData: `${BASE_URL}/api/admin/contact-us`,
  notificationsList: `${BASE_URL}/api/user/notifications`,
  readNotification: `${BASE_URL}/api/user/read-notification/`,
  callRecordsList: `${BASE_URL}/api/admin/video-call-records`,
  callRecordsOfBooking: `${BASE_URL}/api/admin/video-call-records/`,

  // subscribeEmail
  subscribeEmailData: `${BASE_URL}/api/admin/subscribeEmail`,
  //  Terms And condition
  termsCondition: `${BASE_URL}/api/admin/static-pages?pageName=`,
  staticPage: `${BASE_URL}/api/admin/static-pages`,
  // Reviews
  getAllReviews: `${BASE_URL}/api/user/reviews/`,
  deleteReview: `${BASE_URL}/api/admin/reviews/`,

  // Homepage
  getHomepageData: `${BASE_URL}/api/admin/homepage?type=`,
  homePopularFunncar: `${BASE_URL}/api/viewAllCelebs?isPopular=true`,
  homePopularPerformer: `${BASE_URL}/api/viewAllPerformers?isPopular=true`,
  updateHomepageData: `${BASE_URL}/api/admin/homepage/`,
  uploadHomepageFile: `${BASE_URL}/api/admin/homepage/upload-file?type=`,
  deleteHomepageFile: `${BASE_URL}/api/admin/homepage/file/`,

  // WebSiteHomepage
  getWebsiteHomepageData: `${BASE_URL}/api/admin/homepage?type=`,
  uploadWebsiteHomepageFile: `${BASE_URL}/api/admin/homepage/upload-file?type=`,
  deleteWebsiteHomepageFile: `${BASE_URL}/api/admin/homepage/file/`,

  // Dashboard
  getWallet: `${BASE_URL}/api/admin/dashboard/wallet`,
  getTableList: `${BASE_URL}/api/admin/dashboard/filters?`,
  // dashboardData: `${BASE_URL}/api/admin/dashboard`,

  // settings
  appSettingsUpdate: `${BASE_URL}/api/admin/settings`,
  appSettings: `${BASE_URL}/api/settings`,

  // Payments
  getTransactions: `${BASE_URL}/api/admin/transactions`,
  userTransactions: `${BASE_URL}/api/admin/transactions/`,
  funncarWalletHistory: `${BASE_URL}/api/admin/funncar-wallet/`,
  allPaymentRequests: `${BASE_URL}/api/admin/payment-requests`,
  paymentRequest: `${BASE_URL}/api/admin/payment-request/`,
  sendPayment: `${BASE_URL}/api/admin/send-payment/`,

  updateUserWallet: `${BASE_URL}/api/admin/wallet/`,
};

export const adminSideBar = [
  // Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    layout: "/admin",
  },
  // Users
  {
    name: "Users",
    icon: Person,
    layout: "/admin",
    isOpen: false,
    subMenu: [
      {
        path: "/users",
        name: "Fans",
        layout: "/admin",
      },
      {
        path: "/funncars",
        name: "Celebrities",
        layout: "/admin",
      },
      {
        path: "/performers",
        name: "Performers",
        layout: "/admin",
      },
    ],
  },
  {
    path: "/bookings",
    name: "Bookings",
    icon: EventNoteIcon,
    layout: "/admin",
  },
  {
    path: "/dispute-bookings",
    name: "Dispute Bookings",
    icon: EventNoteIcon,
    layout: "/admin",
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: MonetizationOnIcon,
    layout: "/admin",
  },
  {
    path: "/payment-requests",
    name: "Payment Requests",
    icon: PaymentIcon,
    layout: "/admin",
  },
  {
    path: "/coupons",
    name: "Coupons",
    icon: CardGiftcardIcon,
    layout: "/admin",
  },
  // Home Page
  {
    name: "Home Pages",
    icon: HomeIcon,
    layout: "/admin",
    isOpen: false,
    subMenu: [
      {
        path: "/celebs-homepage",
        name: "Celebrities Homepage",
        layout: "/admin",
      },
      {
        path: "/performer-homepage",
        name: "Performer Homepage",
        layout: "/admin",
      },
    ],
  },
  {
    name: "Content",
    icon: HomeIcon,
    layout: "/admin",
    isOpen: false,
    subMenu: [
      {
        path: "/terms-conditions",
        name: "Terms & Conditions",
        layout: "/admin",
      },
      {
        path: "/privacy-policy",
        name: "Privacy Policy",
        layout: "/admin",
      },
    ],
  },
  {
    path: "/website_homepage",
    name: "WebSite Home Page",
    icon: HomeIcon,
    layout: "/admin",
  },
  {
    path: "/call-records",
    name: "Agora Call Records",
    icon: CallIcon,
    layout: "/admin",
  },
  {
    path: "/contact-us",
    name: "Contact Us Queries",
    icon: EmailIcon,
    layout: "/admin",
  },
  {
    path: "/contact-email",
    name: "Subscribe Email",
    icon: EmailIcon,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: NotificationsActiveIcon,
    layout: "/admin",
  },

  // Configurations
  {
    path: "/configurations",
    name: "Configurations/Settings",
    icon: SettingsIcon,
    layout: "/admin",
  },
];
export const managerSideBar = [
  // Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    layout: "/admin",
  },
  // Users
  {
    name: "Users",
    icon: Person,
    layout: "/admin",
    isOpen: false,
    subMenu: [
      {
        path: "/users",
        name: "Fans",
        layout: "/admin",
      },
      {
        path: "/funncars",
        name: "Celebrities",
        layout: "/admin",
      },
      {
        path: "/performers",
        name: "Performers",
        layout: "/admin",
      },
    ],
  },
  {
    path: "/bookings",
    name: "Bookings",
    icon: EventNoteIcon,
    layout: "/admin",
  },
  {
    path: "/dispute-bookings",
    name: "Dispute Bookings",
    icon: EventNoteIcon,
    layout: "/admin",
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: MonetizationOnIcon,
    layout: "/admin",
  },
  {
    path: "/call-records",
    name: "Agora Call Records",
    icon: CallIcon,
    layout: "/admin",
  },
  {
    path: "/contact-us",
    name: "Contact Us Queries",
    icon: EmailIcon,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: NotificationsActiveIcon,
    layout: "/admin",
  },
];
export const staffSideBar = [
  {
    path: "/bookings",
    name: "Bookings",
    icon: EventNoteIcon,
    layout: "/admin",
  },
  {
    path: "/dispute-bookings",
    name: "Dispute Bookings",
    icon: EventNoteIcon,
    layout: "/admin",
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: MonetizationOnIcon,
    layout: "/admin",
  },

  {
    path: "/call-records",
    name: "Agora Call Records",
    icon: CallIcon,
    layout: "/admin",
  },
  {
    path: "/contact-us",
    name: "Contact Us Queries",
    icon: EmailIcon,
    layout: "/admin",
  },
];
