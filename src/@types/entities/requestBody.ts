export type ParametersPaginated = {
    skip: number;
    take: number;
    filters: object;
    sorts: object;
    origin: string;
    offset?: number;
} & object

export interface IRequestBody<TService = object> {
    method: string,
    key?: string,
    parameters: object,
    type?: string;
    service?: TService;
}

export interface IRequestBodyPaginated {
    methodCollection: string,
    methodCount?: string,
    parameters: ParametersPaginated
}


export interface ITransaction {
    header: IRequestBody | null,
    detail: (IRequestBody | null)[]
}

export interface IRequestBodyDynamic {
    columns: object[];
    summaries: object[];
    filters: object[];
    parameters: object
}