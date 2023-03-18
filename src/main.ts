/* eslint-disable no-console */
import * as core from '@actions/core';
import * as fs from 'node:fs';
import * as path from 'node:path';

const defaultTestRegex = new RegExp('(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$');

async function run(): Promise<void> {
  try {
    // core.debug(`meow1`);

    const fileNames = fs
      .readdirSync(path.resolve(__dirname, '../target'), {withFileTypes: true})
      .filter(item => item.isFile() && item.name.match(defaultTestRegex))
      .map(item => item.name);

    console.log(fileNames);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  } finally {
    console.log('done');
  }
}

run();
