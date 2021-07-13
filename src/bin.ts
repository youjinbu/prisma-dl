#!/usr/bin/env node

import {download} from './download'

download(process.argv.slice(2)).catch((err) => {
  console.error(err.stack)
  process.exit(1)
})
