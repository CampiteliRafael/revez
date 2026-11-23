export type RequestOptions = {
  params?: Record<string, string | number | boolean>;
  headers?: HeadersInit;
  authenticated?: boolean;
};

export type ApiClientConfig = {
  baseURL: string;
  getAccessToken: () => Promise<string>;
};
