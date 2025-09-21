'use client';

import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { loadVariables, saveVariables } from '@services/local-storage.service';
import { AddItem, Record } from '@components';
import { setVariables } from '@states/variablesSlice';

export const Variables: FC = () => {
  const variables = useAppSelector((state) => state.variables.value);
  const user = useAppSelector((state) => state.ui.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      const stored = loadVariables(user);
      if (stored) {
        dispatch(setVariables(stored));
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      saveVariables(user, variables);
    }
  }, [variables]);

  const handleVariableUpdate = (
    baseName: string,
    newName: string,
    value: string
  ) => {
    let localVariables = { ...variables };
    if (baseName === newName) {
      localVariables[baseName] = value;
    } else {
      localVariables = Object.fromEntries(
        Object.entries(variables).filter(([key]) => key !== baseName)
      );
      localVariables[newName] = value;
    }
    dispatch(setVariables(localVariables));
  };

  const handleVariableDelete = (name: string) => {
    const localVariables = Object.fromEntries(
      Object.entries(variables).filter(([key]) => key !== name)
    );
    dispatch(setVariables(localVariables));
  };

  const handleVariableAdd = (name: string, value: string) => {
    const localVariables = { ...variables };
    localVariables[name] = value;
    dispatch(setVariables(localVariables));
  };

  return (
    <div className="w-screen max-w-[600px] flex flex-col justify-start h-full min-h-[calc(100vh-116px)] py-6">
      <h1 className="text-2xl font-bold text-gray-800">Variables</h1>
      <AddItem addHandlerAction={handleVariableAdd} />
      <div className=" flex flex-col gap-2.5 scroll-thin border-4 border-violet-700 rounded-sm p-6 max-h-[calc(100%-60px)] overflow-auto">
        {variables &&
          Object.entries(variables).map(([name, value]) => (
            <Record
              key={name}
              name={name}
              value={value}
              saveHandlerAction={handleVariableUpdate}
              deleteHandlerAction={handleVariableDelete}
            />
          ))}
      </div>
    </div>
  );
};
