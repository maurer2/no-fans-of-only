/* eslint-disable no-console */
import {promises as fs2} from 'node:fs';
import path from 'node:path';

import * as core from '@actions/core';
import klaw from 'klaw';

import type {FileCheckResult} from './types/filesystem';
import {isFulfilledPromise} from './constants/typeguards';

const defaultTestRegex = new RegExp('(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$');
const targetFolder = path.resolve(__dirname, '../target');

async function run(): Promise<void> {
  try {
    core.debug(`meow`);

    const filePaths: string[] = [];
    for await (const file of klaw('./target')) {
      if (file.stats.isFile() && defaultTestRegex.test(path.basename(file.path))) {
        filePaths.push(path.relative(targetFolder, file.path));
      }
    }
    console.table(filePaths);

    const fileChecks: Promise<FileCheckResult>[] = filePaths.map(async filePath => {
      try {
        const fileContent: Buffer = await fs2.readFile(`${targetFolder}/${filePath}`);
        let result: FileCheckResult = {
          path: filePath,
          isMatching: false
        };

        if (fileContent.includes('.only')) {
          result = {
            ...result,
            isMatching: true
          };
        }
        return result;
      } catch (error) {
        console.log(error);
        return {
          path: filePath,
          isMatching: false
        } satisfies FileCheckResult;
      }
    });

    const fileCheckingResults = await Promise.allSettled(fileChecks);
    const fileCheckingResultsSuccess = fileCheckingResults.filter(isFulfilledPromise);

    const hasTestWithOnly = fileCheckingResultsSuccess.some(
      fileCheck => fileCheck.value.isMatching
    );
    if (hasTestWithOnly) {
      throw new Error('tests with "only" found');
    }
    core.debug('no tests with "only" found');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
      return;
    }
    core.setFailed('error');
  } finally {
    core.debug('done');
  }
}

run();
