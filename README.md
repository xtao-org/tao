# Reference parser for TAO

This is a parser for the [TAO syntax grammar](https://www.tree-annotation.org/#grammar).

It is implemented in simple JavaScript, as a module.

The implementation can be used as a reference for other parsers, in particular in other programming languages.

# Interactive version

Interactive version of the parser can be to tried at [tree-annotation.org](https://tree-annotation.org/parser.html).

# Usage

To use the parser module, import it into your code, for example like this:

```js
import {parse, unparse} from "https://raw.githubusercontent.com/tree-annotation/tao/v1.0-beta/parser.js"

// ...

console.log(unparse(parse("hello, world!"))) // prints `hello, world!`
```

Note: this example imports the `v1.0-beta` version directly from GitHub (as specified in the URL).