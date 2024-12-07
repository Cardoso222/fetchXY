import { StatusCodes } from 'http-status-codes';

export interface IRequestConfig {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
    data?: any;
    timeout?: number;
    attempts?: number;

}

export interface IRequestConfigWithRetries extends IRequestConfig {
    retries: number;
    retryDelay: number;
    retryIf: StatusCodes[];
}

export interface IResponse {
    headers: Headers;
    status: number;
    data: any;
    retries?: number;
    retryDelay?: number;
    success?: boolean;
    message?: string;
    attempts?: number;
}

export interface IRequestError {
    status: number;
    retries?: number;
    success?: boolean;
    message?: string;
}

