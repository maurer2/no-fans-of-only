/* eslint-disable no-only-tests/no-only-tests */
import {describe, expect, test} from 'vitest';

import testFunction from './test-function';

describe.only('test function', () => {
  test.only('test function', () => {
    expect(testFunction(5)).toBe(5);
  });

  test.skip('test function', () => {
    expect(true).toBe(false);
  });
});
