class eqTokenPattern {
    constructor(id, pattern) {
        this.id = id;
        this.pattern = pattern;
    }
}

const piStr = "\u03C0";
const piFlag = "~";

const UNKNOWN = -100
const LITERAL_CONSTANT = 100;
const SPATIAL_VARIABLE = 200;
const BRACKET = 300;
const OPERATOR = 400;
const USER_VARIABLE = 500;
const SPECIAL_CONSTANT = 600;
const FUNCTION = 700;
const DOT = 800;
const eqTokenPatterns = [
    new eqTokenPattern(LITERAL_CONSTANT, /\d/),
    new eqTokenPattern(SPATIAL_VARIABLE, /[x-z]/),
    new eqTokenPattern(BRACKET, /[\(\)]/),
    new eqTokenPattern(OPERATOR, /[+*/^,-]/), // minus sign (-) must be at end of square brackets, otherwise it is considered as a range of characters (e.g. a-z)
    new eqTokenPattern(USER_VARIABLE, /(?!e)[a-w]/), // a-w but not e
    new eqTokenPattern(SPECIAL_CONSTANT, new RegExp("[e" + piFlag + "]")),
    new eqTokenPattern(FUNCTION, new RegExp("\\" + functionFlag)),
    new eqTokenPattern(DOT, /\./) 
];

function geteqTokenType(char) { // returns ID of the equation part type that the char matches
    let matchedPatterns = eqTokenPatterns.filter(
        type => type.pattern.test(char)        
    );
    if (matchedPatterns.length == 0) {
        console.log("unknown character found: " + char);
        return UNKNOWN;
    }
    return matchedPatterns[0].id;
}

// function matchEntireString(pattern, str) {
//     let chars = str.split("");
//     for (let i = 0; i < chars.length; i++) {
//         if (!pattern.test(chars[i]))
//             return false;
//     }
//     return true;
// }
function matchEntireString(patterns, str) {
    let chars = str.split("");
    for (let c = 0; c < chars.length; c++) {
        let cMatches = false;
        for (let p = 0; p < patterns.length; p++) {
            if (patterns[p].test(chars[c]))
                cMatches = true;
        }
        if (!cMatches)
            return false;
    }
    return true;    
}

// // could have condensed these into one method but
// // *performance*
// // probably makes 0 difference
// function strIsEntirelyType(str, type) {
//     return matchEntireString(eqTokenPatterns.filter(tp => tp.id == type)[0].pattern, str);
// }

function strIsEntirelyTypes(str, types) {
    let patterns = eqTokenPatterns.filter(tp => types.includes(tp.id)).map(tp => tp.pattern);
    return matchEntireString(patterns, str);
}
function strIsEntirelyType(str, type) {
    return strIsEntirelyTypes(str, [type]);
}