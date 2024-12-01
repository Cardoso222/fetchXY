export interface IRequestConfig {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    data?: any;
    retries?: number;
}

export interface IResponse {
    headers: Headers;
    status: number;
    data: any;
    retries?: number;
}