class operator {
    constructor(op, precedence, associativity) {
        this.op = op;
        this.precedence = precedence;
        this.associativity = associativity;
    }
}
const LEFT_ASSOCIATE = 100;
const RIGHT_ASSOCIATE = 200;
const operators = [
    new operator("^", 4, RIGHT_ASSOCIATE),
    new operator("*", 3, LEFT_ASSOCIATE),
    new operator("/", 3, LEFT_ASSOCIATE),
    new operator("+", 2, LEFT_ASSOCIATE),
    new operator("-", 2, LEFT_ASSOCIATE),
    new operator(",", 1, LEFT_ASSOCIATE),
];
function getOp(op) {
    let matchedOps = operators.filter(o => o.op === op);
    if (matchedOps.length == 0) {
        console.log("unknown operator??: ");
        console.log(op);
        return UNKNOWN;
    }
    else
        return matchedOps[0];
}
