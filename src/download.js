const fs = require('fs')
const {join} = require('path')
const assert = require('assert')
const {spawnSync} = require('child_process')
const {platforms, getPlatform} = require('@prisma/get-platform')
const {genArg} = require('./arg')

const baseUrl = process.env.PRISMA_BINARIES_MIRROR || 'https://binaries.prisma.sh'
function binaryUrl(hash, platform, binaryType) {
  return `${baseUrl}/master/${hash}/${platform}/${binaryType}.gz`
}

function run(command, options) {
  spawnSync(command, options, {stdio: 'inherit'})
}

function fetchBinary({url, out: outGz}) {
  // prepare
  fs.mkdirSync(outGz.split('/').slice(0, -1).join('/'), {recursive: true})

  const out = outGz.slice(0, -3) // trim `.gz`
  run('wget', [url, '-O', outGz])
  run('rm', ['-rf', out])
  run('gzip', ['-d', outGz])
  run('chmod', ['+x', out])
}

function getOptions({projectDir, binariesDir, platform, binaryType}) {
  const out = join(process.cwd(), binariesDir, `${binaryType}-${platform}.gz`)

  // prettier-ignore
  const packageJson = join(require.resolve('@prisma/client'), '..', 'package.json')
  const version = require(packageJson).dependencies['@prisma/engines-version']

  // e.g. @prisma/engines-version: 2.27.0-43.cdba6ec525e0213cce26f8e4bb23cf556d1479bb
  const hash = version.split('.').pop()

  return {url: binaryUrl(hash, platform, binaryType), out}
}

const knownPlatforms = ['native', ...platforms]
const engines = ['query', 'fmt', 'migration', 'introspection']

async function download(argv) {
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

  let platform = arg('platform') || 'native'
  if (platform === 'native') {
    platform = await getPlatform()
  }

  assert(
    knownPlatforms.includes(platform),
    'supported platform:\n' + knownPlatforms.join('\n')
  )
  assert(engines.includes(type), 'supported engine:\n' + engines.join('\n'))
  assert(project, '--project is required')

  const options = getOptions({
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

exports.download = download
