class eqFunction {
    constructor(str, glsl, args) {
        this.str = str;
        this.glsl = glsl;
        this.args = args;
    }
}

const eqFunctions = [
    new eqFunction("sin", "isin", 1),
    new eqFunction("cos", "icos", 1),
    new eqFunction("exp", "iexp", 1),
    new eqFunction("abs", "iabs", 1),
    new eqFunction("floor", "iflr", 1),
    new eqFunction("ceil", "icel", 1),
    new eqFunction("ln", "iln", 1),
    new eqFunction("rec", "irec", 1),
    new eqFunction("csc", "isin", 1),
    new eqFunction("cosec", "isin", 1),
    new eqFunction("sec", "icos", 1),
    new eqFunction("tan", "", 1),
    new eqFunction("cot", "", 1),
    new eqFunction("min", "imin", 2),
    new eqFunction("max", "imax", 2),
];

const functionFlag = "$";