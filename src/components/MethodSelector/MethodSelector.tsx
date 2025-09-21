import { useTranslations } from 'next-intl';

interface MethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const t = useTranslations('RestClient');

  return (
    <div>
      <label className="block mb-1 font-medium text-violet-950">
        {t('method')}
      </label>
      <div className="flex gap-2">
        {methods.map((m) => (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={`px-3 py-1 rounded border transition-all duration-300 cursor-pointer ${
              value === m
                ? 'bg-violet-500 text-white border-violet-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
