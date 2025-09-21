'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface HeadersEditorProps {
  headers: Record<string, string>;
  onAdd: (key: string, value: string) => void;
  isValid: boolean;
}

export function HeadersEditor({ headers, onAdd, isValid }: HeadersEditorProps) {
  const t = useTranslations('RestClient');

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (key.trim() && value.trim()) {
      onAdd(key, value);
      setKey('');
      setValue('');
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-1 font-medium">{t('headers')}</label>
      <div className="flex flex-col gap-2 w-ful">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1 px-3 py-2 border border-violet-700 rounded focus:outline-none focus:border-violet-700 w-[40%]"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-violet-700 rounded focus:outline-none focus:border-violet-700 w-[40%]"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 cursor-pointer transition-all duration-300"
          >
            {t('button')}
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {Object.entries(headers).map(([key, value]) => (
            <li
              key={key}
              className="flex justify-between items-center bg-violet-100 p-2 rounded"
            >
              <span>{key}</span>
              <span className="font-mono">{value}</span>
            </li>
          ))}
        </ul>
        {!isValid && (
          <p className="text-red-500 text-xs"> {t('headersError')}</p>
        )}
      </div>
    </div>
  );
}
