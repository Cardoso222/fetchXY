export interface FetchXYConfig {
    /**
     * Request URL
     */
    url?: string;
    /**
     * HTTP method
     */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    /**
     * Request headers
     */
    headers?: Record<string, string>;
    /**
     * Request body data
     */
    data?: any;
    /**
     * Request timeout in milliseconds
     * @default 10000
     */
    timeout?: number;
    /**
     * Number of retry attempts
     */
    retries?: number;
    /**
     * Delay between retries in milliseconds
     * @default 1000
     */
    retryDelay?: number;
    /**
     * HTTP status codes that should trigger a retry
     * @default []
     */
    retryIf?: number[];
    /**
     * Current number of attempts made
     * @internal
     */
    attempts?: number;
}

export interface FetchXYResponse<T = any> {
    /**
     * Response data
     */
    data?: T;
    /**
     * Response headers
     */
    headers?: Headers;
    /**
     * HTTP status code
     */
    status: number;
    /**
     * Number of retry attempts made
     */
    attempts: number;
    /**
     * Original number of retries configured
     */
    retries: number;
    /**
     * Retry delay in milliseconds
     */
    retryDelay: number;
    /**
     * Whether the request was successful (status 2xx)
     */
    success: boolean;
    /**
     * Error message if request failed
     */
    message?: string;
}

export default class FetchXY {
    /**
     * Creates a new FetchXY instance
     * @param defaultConfig Default configuration for all requests
     */
    constructor(defaultConfig?: FetchXYConfig);

    /**
     * Makes an HTTP request
     * @param config Request configuration
     */
    request<T = any>(config: FetchXYConfig): Promise<FetchXYResponse<T>>;

    /**
     * Makes a GET request
     * @param url Request URL
     * @param config Additional request configuration
     */
    get<T = any>(url: string, config?: Omit<FetchXYConfig, 'url' | 'method'>): Promise<FetchXYResponse<T>>;

    /**
     * Makes a POST request
     * @param url Request URL
     * @param config Additional request configuration
     */
    post<T = any>(url: string, config?: Omit<FetchXYConfig, 'url' | 'method'>): Promise<FetchXYResponse<T>>;

    /**
     * Makes a PUT request
     * @param url Request URL
     * @param config Additional request configuration
     */
    put<T = any>(url: string, config?: Omit<FetchXYConfig, 'url' | 'method'>): Promise<FetchXYResponse<T>>;

    /**
     * Makes a PATCH request
     * @param url Request URL
     * @param config Additional request configuration
     */
    patch<T = any>(url: string, config?: Omit<FetchXYConfig, 'url' | 'method'>): Promise<FetchXYResponse<T>>;

    /**
     * Makes a DELETE request
     * @param url Request URL
     * @param config Additional request configuration
     */
    delete<T = any>(url: string, config?: Omit<FetchXYConfig, 'url' | 'method'>): Promise<FetchXYResponse<T>>;
} 