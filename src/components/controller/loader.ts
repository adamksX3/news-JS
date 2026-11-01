import { ApiOptions, Callback, Endpoint, RequestParams } from '../../types';

class Loader {
    private baseLink: string;
    private options: Partial<ApiOptions>;

    constructor(baseLink: string, options: Partial<ApiOptions>) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(
        { endpoint, options = {} }: RequestParams,
        callback: Callback<T> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: Partial<ApiOptions>, endpoint: Endpoint): string {
        const urlOptions: Partial<ApiOptions> = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.entries(urlOptions).forEach(([key, value]) => {
            url += `${key}=${value}&`;
        });

        return url.slice(0, -1);
    }

    private load<T>(
        method: string,
        endpoint: Endpoint,
        callback: Callback<T>,
        options: Partial<ApiOptions> = {}
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res): Promise<T> => res.json())
            .then((data) => callback(data))
            .catch((err: Error) => console.error(err));
    }
}

export default Loader;
