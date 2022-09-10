import {parseMultiInput} from '@conventional-actions/toolkit'
import * as core from '@actions/core'
import * as yargs from 'yargs'

type Config = {
  image: string
  options: string[]
  entrypoint: string
  command: string
  run: string
  shell: string
  network: string
}

export async function getConfig(): Promise<Config> {
  const run = parseMultiInput(core.getInput('run')).join('; ')
  const image = core.getInput('image', {required: true})
  const entrypoint = core.getInput('entrypoint')
  const network = core.getInput('network')
  const command = core.getInput('command')
  const opts = (await yargs.parseAsync(core.getInput('options'))) as {
    [key: string]: string | number
  }
  let shell = core.getInput('shell')
  let options: string[] = []

  if (run && run.length && !shell) {
    shell = 'sh'
  }

  if (run && command) {
    throw Error('cannot specify both run and command')
  }

  if (entrypoint && shell) {
    throw Error('cannot specify both entrypoint and shell')
  }

  for (const k in opts) {
    if (k === '_' || k === '$0') {
      continue
    }

    options = options.concat(k)
    options = options.concat(opts[k].toString())
  }

  return {
    image,
    options,
    entrypoint,
    command,
    run,
    shell,
    network
  }
}
