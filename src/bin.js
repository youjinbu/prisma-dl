#!/usr/bin/env node

require('./download')
  .download(process.argv.slice(2))
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
