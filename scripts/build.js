const esbuild = require('esbuild')

function main() {
  esbuild.buildSync({
    entryPoints: ['src/bin.ts'],
    outfile: 'bin/dl.js',
    bundle: true,
    platform: 'node',
    target: ['node14'],
    external: ['@prisma/client'],
    minify: true,
    sourcemap: 'inline',
  })
}

main()
