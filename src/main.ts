/* eslint-disable no-console */
// import fs from 'node:fs';
import path from 'node:path';

import core from '@actions/core';
import klaw from 'klaw';

const defaultTestRegex = new RegExp('(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$');

async function run(): Promise<void> {
  try {
    // core.debug(`meow1`);

    // const fileNames = fs
    //   .readdirSync(path.resolve(__dirname, '../target'), {withFileTypes: true})
    //   .filter(item => item.isFile() && item.name.match(defaultTestRegex))
    //   .map(item => item.name);

    const filePaths: string[] = [];
    for await (const file of klaw('./target')) {
      if (file.stats.isFile() && defaultTestRegex.test(path.basename(file.path))) {
        const pathRelativeToTarget = path.resolve(__dirname, '../target');

        filePaths.push(path.relative(pathRelativeToTarget, file.path));
      }
    }
    console.table(filePaths);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  } finally {
    console.log('done');
  }
}

run();
