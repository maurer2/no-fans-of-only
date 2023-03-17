import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    core.debug(`meow1`);
    // eslint-disable-next-line no-console
    console.log(`meow2`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
