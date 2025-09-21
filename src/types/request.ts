export type RequestType = {
  method: string;
  url?: string;
  body?: string;
  headers?: Record<string, string>;
};
