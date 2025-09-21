'use client';

import { loadRequestData } from 'services/firebase.service';
import { getCookie } from '@actions/auth-actions';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { convertRequestToUrl } from '@utils/requestUrlConverter';
import { RequestData } from '@types';
import { routesList } from '@data/routes-list';
import { useLocale } from 'next-intl';
import { useAppDispatch } from '../../hooks/useAppStore';
import { setToastValue } from '@states/toastSlice';
import { methods } from '@data/supported-methods';

export function RequestList() {
  const t = useTranslations('History');
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      try {
        const userId = await getCookie('userUid');
        if (!userId) {
          setRequests([]);
          setLoading(false);
          return;
        }

        const rawData = await loadRequestData(userId);

        if (!Array.isArray(rawData)) {
          setRequests([]);
          setLoading(false);
          return;
        }

        const validRequests = rawData
          .map((req): RequestData | null => {
            if (
              typeof req !== 'object' ||
              req === null ||
              !req.method ||
              !req.url
            ) {
              return null;
            }

            return {
              ...req,
              timestamp: req.timestamp || Date.now(),
              errorType: req.errorType ?? null,
              headers: req.headers || {},
              body: req.body || '',
            } as RequestData;
          })

          .filter((req): req is RequestData => req !== null)
          .sort((a, b) => {
            const timeA =
              typeof a.timestamp === 'string'
                ? new Date(a.timestamp).getTime()
                : (a.timestamp ?? 0);

            const timeB =
              typeof b.timestamp === 'string'
                ? new Date(b.timestamp).getTime()
                : (b.timestamp ?? 0);

            return timeB - timeA;
          });

        setRequests(validRequests);
      } catch (_error) {
        dispatch(
          setToastValue({
            type: 'error',
            message: t('failedToLoadHistory'),
          })
        );
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dispatch]);

  if (loading) {
    return <p className="text-center p-4">Loading request history...</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="p-4 bg-violet-100 rounded overflow-auto w-full text-sm whitespace-pre-wrap max-h-[50vh] text-violet-950">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t('noRequests')}</h1>
          <p className="mb-6">{t('tryRestClient')}</p>
          <Link
            href={`/${locale}/${routesList.client}/${methods.GET}`}
            className="inline-block px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded transition-colors"
          >
            {t('restClient')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-violet-950">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('history')}</h1>
        <ul className="space-y-2 p-4 rounded overflow-auto text-sm whitespace-pre-wrap max-h-[70vh] border border-violet-700">
          {requests.map((req, i) => {
            const isFailed = req.status >= 400 || req.errorType;

            const pathSuffix = convertRequestToUrl(req);
            const href = `/${locale}/${routesList.client}/${req.method}${pathSuffix}`;

            const date =
              typeof req.timestamp === 'string'
                ? new Date(req.timestamp)
                : new Date(req.timestamp ?? Date.now());

            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();

            return (
              <li key={i}>
                <Link
                  href={href}
                  className="block p-3 bg-violet-100 rounded hover:bg-violet-200 transition-colors cursor-pointer"
                >
                  <div className="font-mono text-sm mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs mr-2 font-semibold ${
                        req.method === 'GET'
                          ? 'bg-green-200 text-green-800'
                          : req.method === 'POST'
                            ? 'bg-blue-200 text-blue-800'
                            : req.method === 'PUT'
                              ? 'bg-yellow-200 text-yellow-800'
                              : req.method === 'DELETE'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {req.method}
                    </span>
                    <span className="text-gray-800 truncate max-w-xs inline-block align-middle">
                      {req.url}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-700">
                    <span>
                      <strong>{t('status')}:</strong>{' '}
                      <span
                        className={
                          isFailed
                            ? 'text-red-600'
                            : req.status < 300
                              ? 'text-green-600'
                              : 'text-yellow-600'
                        }
                      >
                        {req.status}
                      </span>
                    </span>
                    <span>
                      <strong>{t('latency')}:</strong> {req.latency} ms
                    </span>

                    <span>
                      <strong>{t('requestSize')}:</strong>{' '}
                      {(req.requestSize / 1024).toFixed(1)} KB
                    </span>
                    <span>
                      <strong>{t('responseSize')}:</strong>{' '}
                      {(req.responseSize / 1024).toFixed(1)} KB
                    </span>

                    <span>
                      <strong>{t('date')}:</strong> {formattedDate}
                    </span>
                    <span>
                      <strong>{t('time')}:</strong> {formattedTime}
                    </span>
                  </div>

                  {req.errorType && (
                    <div className="text-xs text-red-600 mt-1 font-mono italic">
                      {t('error')}: {req.errorType}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
