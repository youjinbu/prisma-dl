# prisma-dl (WIP)

Prisma Binary Downloader

**NO** more automatic downloads of huge binaries.

[examples](/examples)

## Usage

### Install Prisma

> https://www.prisma.io/docs/getting-started

### Cheat the postinstall

#### prepare

- install
```
$ pnpm add -D prisma-dl
# or
$ yarn add -D prisma-dl
```

- env
```
PRISMA_BINARIES_PATH=./binaries
```

#### pnpm

```json
{
  "pnpm": {
    "overrides": {
      "@prisma/engines": "npm:prisma-dl@latest"
    }
  }
}
```

#### yarn

```json
{
  "resolutions": {
    "@prisma/engines": "prisma-dl tgz url"
  }
}
```

### Download binaries

```
> pnpm prisma-dl --engine fmt
```

> prisma-dl --help

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

## TODO

- [ ] Find a way to skip the `node_modules/prisma/engiens/[hash]/query-engine-darwin` copy
- [ ] Examples
- [ ] Tests

## License

MIT
