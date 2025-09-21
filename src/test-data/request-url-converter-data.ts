import { ReadonlyURLSearchParams } from 'next/navigation';

export const urlFull =
  '/aHR0cDovL2xvY2FsaG9zdDo4MDgw/' +
  'ewogICJ0ZXh0IjogInRleHQiLAogICJvYmplY3QiOiB7CiAgICAicHJvcDEiOiAicHJvcDEiLAo' +
  'gICAgInByb3AyIjogInByb3AyIgogIH0KfQ' +
  '?Content-Type=application%2Fjson&Accept=application%2Fjson';

export const urlMethodOnly = '';

export const requestFull = {
  method: 'GET',
  url: 'http://localhost:8080',
  body:
    '{\n' +
    '  "text": "text",\n' +
    '  "object": {\n' +
    '    "prop1": "prop1",\n' +
    '    "prop2": "prop2"\n' +
    '  }\n' +
    '}',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const requestMethodOnly = {
  method: 'GET',
};

export const paramsFull = {
  method: 'GET',
  requestpart: [
    'aHR0cDovL2xvY2FsaG9zdDo4MDgw',
    'ewogICJ0ZXh0IjogInRleHQiLAogICJvYmplY3QiOiB7CiAgICAicHJvcDEiOiAicHJvcDEiLAogICAgInByb3AyIjogInByb3AyIgogIH0KfQ',
  ],
};

export const searchParams = new URLSearchParams({
  'Content-Type': 'application/json',
  Accept: 'application/json',
}) as unknown as ReadonlyURLSearchParams;
