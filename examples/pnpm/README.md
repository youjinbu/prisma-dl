```
$ pnpm i
```

check the `node_modules`

```
$ du -sh node_modules
$ # ~11M instead of >100M (mostly prisma binaries)
```

fetch whatever engine you like.

```
$ pnpm prisma-dl --engine fmt
```
