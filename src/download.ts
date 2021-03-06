import type {Platform} from '@prisma/get-platform'

import fs from 'fs'
import {join, resolve, dirname} from 'path'
import assert from 'assert'
import {execSync, spawnSync} from 'child_process'
import {platforms, getPlatform} from '@prisma/get-platform'
import {genArg} from './arg'

const baseUrl =
  process.env.PRISMA_BINARIES_MIRROR || 'https://binaries.prisma.sh'

function binaryUrl(hash: string, platform: string, binaryType: string) {
  return `${baseUrl}/all_commits/${hash}/${platform}/${binaryType}.gz`
}

function run(command: string, options: string[]) {
  spawnSync(command, options, {stdio: 'inherit'})
}

interface FetchBinaryOptions {
  url: string
  out: string
  v: string
}

async function fetchBinary({url, out: outGz}: FetchBinaryOptions) {
  const binaryPath = outGz.slice(0, -3) // trim `.gz`

  // prepare
  await fs.promises.mkdir(dirname(outGz), {recursive: true})
  await fs.promises.rm(binaryPath, {force: true})

  run('wget', [url, '-O', outGz, '--quiet'])
  run('gzip', ['-d', outGz])

  await fs.promises.chmod(binaryPath, 0o755)

  if (!process.env.CI) {
    console.log(binaryPath)
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

  return {url: binaryUrl(hash, platform, binaryType), out, v: hash}
}

function getVersion(file: string) {
  if (!fs.existsSync(file)) return null

  try {
    return execSync(`${file} -V`).toString().trim().split(' ').pop()
  } catch {
    return null
  }
}

const knownPlatforms = ['native', ...platforms]
const engines = ['query', 'fmt', 'migration', 'introspection']

export async function download(argv: string[]) {
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

  const arg = genArg(argv)
  const project = arg('project') || '.'
  const outDir = arg('out') || join(project, 'binaries')
  const type = arg('engine') || 'query'
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
    binariesDir: outDir,
    binaryType: type === 'fmt' ? 'prisma-fmt' : `${type}-engine`,
    platform,
    projectDir: project,
  })

  if (argv.includes('--print')) {
    console.table(options)
    return
  }

  const outBin = options.out.slice(0, -3)
  if (getVersion(outBin) === options.v) {
    console.log(outBin)
    return
  }

  await fetchBinary(options)
}
