const ENV = import.meta.env.VITE_ENV || 'LOCAL';

const APIS_URL: Record<string, Record<string, string | boolean>> = {
    DEVELOP: {
        API: 'https://apix.laraigo.com/api',
        //WS: 'http://localhost:7070',
        WS: 'https://socket.laraigo.com',
    },
    TESTING: {
        API: 'https://testapix.laraigo.com/api',
        WS: 'https://testsocket.laraigo.com',
    },
    LOCAL: {
        API: 'http://localhost:6065/api',
        //API: 'https://apix.laraigo.com/api',
        //WS: 'http://localhost:7070',
    }
}

const BASE_URL = APIS_URL[ENV].API
const WS_URL = APIS_URL[ENV].WS

export const apiUrls = {
    WS_URL,

    LOGIN_URL: `${BASE_URL}/auth`,
    CONNECT_INBOX: `${BASE_URL}/auth/connect`,
    INVOKE_INCREMENTAL: `${BASE_URL}/auth/incremental/invoke/token`,
    CHANGE_ORGANIZATION: `${BASE_URL}/auth/changeorganization`,
    LOGOUT_URL: `${BASE_URL}/auth/logout`,
    MAIN_URL: `${BASE_URL}/main`,
    MAIN_EVENT_BOOKING_URL: `${BASE_URL}/event-booking/collection`,
    MAIN_EVENT_CANCELBOOKING_URL: `${BASE_URL}/event-booking/canceleventlaraigo`,
    MAIN_URL_PUBLIC: `${BASE_URL}/main/public/domainvalues`,
    MAIN_URL_PAYMENTORDER: `${BASE_URL}/main/public/paymentorder`,
    MAIN_URL_PAYMENTORDERNIUBIZ: `${BASE_URL}/main/public/paymentorderniubiz`,
    MAIN_URL_PAYMENTORDEROPENPAY: `${BASE_URL}/main/public/paymentorderopenpay`,
    MAIN_URL_PAYMENTORDERIZIPAY: `${BASE_URL}/main/public/paymentorderizipay`,
    MAIN_MULTI: `${BASE_URL}/main/multi`,
    MAIN_MULTI_PUBLIC: `${BASE_URL}/main/public/multi/domainvalues`,
    EXECUTE_TRANSACTION: `${BASE_URL}/main/executetransaction`,
    MAIN_PAGINATED: `${BASE_URL}/main/paginated`,
    MAIN_GRAPHIC: `${BASE_URL}/main/graphic`,
    MAIN_DYNAMIC: `${BASE_URL}/reportdesigner`,
    MAIN_DYNAMIC_EXPORT: `${BASE_URL}/reportdesigner/export`,
    UPLOAD_FILE: `${BASE_URL}/upload`,
    EXPORT_DATA: `${BASE_URL}/main/export`,
};