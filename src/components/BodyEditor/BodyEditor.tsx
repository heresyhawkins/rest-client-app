'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
  isJson: boolean;
  onModeChange: (isJson: boolean) => void;
}

export function BodyEditor({
  value,
  onChange,
  isJson,
  onModeChange,
}: BodyEditorProps) {
  const t = useTranslations('RestClient');

  const [error, setError] = useState<string | null>(null);

  const handlePrettify = () => {
    if (!isJson) return;

    const trimmed = value.trim();
    if (!trimmed) {
      setError('Body is empty');
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      onChange(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(`Invalid JSON format ${e}`);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('body')}
      </label>

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => onModeChange(true)}
          className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
            isJson
              ? 'bg-violet-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => onModeChange(false)}
          className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
            !isJson
              ? 'bg-violet-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
          }`}
        >
          {t('textButton')}
        </button>
        <button
          type="button"
          onClick={handlePrettify}
          className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 cursor-pointer transition-all duration-300"
        >
          {t('prettify')}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('text')}
        className="w-full px-3 py-2 border border-violet-700 rounded h-32 resize-none font-mono text-sm"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
