function meta(input) {
  return input.at('[') || input.at('`') || input.at(']')
}
function cite(input) {
  if (input.at('`')) { input.next()
    if (input.done()) input.error('cite')
    return ['cite', input.next()]
  }
}
function note(input) {
  if (meta(input)) input.error('note')
  let note = input.next()
  while (true) {
    if (input.done() || meta(input)) return ['note', note]
    note += input.next()
  }
}
function tree(input) {
  if (input.at('[')) { input.next()
    const tree = tao(input.until(']'))
    input.next()
    return ['tree', tree]
  }
}
function tao(input) {
  const tao = []
  while (true) {
    if (input.done()) return ['tao', tao]
    tao.push(tree(input) || cite(input) || note(input))
  }
}

function parse(str) {
  const {length} = str
  let position = 0
  const input = {
    done() { return position >= length },
    at(symbol) { return str[position] === symbol },
    next() { return str[position++] },
    save() { saved = position },
    error(name) { throw Error(`ERROR: malformed ${name} at ${position}.`) },
    // returns a shallow copy of input with a replaced done() method
    // the new method uses the original one
    until(symbol) {
      const saved = position
      return {...input,
        done() {
          if (input.done()) throw Error(
            `ERROR: since ${saved} expected ${JSON.stringify(symbol)} before end of input`
          )
          return input.at(symbol)
        }
      }
    }
  }
  return tao(input)
}
function unparse(ast) {
    const [tag, value] = ast
    if (tag === 'tao') return value.reduce((acc, next) => acc + unparse(next), "")
    if (tag === 'tree') return '[' + unparse(value) + ']'
    if (tag === 'note') return value
    if (tag === 'cite') return '`' + value

    throw Error(`Invalid JSON AST of TAO: ${JSON.stringify(ast)}`)
}

function toAst(str) {
  return JSON.stringify(
    parse(str), 
    null, 
    2
  )
}