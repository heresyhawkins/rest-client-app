export type RequestData = {
  latency: number;
  status: number;
  timestamp: string | number;
  method: string;
  requestSize: number;
  responseSize: number;
  errorType?: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
};
