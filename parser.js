const other = ['other']
function meta(input) {
  return input.at('[') || input.at('`') || input.at(']')
}
function op(input) {
  if (input.at('`')) {
    input.next()
    if (input.done()) input.error('op')
    return ['op', input.next()]
  }
  return other
}
function note(input) {
  if (meta(input)) input.error('note')
  let note = input.next()
  while (true) {
    if (meta(input) || input.done()) return ['note', note]
    note += input.next()
  }
}
function tree(input) {
  if (input.at('[')) {
    input.next()
    input.bound(']')
    const tree = tao(input)
    input.unbound()
    input.next()
    return ['tree', tree]
  }
  return other
}
function tao(input) {
  const tao = []
  while (true) {
    if (input.atBound()) return ['tao', tao]
    let part = tree(input)
    if (part === other) {
      part = op(input)
      if (part === other) part = note(input)
    }
    tao.push(part)
  }
}

function parse(str) {
  const {length} = str
  let position = 0
  const bounds = []
  const input = {
    done() { return position >= length },
    at(symbol) { return str[position] === symbol },
    next() { return str[position++] },
    error(name) { throw Error(`ERROR: malformed ${name} at ${position}.`) },
    bound(symbol) { bounds.push([position, symbol]) },
    unbound() { bounds.pop() },
    atBound() {
      const {length} = bounds
      if (length > 0) {
        const [position, symbol] = bounds[length - 1]
        if (input.done()) throw Error(
            `ERROR: since ${position} expected "${symbol}" before end of input`
        )
        return input.at(symbol)
      }
      return input.done()
    },
  }
  return tao(input)
}
function unparse(ast) {
    const [tag, value] = ast
    if (tag === 'tao') return value.reduce((acc, next) => acc + unparse(next), "")
    if (tag === 'tree') return '[' + unparse(value) + ']'
    if (tag === 'note') return value
    if (tag === 'op') return '`' + value

    throw Error(`Invalid JSON AST of TAO: ${JSON.stringify(ast)}`)
}

export {parse, unparse}