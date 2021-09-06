const path = require('path')

function getEnginesPath() {
  return path.join(
    process.cwd(),
    process.env.PRISMA_BINARIES_PATH || 'binaries'
  )
}

// TODO: support libquery-engine
function getCliQueryEngineBinaryType() {
  return 'query-engine'
}

function passThrough() {}

exports.download = passThrough
exports.ensureBinariesExist = passThrough
exports.getEnginesPath = getEnginesPath
exports.getCliQueryEngineBinaryType = getCliQueryEngineBinaryType
