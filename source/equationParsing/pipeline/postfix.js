function peek(stack) {
    return stack[stack.length - 1];
}

// shunting yard algorithm
// function takes in tokens in infix formats
function infixToPostfix(tokens) {
    let mismatchedBrackets = false;
    let unknownToken = false;
    let output = [];
    let opStack = [];
    for (let i = 0; i < tokens.length; i++) {     
        switch(tokens[i].type) {
            // repeated "case" acts as an "or" operation
            case SPATIAL_VARIABLE:
            case SPECIAL_CONSTANT:
            case LITERAL_CONSTANT:
                output.push(tokens[i]);
                break;

            case FUNCTION:
                opStack.push(tokens[i]);
                break;


            case OPERATOR:
                while(
                    opStack.length != 0
                    && peek(opStack).type == OPERATOR
                    && (
                        (
                            getOp(tokens[i].text).associativity == LEFT_ASSOCIATE
                            && getOp(tokens[i].text).precedence <= getOp(peek(opStack).text).precedence
                        )
                        ||
                        (
                            getOp(tokens[i].text).associativity == RIGHT_ASSOCIATE
                            && getOp(tokens[i].text).precedence < getOp(peek(opStack).text).precedence
                        )
                    ) 
                ) {
                    output.push(opStack.pop());
                }
                opStack.push(tokens[i]);
                break;


            case BRACKET:
                switch(tokens[i].text) {
                    case "(":
                        opStack.push(tokens[i]);
                        break;

                    case ")":
                        while (opStack.length != 0 && peek(opStack).text != "(") {
                            output.push(opStack.pop());
                        }
                        if (opStack.length == 0) {
                            console.log("MISMATCHED BRACKETS");
                            mismatchedBrackets = true;
                            break;
                        }
                        opStack.pop(); // pop off left bracket
                        if (opStack.length > 0)
                            if (peek(opStack).type == FUNCTION) 
                                output.push(opStack.pop());
                        break;

                    default:
                        console.log("unknown bracket token found  at " + i.toString() + ": ");
                        console.log(tokens[i]);
                        unknownToken = true;
                        break;
                }
                break;


            default:
                console.log("unknown token found at " + i.toString() + ": ");
                console.log(tokens[i]);
                unknownToken = true;
                break;
        }
    }

    while (opStack.length != 0) {
        let op = opStack.pop();
        if (op.type == BRACKET) {
            console.log("MISMATCHED BRACKETS (after all tokens read)");
            mismatchedBrackets = true;
        }
        else
            output.push(op);
    }


    if (!mismatchedBrackets && !unknownToken)
        return output;
    else   
        return BAD_EQUATION;
}