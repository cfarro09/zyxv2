export interface IUser {
    userid: number;
    username: string;
    roleid: number;
    rolename: string;
    firstname: string;
    password: string;
    lastname: string;
    document: string;
    document_type: string;
    email?: string;
    status: string;
    createdate: string;
}

type ValueArray = [number, number, number, number, number];

export type IApplicationsRecord = Record<string, ValueArray>;

export interface IUserSession {
    email: string;
    firstname: string;
    lastname: string;
    status: string;
    token: string;
    usr: string;
    userid: number;
    corpid: number;
    orgid: number;
    menu: IApplicationsRecord;
}
