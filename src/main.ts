/* eslint-disable no-console */
import {promises as fs2} from 'node:fs';
import path from 'node:path';

import core from '@actions/core';
import klaw from 'klaw';

type FileCheckResult = [filePath: string, haMatch: boolean];

const defaultTestRegex = new RegExp('(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$');
const targetFolder = path.resolve(__dirname, '../target');

async function run(): Promise<void> {
  try {
    // core.debug(`meow1`);

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

        if (fileContent.includes('.only')) {
          return [filePath, true] satisfies FileCheckResult;
        }
        return [filePath, false] satisfies FileCheckResult;
      } catch (error) {
        console.log(error);
        return [filePath, false] satisfies FileCheckResult;
      }
    });

    const fileCheckingResults = await Promise.allSettled(fileChecks);
    const fileCheckingResultsSuccess: PromiseFulfilledResult<FileCheckResult>[] =
      fileCheckingResults.filter(
        ({status}) => status === 'fulfilled'
      ) as unknown as PromiseFulfilledResult<FileCheckResult>[]; // dirty

    const hasTestsWithOnly = fileCheckingResultsSuccess.some(fileCheck =>
      Boolean(fileCheck.value[1])
    );
    console.log('has tests with only', hasTestsWithOnly);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
      console.log(error);
    }
  } finally {
    console.log('done');
  }
}

run();
