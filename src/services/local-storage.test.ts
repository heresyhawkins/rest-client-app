import { describe, it, expect, beforeEach } from 'vitest';
import { loadVariables, saveVariables } from '@services/local-storage.service';
import { stringToBase64 } from '@utils/stringBase64Converter';

const variablesObject = {
  variable1: 'variable1',
  variable2: 'variable2',
  variable3: 'variable3',
};

const user1 = 'test1@test.test';
const user2 = 'test2@test.test';

describe('Local storage service tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Should return empty object in case user is null', () => {
    expect(loadVariables(null)).toEqual({});
  });

  it('Should return empty object in case no variables in local storage for provided user', () => {
    localStorage.setItem(
      stringToBase64(user1) as string,
      JSON.stringify(variablesObject)
    );

    expect(loadVariables(user2)).toEqual({});
  });

  it('Should return empty object in case wrong variables format in local storage for provided user', () => {
    localStorage.setItem(stringToBase64(user1) as string, '');
    localStorage.setItem(
      stringToBase64(user2) as string,
      'wrong variables format'
    );

    expect(loadVariables(user1)).toEqual({});
    expect(loadVariables(user2)).toEqual({});
  });

  it('Should return variables object for provided user', () => {
    localStorage.setItem(
      stringToBase64(user1) as string,
      JSON.stringify(variablesObject)
    );

    expect(loadVariables(user1)).toEqual(variablesObject);
  });

  it('Should save variables to the local storage', () => {
    saveVariables(user1, variablesObject);
    const user = stringToBase64(user1) as string;

    expect(JSON.parse(localStorage.getItem(user) as string)).toEqual(
      variablesObject
    );
  });
});
