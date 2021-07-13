import type {Platform} from '@prisma/get-platform'

import fs from 'fs'
import {join, resolve} from 'path'
import assert from 'assert'
import {spawnSync} from 'child_process'
import {platforms, getPlatform} from '@prisma/get-platform'
import {genArg} from './arg'

const baseUrl =
  process.env.PRISMA_BINARIES_MIRROR || 'https://binaries.prisma.sh'
function binaryUrl(hash: string, platform: string, binaryType: string) {
  return `${baseUrl}/master/${hash}/${platform}/${binaryType}.gz`
}

function run(command: string, options: string[]) {
  spawnSync(command, options, {stdio: 'inherit'})
}

interface FetchBinaryOptions {
  url: string
  out: string
}

function fetchBinary({url, out: outGz}: FetchBinaryOptions) {
  // prepare
  fs.mkdirSync(outGz.split('/').slice(0, -1).join('/'), {recursive: true})

  const out = outGz.slice(0, -3) // trim `.gz`
  run('wget', [url, '-O', outGz, '--quiet'])
  run('rm', ['-rf', out])
  run('gzip', ['-d', outGz])
  run('chmod', ['+x', out])

  if (!process.env.CI) {
    console.log(out)
  }
}

interface Options {
  binariesDir: string
  binaryType: string
  platform: Platform
  projectDir: string
}

function getFetchOptions(opts: Options): FetchBinaryOptions {
  const {binariesDir, binaryType, platform, projectDir} = opts
  const out = join(resolve(binariesDir), `${binaryType}-${platform}.gz`)

  const prismaClientPath = require.resolve('@prisma/client', {
    paths: [projectDir],
  })
  const packageJson = join(prismaClientPath, '..', 'package.json')
  const version = require(packageJson).dependencies['@prisma/engines-version']

  // e.g. @prisma/engines-version: 2.27.0-43.cdba6ec525e0213cce26f8e4bb23cf556d1479bb
  const hash = version.split('.').pop()

  return {url: binaryUrl(hash, platform, binaryType), out}
}

const knownPlatforms = ['native', ...platforms]
const engines = ['query', 'fmt', 'migration', 'introspection']

export async function download(argv: string[]) {
  const arg = genArg(argv)
  const project = arg('project') || '.'
  const out = arg('out') || join(project, 'binaries')
  const type = arg('engine') || 'query'

  if (argv.includes('-h') || argv.includes('--help')) {
    console.log(`
Simple prisma binary downloader dependent on wget,rm,gzip,chmod

Usage

  $ prisma-dl  [options]

Options

   -h, --help  Display this help message
     --engine  Engine type
               <query|fmt|migration|introspection>
               Defaults to query
   --platform  Engine Platform
               <native|darwin|linux-musl|windows|...>
               Defaults to native
    --project  Project Root
               Defaults to current directory
      --print  Print fetch options without downloading binary
        --out  Output dir
               Defaults to [project root]/binaries
`)
    return
  }

  let platform: Platform = arg<Platform>('platform') || 'native'
  if (platform === 'native') {
    platform = await getPlatform()
  }

  assert(
    knownPlatforms.includes(platform),
    'supported platform:\n' + knownPlatforms.join('\n')
  )
  assert(engines.includes(type), 'supported engine:\n' + engines.join('\n'))
  assert(project, '--project is required')

  const options = getFetchOptions({
    binariesDir: out,
    binaryType: type === 'fmt' ? 'prisma-fmt' : `${type}-engine`,
    platform,
    projectDir: project,
  })

  if (argv.includes('--print')) {
    console.table(options)
  } else {
    fetchBinary(options)
  }
}
