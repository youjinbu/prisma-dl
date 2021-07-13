const genArg = (argv) => (_key) => {
  const key = _key.startsWith('--') ? _key : `--${_key}`

  const keyIndex = argv.indexOf(key)
  if (keyIndex === -1) {
    return null
  }

  const next = argv[keyIndex + 1]
  if (!next || next.startsWith('--')) {
    return null
  }

  return next
}

exports.genArg = genArg
