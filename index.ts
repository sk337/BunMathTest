interface func {
  name: string;
  args: tokenizeOut[];
}
type tokenizeOut = Array<tokenizeOut | string | func> 

type parseOut = Array<parseOut | func>

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

function tokenizeComplex(equation: string): tokenizeOut {
  const regex = /[A-Z]*\([^)]*\)|\([^)]*\)|\*|\+|\-|\//g;
  const input = equation.replace(/ /g, "")
  let match;
  let idxs = []
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
        let o = {
          name,
          args: []
        }
        args.forEach(arg => {
          o.args.push(tokenizeComplex(arg));
        })
        newTokens.push(o)
      }
    } else {
      newTokens.push(v)
    }
  })
  return newTokens;
}


function parse(equation: string) {
  const input = equation.replace(/ /g, "")
  const tokens = tokenizeComplex(input)
  
  return tokens;
}

const input = "( 1 + 5 ) * 5 + 7 * SQRT( 5 + 1 )";
console.log(parse(input))