'use client';

import { FC, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  EndpointInput,
  HeadersEditor,
  BodyEditor,
  ResponseViewer,
  CodeGenerator,
  MethodSelector,
} from '@components';
import { useTranslations } from 'next-intl';
import { processRequest } from '@actions/request-actions';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { setToastValue } from '@states/toastSlice';
import { decodeBase64, parseQuery } from '@utils/urlEncoding';
import { useRouter } from '@i18n/navigation';
import {
  addHeader,
  clearResponse,
  setBody,
  setEndpoint,
  setHeaders,
  setIsJson,
  setMethod,
  setResponse,
} from '@states/restClientSlice';
import { buildRestUrl } from '@utils/buildRestUrl';
import { APIResponse } from '@types';
import {
  interpolatePlainObject,
  interpolateString,
} from '@utils/interpolateVariables';

export const RestClient: FC = () => {
  const t = useTranslations('RestClient');
  const tMessages = useTranslations('Messages');
  const params = useParams<{ method?: string; requestpart?: string[] }>();
  const searchParams = useSearchParams();
  const initialMethod = params?.method?.toUpperCase() || 'GET';
  const [urlBase64, bodyBase64] = params?.requestpart ?? [];
  const url = urlBase64 ? decodeBase64(urlBase64) : '';
  const initialBody = bodyBase64 ? decodeBase64(bodyBase64) : '';
  const initialHeaders = useMemo(
    () => parseQuery(searchParams.toString()),
    [searchParams]
  );
  const dispatch = useAppDispatch();
  const variables = useAppSelector((state) => state.variables.value);
  const router = useRouter();
  const { method, endpoint, headers, body, isJson, response, isLoading } =
    useAppSelector((state) => state.restClient);

  useEffect(() => {
    dispatch(setMethod(initialMethod));
    if (url.length > 0) {
      dispatch(setEndpoint(url));
    }
    if (initialBody.length > 0) {
      dispatch(setBody(initialBody));
    }

    if (Object.keys(initialHeaders).length > 0) {
      dispatch(setHeaders(initialHeaders));
    }
  }, [initialMethod, url, initialBody, initialHeaders, dispatch]);

  const handleMethodChange = (newMethod: string) => {
    dispatch(setMethod(newMethod));
    dispatch(clearResponse());
    const url = buildRestUrl({ method: newMethod, url: '' });
    router.replace(url);
  };

  const interpolateRequestParameters = useMemo(() => {
    return {
      method: interpolateString(method, variables),
      body: interpolateString(body, variables),
      headers: interpolatePlainObject(headers, variables),
      url: interpolateString(endpoint, variables),
    };
  }, [method, body, headers, endpoint]);

  const handleSubmit = async () => {
    const res = await processRequest(interpolateRequestParameters);

    if (res.result === 'success') {
      const result: APIResponse =
        res.status && res.status < 400
          ? {
              status: res.status ?? 200,
              data: res.body ?? '',
            }
          : {
              status: res.status ?? 404,
              data: '',
              error: res.body,
            };
      dispatch(setResponse(result));
      dispatch(
        setToastValue({
          type: 'success',
          message: tMessages('requestSuccess'),
        })
      );
    } else {
      dispatch(
        setToastValue({
          type: 'error',
          message: tMessages('requestError', { error: String(res.error) }),
        })
      );
    }

    const newUrl = buildRestUrl(interpolateRequestParameters);
    router.replace(newUrl);
  };

  const isValidUrl = (string: string): boolean => {
    try {
      const interpolatedUrl = interpolateString(string, variables);
      new URL(interpolatedUrl);
      return !/{{\w*}}/.test(interpolatedUrl);
    } catch {
      return false;
    }
  };

  const isBodyValid =
    (!isJson ||
      body === '' ||
      (() => {
        try {
          if (!body.trim()) return true;
          JSON.parse(body);
          return true;
        } catch {
          return false;
        }
      })()) &&
    !/{{\w*}}/.test(interpolateString(body, variables));

  const isHeadersValid =
    Object.keys(interpolatePlainObject(headers, variables)).length ===
    Object.keys(headers).length;

  const isEndpointValid = !endpoint || isValidUrl(endpoint);
  const canSend =
    !!endpoint && isEndpointValid && isBodyValid && isHeadersValid;

  return (
    <div className="p-6 max-w-4xl space-y-6 self-start">
      <h1 className="text-2xl font-bold text-violet-950">{t('title')}</h1>
      <div className="flex justify-between gap-6 w-full">
        <div className="w-[500px]">
          <MethodSelector value={method} onChange={handleMethodChange} />

          <div>
            <EndpointInput
              value={endpoint}
              onChange={(val) => dispatch(setEndpoint(val))}
              isValid={isValidUrl(endpoint)}
            />
          </div>

          <HeadersEditor
            headers={headers}
            onAdd={(k, v) => dispatch(addHeader({ [k]: v }))}
            isValid={isHeadersValid}
          />

          <BodyEditor
            value={body}
            onChange={(val) => dispatch(setBody(val))}
            isJson={isJson}
            onModeChange={(val) => dispatch(setIsJson(val))}
          />

          {!isBodyValid && isJson && body && (
            <p className="text-red-500 text-sm">{t('invalidJson')}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSend || isLoading}
            className={`px-4 py-2 rounded transition-colors ${
              !canSend || isLoading
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-violet-500 hover:bg-violet-600 text-white cursor-pointer'
            }`}
          >
            {isLoading ? '...' : t('sendRequest')}
          </button>

          {Object.keys(response).length > 0 ? (
            <div className="mt-6 p-4 border border-violet-700 rounded bg-violet-50">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                {t('response')}
              </h2>
              <ResponseViewer data={response} />
            </div>
          ) : undefined}
        </div>
        <CodeGenerator
          request={{
            method,
            url: endpoint,
            headers,
            body,
          }}
        />
      </div>
    </div>
  );
};
