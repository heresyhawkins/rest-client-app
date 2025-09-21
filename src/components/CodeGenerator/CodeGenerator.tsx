'use client';

import { ChangeEvent, FC, useRef, useState } from 'react';
import { SupportedLanguages, RequestType } from '@types';
import { generateCode } from '@utils/generateCode';
import { supportedLanguages } from '@data/supported-languages';
import { ButtonCopy } from '@components';
import { useAppSelector } from '../../hooks/useAppStore';
import { interpolateRequest } from '@utils/interpolateVariables';

export const CodeGenerator: FC<{ request: RequestType }> = ({ request }) => {
  const [language, setLanguage] = useState<SupportedLanguages>('curl');
  const variables = useAppSelector((state) => state.variables.value);
  const ref = useRef<HTMLPreElement>(null);
  const handleUpdate = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguages);
  };
  const handleCopy = async () => {
    if (ref.current) {
      await navigator.clipboard.writeText(ref.current.textContent ?? '');
    }
  };

  return (
    <div className="flex flex-col self-stretch gap-2.5 items-start py-6 w-[300px]">
      <div className="flex justify-between items-center w-full">
        <select
          className="block border-1 rounded-sm border-violet-700 p-0.5 bg-violet-50 text-violet-950 focus:border-violet-700 cursor-pointer focus:outline-0"
          onChange={handleUpdate}
          value={language}
          name="language"
        >
          {supportedLanguages.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ButtonCopy action={handleCopy} />
      </div>
      <pre
        ref={ref}
        className="text-sm p-2 border-1 border-violet-700 rounded-sm whitespace-pre-wrap break-words h-full max-h-[411px] scroll-thin overflow-auto w-full"
      >
        {generateCode(language, interpolateRequest(request, variables ?? {}))}
      </pre>
    </div>
  );
};
