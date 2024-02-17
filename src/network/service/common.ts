import { apiUrls } from '../../common/constants';
import { IRequestBody, IRequestBodyPaginated, ITransaction, IRequestBodyDynamic } from '@types';
import { APIManager } from '../manager';
import { removeAuthorizationToken } from "common/helpers";

export function login(username: string, password: string) {
    return APIManager.post(apiUrls.LOGIN_URL, { data: { username, password } }, false);
}

export function logout() {
    const tmp = APIManager.post(apiUrls.LOGOUT_URL, {}, true);
    removeAuthorizationToken()
    return tmp;
}

export function validateToken(firstLoad: string) {
    return APIManager.get(apiUrls.LOGIN_URL + `?firstload=${firstLoad ?? ""}`, {}, true);
}

export function uploadFile(data: FormData) {
    return APIManager.post(apiUrls.UPLOAD_FILE, { data }, true, {'Content-Type': 'multipart/form-data'});
}

export function exportData(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.EXPORT_DATA, { data: requestBody }, true);
}

export function incrementalInvokeToken() {
    return APIManager.get(apiUrls.INVOKE_INCREMENTAL, {}, true);
}

export function changeOrganization(newcorpid: number, neworgid: number, corpdesc: string, orgdesc: string) {
    return APIManager.post(apiUrls.CHANGE_ORGANIZATION, { data: { parameters: { newcorpid, neworgid, corpdesc, orgdesc } } }, true);
}

export function main(requestBody: IRequestBody | ITransaction, transaction: boolean = false) {
    return APIManager.post(transaction ? apiUrls.EXECUTE_TRANSACTION : apiUrls.MAIN_URL, { data: requestBody }, true);
}
export function mainPublic(requestBody: IRequestBody | ITransaction) {
    return APIManager.post(apiUrls.MAIN_URL_PUBLIC, { data: requestBody }, true);
}
export function mainPaymentOrder(requestBody: IRequestBody | ITransaction) {
    return APIManager.post(apiUrls.MAIN_URL_PAYMENTORDER, { data: requestBody }, true);
}

export function multiMain(requestBody: IRequestBody[]) {
    return APIManager.post(apiUrls.MAIN_MULTI, { data: requestBody }, true);
}
export function multiMainPublic(requestBody: string[]) {
    return APIManager.post(apiUrls.MAIN_MULTI_PUBLIC, { data: { parameters: { domains: requestBody } } }, true);
}

export function mainPaginated(requestBody: IRequestBodyPaginated) {
    return APIManager.post(apiUrls.MAIN_PAGINATED, { data: requestBody }, true);
}

export function mainGraphic(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.MAIN_GRAPHIC, { data: requestBody }, true);
}

export function mainDynamic(requestBody: IRequestBodyDynamic) {
    return APIManager.post(apiUrls.MAIN_DYNAMIC, { data: requestBody }, true);
}

export function mainDynamicExport(requestBody: IRequestBodyDynamic) {
    return APIManager.post(apiUrls.MAIN_DYNAMIC_EXPORT, { data: requestBody }, true);
}

export function mainEventBooking(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.MAIN_EVENT_BOOKING_URL, { data: requestBody }, false);
}
export function mainEventCancelBooking(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.MAIN_EVENT_CANCELBOOKING_URL, { data: requestBody }, false);
}