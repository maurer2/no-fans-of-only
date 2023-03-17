import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    console.log('meow 2')
    setOutput('type', 'meow 3')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
