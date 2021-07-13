# Prisma Binary Downloader (WIP)

Cheat postinstall and download binaries whenever you want.


## Usage


### 1. Cheat the postinstall


> [pnpm|yarn] add -D prisma-dl

#### pnpm

```json
{
  "pnpm": {
    "overrides": {
      "@prisma/engines": "prisma-dl"
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

### 2. Download binaries

```
> pnpm prisma-dl --engine fmt
```

prisma-dl --help

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

- [ ] Find a way to skip the `node_modules/prisma/engiens/[hash]/[binaryType]-engine-[platform]` copy
- [ ] TypeScript // not really necessary ?

## License

MIT
