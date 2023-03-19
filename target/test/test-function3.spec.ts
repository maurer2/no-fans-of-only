import {describe, expect, test} from 'vitest';

import testFunction from '../test-function';

describe('test function', () => {
  test('test function', () => {
    expect(testFunction(5)).toBe(5);
  });

  test('test function', () => {
    expect(true).toBe(false);
  });
});
