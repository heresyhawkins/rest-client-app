'use client';

import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

type AddItemProperties = {
  addHandlerAction: (name: string, value: string) => void;
};

export const AddItem: FC<AddItemProperties> = ({ addHandlerAction }) => {
  const t = useTranslations('VariablesPage');
  const ref = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const inputClasses = `border-2 border-violet-700 text-violet-950 rounded-sm 
  px-1 focus:outline-1 focus:bg-violet-100 focus:outline-violet-700 transition-all duration-300 w-[30%]`;

  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, []);

  const handleChange = (field: 'name' | 'value') => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      if (field === 'name') {
        setName(e.target.value);
      } else {
        setValue(e.target.value);
      }
    };
  };

  return (
    <div className="flex items-center gap-2.5 text-violet-950 p-4 w-full">
      <label className="cursor-pointer" htmlFor="item-name">
        {t('name')}
      </label>
      <input
        ref={ref}
        className={inputClasses}
        id="item-name"
        type="text"
        value={name}
        onChange={handleChange('name')}
      />
      <label className="cursor-pointer" htmlFor="item-value">
        {t('value')}
      </label>
      <input
        className={inputClasses}
        id="item-value"
        type="text"
        value={value}
        onChange={handleChange('value')}
      />
      <button
        data-testid="add-btn"
        className="cursor-pointer hover:scale-110 px-3 py-0.5 rounded bg-violet-600 hover:bg-violet-500 transition-all duration-300 text-white"
        onClick={() => {
          if (name.length > 0 && value.length > 0) {
            addHandlerAction(name, value);
            setName('');
            setValue('');
          }
        }}
      >
        {t('add')}
      </button>
    </div>
  );
};
