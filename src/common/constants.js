
//export const BASE_URL = 'http://localhost:8080';
export const BASE_URL = 'http://api.funncar.com';

export const PAGE_LIMIT = 20;
export const MOMENT_DATE_FORMAT = 'DD-MMM-YYYY';

export const APP_ERROR_MSGS = {
    StandardErrorMsg: "Something Went wrong. Please try Again.",
    FormValidationMsg: "Please fix the errors and try again.",
    SaveMsg: "Saved successfully",
    DeleteMsg: "Deleted successfully",
    noRecordFound:"No record found.",
    DeleteConfirmMsg:"Are you sure you want to delete this record?",
    NoPermission: "You don't have permission.",
}

export const GenderEnum =[
    {id:"male",name:"Male"},{id:"female",name:"Female"},{id:"rather-not-say",name:"Rather not say"},{id:"others",name:"Others"}
]

export const APIUrls={
    // Auth
    Login: `${BASE_URL}/api/admin/login`,
    GetMe:`${BASE_URL}/api/admin/me`,
    getAppConfigs:`${BASE_URL}/api/configs`,
    GetAllCountries:`${BASE_URL}/api/locations/countries`,
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
    UploadUserImage: `${BASE_URL}/api/admin/users/upload-docs/`,
    RemoveUserGallery: `${BASE_URL}/api/admin/users/remove-gallery/`,
    UploadUserGallery: `${BASE_URL}/api/admin/users/upload-gallery/`,

    // Bookings
    getAllBookings: `${BASE_URL}/api/admin/bookings`,
    getUserBookings: `${BASE_URL}/api/admin/user-bookings/`,
    getFunncarBookings: `${BASE_URL}/api/admin/funncar-bookings/`,
    getBooking: `${BASE_URL}/api/admin/bookings/`,
    updateBooking: `${BASE_URL}/api/admin/bookings/`,
    deleteBooking: `${BASE_URL}/api/admin/bookings/`,

    //contact Us
    contactUsData: `${BASE_URL}/api/admin/contact-us`,
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
    //Dashboard 
    dashboardData: `${BASE_URL}/api/admin/dashboard`,

}