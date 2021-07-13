export function genArg(argv: string[]) {
  return function arg<T extends string = string>(_key: string) {
    const key = _key.startsWith('--') ? _key : `--${_key}`

    const keyIndex = argv.indexOf(key)
    if (keyIndex === -1) {
      return null
    }

    const next = argv[keyIndex + 1]
    if (!next || next.startsWith('--')) {
      return null
    }

    return next as T
  }
}
