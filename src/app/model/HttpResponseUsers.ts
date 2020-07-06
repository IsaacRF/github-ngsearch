/**
 * Http response user interface
 */
export interface HttpResponseUsers {
    total_count: number;
    items: Array<HttpResponseUserItems>;
}

interface HttpResponseUserItems {
    login: string;
    avatar_url: string;
}
