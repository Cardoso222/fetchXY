export interface IRequestConfig {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
    data?: any;
    retries?: number;
    timeout?: number;
}

export interface IResponse {
    headers: Headers;
    status: number;
    data: any;
    retries?: number;
    success?: boolean;
    message?: string;
}

export interface IRequestError {
    status: number;
    retries?: number;
    success?: boolean;
    message?: string;
}

