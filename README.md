[![npm version](https://badge.fury.io/js/prisma-dl.svg)](https://www.npmjs.com/package/prisma-dl)
![CI](https://github.com/youjinbu/prisma-dl/workflows/ci/badge.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg?maxAge=2592000)]()

**Prisma Binary Downloader** [WIP]

**NO** more automatic downloads of huge binaries. ([examples](/examples))

## Usage

> Make sure wget chmod gzip are installed.

### Overrides/Resolutions

for cheating the postinstall in prisma, we need to override `@prisma/engines` package to `prisma-dl` via package manager like pnpm or yarn.

<details>
  <summary>pnpm</summary>

```json
{
  "pnpm": {
    "overrides": {
      "@prisma/engines": "npm:prisma-dl@latest"
    }
  }
}
```
</details>

<details>
  <summary>yarn</summary>

```json
{
  "resolutions": {
    "@prisma/engines": "prisma-dl tgz url"
  }
}
```
</details>

### Installation

- https://www.prisma.io/docs/getting-started
- `prisma-dl` needs `@prisma/client` to detect binaries version
- `[package manager] add @prisma/client`
- `[package manager] add -D prisma-dl prisma`


### Download binaries

With this package installed, we will need to download the appropriate binary manually:

```
$ pnpm prisma-dl --engine query
$ pnpm prisma-dl --engine fmt
```

<details>
<summary>prisma-dl --help</summary>

```
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
```
</details>

## TODO

- [ ] Find a way to skip the `node_modules/prisma/engiens/[hash]/query-engine-darwin` copy
- [ ] Examples
- [ ] Tests

## License

MIT (not sure, correct me)
