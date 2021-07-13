const path = require('path')

function getEnginesPath() {
  return path.join(process.cwd(), process.env.PRISMA_BINARIES_PATH)
}

function passThrough() {}

exports.download = passThrough
exports.ensureBinariesExist = passThrough
exports.getEnginesPath = getEnginesPath
