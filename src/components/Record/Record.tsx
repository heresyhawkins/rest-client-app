'use client';

import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { GoTrash } from 'react-icons/go';
import { MdModeEdit } from 'react-icons/md';
import { GrCheckmark } from 'react-icons/gr';

type RecordProperties = {
  name: string;
  value: string;
  saveHandlerAction: (baseName: string, newName: string, value: string) => void;
  deleteHandlerAction: (name: string) => void;
};

export const Record: FC<RecordProperties> = ({
  name,
  value,
  saveHandlerAction,
  deleteHandlerAction,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [nameLocal, setNameLocal] = useState(name);
  const [valueLocal, setValueLocal] = useState(value);
  const t = useTranslations('VariablesPage');
  const ref = useRef<HTMLInputElement>(null);
  const nameId = `name-${name}`;
  const valueId = `value-${value}`;
  const inputClasses = `border-1 ${
    editMode
      ? 'border-violet-700 text-violet-950'
      : 'border-gray-300 bg-gray-50 text-gray-700'
  } rounded-sm px-1 focus:outline-1
    focus:bg-violet-100 focus:outline-violet-700 transition-all duration-300`;

  useEffect(() => {
    if (editMode && ref.current) {
      ref.current.focus();
    }
  }, [editMode]);

  useEffect(() => {
    setNameLocal(name);
  }, [name]);

  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  const handleChange = (field: 'name' | 'value') => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      if (field === 'name') {
        setNameLocal(e.target.value);
      } else {
        setValueLocal(e.target.value);
      }
    };
  };

  return (
    <div className="flex gap-1 text-violet-950 border-2 border-violet-700 rounded-sm p-4">
      <label className="cursor-pointer" htmlFor={nameId}>
        {t('name')}
      </label>
      <input
        ref={ref}
        className={inputClasses}
        id={nameId}
        type="text"
        disabled={!editMode}
        value={nameLocal}
        onChange={handleChange('name')}
      />
      <label className="cursor-pointer" htmlFor={valueId}>
        {t('value')}
      </label>
      <input
        className={inputClasses}
        id={valueId}
        type="text"
        disabled={!editMode}
        value={valueLocal}
        onChange={handleChange('value')}
      />
      <button
        data-testid={`${editMode ? 'accept' : 'edit-mode'}-btn-${name}`}
        className="cursor-pointer hover:scale-110"
        onClick={() => {
          setEditMode(!editMode);
          saveHandlerAction(name, nameLocal, valueLocal);
        }}
      >
        {editMode ? <GrCheckmark /> : <MdModeEdit />}
      </button>
      <button
        data-testid={`delete-btn-${name}`}
        className="cursor-pointer hover:scale-110"
        onClick={() => deleteHandlerAction(name)}
      >
        <GoTrash />
      </button>
    </div>
  );
};
