import { RequestData } from '@types';

export const emptyRequestData: RequestData = {
  latency: 0,
  status: 0,
  timestamp: '',
  method: '',
  requestSize: 0,
  responseSize: 0,
  url: '',
  headers: {},
  body: '',
};
