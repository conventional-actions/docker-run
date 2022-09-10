import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getConfig} from './config'

async function run(): Promise<void> {
  try {
    const config = await getConfig()
    core.debug(JSON.stringify(config))

    let args: string[] = [
      'run',
      '-v',
      '/var/run/docker.sock:/var/run/docker.sock'
    ]

    if (config.options) {
      args = args.concat(config.options)
    }

    if (config.network) {
      args = args.concat('--network', config.network)
    }

    if (config.shell || config.entrypoint) {
      args = args.concat('--entrypoint', config.shell || config.entrypoint)
    }

    args = args.concat(config.image)

    if (config.run) {
      args = args.concat('-c', config.run)
    } else if (config.command) {
      args = args.concat(config.command)
    }

    await exec.exec('docker', args)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
