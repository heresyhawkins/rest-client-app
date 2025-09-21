import { describe, it, expect } from 'vitest';
import {
  interpolatePlainObject,
  interpolateRequest,
  interpolateString,
} from '@utils/interpolateVariables';

describe('replaceVariable function tests', () => {
  it('Should replace variables with variable values', () => {
    const value = 'some {{var1}} with {{var2}}';
    const variables = {
      var1: 'string',
      var2: 'variables',
    };

    expect(interpolateString(value, variables)).toBe(
      'some string with variables'
    );
  });

  it('Should replace variables with multiple appearance', () => {
    const value =
      'some {{var1}} with {{var2}} and it has multiple {{var2}} appearance';
    const variables = {
      var1: 'string',
      var2: 'variables',
    };

    expect(interpolateString(value, variables)).toBe(
      'some string with variables and it has multiple variables appearance'
    );
  });

  it('Should return string with not replaced variables if no variable values were provided', () => {
    const value =
      'some {{var1}} with {{var2}} and it has multiple {{var3}} appearance';
    const variables = {
      var1: 'string',
      var2: 'variables',
    };

    expect(interpolateString(value, variables)).toBe(
      'some string with variables and it has multiple {{var3}} appearance'
    );
  });

  it('Should return interpolated object with replacements', () => {
    const value = {
      '{{var1}}': 'value {{var2}}',
      '{{var3}}': 'value {{var4}}',
    };
    const variables = {
      var1: 'property1',
      var2: 'value1',
      var3: 'property3',
      var4: 'value4',
    };

    expect(interpolatePlainObject(value, variables)).toEqual({
      property1: 'value value1',
      property3: 'value value4',
    });
  });

  it('Should return interpolated object without properties if no variable values provided for the properties', () => {
    const value = {
      '{{var1}}': 'value {{var2}}',
      '{{var3}}': 'value {{var4}}',
    };
    const variables = {
      var1: 'property1',
      var2: 'value1',
      var3: 'property3',
      var5: 'value4',
    };

    expect(interpolatePlainObject(value, variables)).toEqual({
      property1: 'value value1',
    });
  });

  it('Should return interpolated requestType object', () => {
    const value = {
      method: 'GET',
      url: '{{url}}',
      body: '{"testId": "{{testId}}", "{{userId}}": "45"}',
      headers: {
        'Content-Type': '{{json}}',
        '{{Auth}}': '{{token}}',
      },
    };
    const variables = {
      url: 'http://localhost:8080',
      testId: '135',
      userId: 'uuid',
      json: 'application/json',
      Auth: 'Bearer',
      token: 'Bearer',
    };

    expect(interpolateRequest(value, variables)).toEqual({
      method: 'GET',
      url: 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json',
        Bearer: 'Bearer',
      },
      body: '{"testId": "135", "uuid": "45"}',
    });
  });
});
