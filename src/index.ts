interface func {
  name: string;
  args: tokenizeOut[];
}
type tokenizeOut = Array<tokenizeOut | string | func>;

interface parseFunc {
  name: string;
  args: Array<parseOut | parseFunc | number>;
}

type parseOut = Array<parseOut | parseFunc>;


/**
 * Splits a string based on specified indices.
 * @param indexs The indices at which to split the string.
 * @param input The input string to split.
 * @returns An array of substrings.
 */
function splitStr(indexs: number[], input: string): string[] {
  let outArray: string[] = [];
  let currentIndex = 0;
  for (let idx of indexs) {
    outArray.push(input.slice(currentIndex, idx));
    currentIndex = idx;
  }
  // Add the last part of the string after the last index
  outArray.push(input.slice(currentIndex));
  return outArray.filter(Boolean); // Filter out empty strings
}

/**
 * Tokenizes a complex equation string into tokens.
 * @param equation The equation string to tokenize.
 * @returns An array of tokens.
 */
function tokenizeComplex(equation: string): tokenizeOut {
  const regex = /[A-Z]*\([^)]*\)|\([^)]*\)|\*|\+|\-|\//g;
  const input = equation.replace(/ /g, "");
  let match;
  let idxs = [];
  while ((match = regex.exec(input)) !== null) {
    idxs.push(match.index);
    idxs.push(match.index + match[0].length);
  }
  let tokens = splitStr(idxs, input);
  let newTokens: tokenizeOut = [];
  tokens.forEach((v, idx) => {
    if (v.search(/\(/) !== -1) {
      if (v.match(/^[A-Z]+/) == null) {
        newTokens.push(tokenizeComplex(v.substring(1, v.length - 1)));
      } else {
        let m = v.match(/^[A-Z]*/) as RegExpMatchArray;
        let name = m[0];
        let args = v.substring(name.length + 1, v.length - 1).split(",");
        let o: func = {
          name,
          args: []
        };
        args.forEach(arg => {
          o.args.push(tokenizeComplex(arg));
        });
        newTokens.push(o);
      }
    } else {
      newTokens.push(v);
    }
  });
  return newTokens;
}

/**
 * Gets the indices of a specific item in an array.
 * @param array The array to search.
 * @param input The item to find indices for.
 * @returns An array of indices.
 */
function getStr(array: Array<any>, input: any): number[] {
  let indces: number[] = [];
  array.forEach((item, idx) => {
    if (item === input) {
      indces.push(idx);
    }
  });
  return indces;
}

/**
 * Gets the indices of items in an array that match a regular expression.
 * @param array The array to search.
 * @param input The regular expression to match against.
 * @returns An array of indices.
 */
function getRegex(array: Array<any>, input: RegExp) {
  let indces: number[] = [];

  array.forEach((item, idx) => {
    if (typeof item =='string' && item.match(input) != null) {
      indces.push(idx);
    }
  });
  return indces;
}

/**
 * Checks if an array contains complex objects.
 * @param array The array to check.
 * @returns `true` if the array contains complex objects, `false` otherwise.
 */
function isComplex(array: Array<any>) {
  if (!Array.isArray(array) && typeof array == "object") {
    return true;
  }
  let indces: number[] = [];
  array.forEach((item, idx) => {
    if (typeof item == "object" && !Array.isArray(array)) {
      indces.push(idx);
    }
  });
  return indces;
}

/**
 * Merges and sorts two arrays of numbers.
 * @param array1 The first array.
 * @param array2 The second array.
 * @returns A new array containing the merged and sorted values.
 */
function mergeAndSortArray(array1: number[], array2: number[]): number[] {
  let or = array1;
  or.push(...array2);
  return or.slice().sort((a, b) => a - b);
}

/**
 * Parses a function token into a parse function.
 * @param func The function token to parse.
 * @returns The parsed function as a parse function.
 */
function parseFunction(func: func): parseFunc {
  let name = func.name;
  let args = func.args;
  let newArgs: Array<parseOut | number> = [];
  args.forEach(arg => {
    if (typeof arg == "string") {
      newArgs.push(parseInt(arg));
    } else {
      newArgs.push(parseComplex(arg));
    }
  });
  return {
    name,
    args: newArgs
  };
}

/**
 * Parses a complex tokenized expression into a parse tree.
 * @param tokens The tokenized expression to parse.
 * @returns The parsed expression as a parse tree.
 */
function parseComplex(tokens: tokenizeOut): parseOut {
  let outTokens: parseOut = [];
  let most = getRegex(tokens, /\+|-/)
  let largeToken= tokens[most[most.length-1]]
  console.log(largeToken)
  return outTokens;
}

/**
 * Parses an input string into a parse tree.
 * @param input The input string to parse.
 * @returns The parsed expression as a parse tree.
 */
function parse(input: string): parseOut {
  return parseComplex(tokenizeComplex(input));
}

const input = "( 1 + 5 ) * 5 + 7 * SQRT( 5 + 1 )";
const expected: parseOut = [
  {
    name: 'ADD',
    args: [
      {
        name: 'PRODUCT',
        args: [
          {
            name: 'ADD',
            args: [
              1,
              5
            ]
          },
          5
        ]
      },
      {
        name: 'PRODUCT',
        args: [
          7,
          {
            name: "SQRT",
            args: [
              {
                name: "ADD",
                args: [
                  5,
                  1
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
console.dir()
console.dir(parse(input), { depth: null });
//expected output
