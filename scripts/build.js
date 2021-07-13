const esbuild = require('esbuild')

function main() {
  esbuild.buildSync({
    entryPoints: ['src/bin.js'],
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
