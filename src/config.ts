import {parseMultiInput} from '@conventional-actions/toolkit'
import * as core from '@actions/core'
import {parse} from 'shell-quote'

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
  const options = core.getInput('options')
  let shell = core.getInput('shell')

  if (run && run.length && !shell) {
    shell = 'sh'
  }

  if (run && command) {
    throw Error('cannot specify both run and command')
  }

  if (entrypoint && shell) {
    throw Error('cannot specify both entrypoint and shell')
  }

  return {
    image,
    options: parse(options).map(x => x.toString()),
    entrypoint,
    command,
    run,
    shell,
    network
  }
}
