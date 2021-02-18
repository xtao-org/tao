import {parse, unparse} from "./parser.js"

console.log(unparse(parse("key [value] array [[item1][item2][item3]]"))) // prints back the input to `parse`