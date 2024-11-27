class eqTokenPattern {
    constructor(id, pattern) {
        this.id = id;
        this.pattern = pattern;
    }
}

const piStr = "\u03C0";
const piFlag = "~";
const phiStr = "\u03C6";
const phiFlag = "\u00A3";

console.log(phiStr.replaceAll(phiStr, phiFlag));

const UNKNOWN = -100
const LITERAL_CONSTANT = 100;
const SPATIAL_VARIABLE = 200;
const TIME_VARIABLE = 250;
const BRACKET = 300;
const OPERATOR = 400;
const USER_VARIABLE = 500;
const SPECIAL_CONSTANT = 600;
const FUNCTION = 700;
const DOT = 800;
const eqTokenPatterns = [
    new eqTokenPattern(LITERAL_CONSTANT, /\d/),
    new eqTokenPattern(SPATIAL_VARIABLE, /[x-z]/),
    new eqTokenPattern(TIME_VARIABLE, /t/),
    new eqTokenPattern(BRACKET, /[\(\)]/),
    new eqTokenPattern(OPERATOR, /[+*/^,-]/), // minus sign (-) must be at end of square brackets, otherwise it is considered as a range of characters (e.g. a-z)
    new eqTokenPattern(USER_VARIABLE, /(?!e)[a-w]/), // a-w but not e
    new eqTokenPattern(SPECIAL_CONSTANT, new RegExp("[e" + piFlag + phiFlag + "]")),
    new eqTokenPattern(FUNCTION, new RegExp("\\" + functionFlag)),
    new eqTokenPattern(DOT, /\./) 
];

function geteqTokenType(char) { // returns ID of the equation part type that the char matches
    let matchedPatterns = eqTokenPatterns.filter(
        type => type.pattern.test(char)        
    );
    if (matchedPatterns.length == 0) {
        console.log("unknown character found: " + char + " " + char.charCodeAt(0));
        return UNKNOWN;
    }
    return matchedPatterns[0].id;
}