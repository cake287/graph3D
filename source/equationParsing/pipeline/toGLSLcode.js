// takes postfix token list and returns GLSL code to be put in the frag shader

// this is outside postfixToGLSL so it can be used in passing the surface colour into the shader
function convertLiteralConst(num) {
    let str = num.toString();
    // if number string doesn't contain a decimal point, append ".0" to the string
    // GLSL will consider the number to be an integer if there is no decimal point
    // this will throw type conversion errors, so we must make GLSL consider it a float
    if (/\./.test(str) == false) { 
        str += ".0";
    }
    return str;
}

function postfixToGLSL(tokens) {
    let badEq = false;


    function convertSpatialVar(svar) {
        let dimension = -1;
        // could calculate dimension from ascii value but this is cleaer to read
        switch (svar) {
            case "x":
                dimension = 0;
                break;
            case "y":
                dimension = 1;
                break;
            case "z":
                dimension = 2;
                break;
            default:
                console.log("bad spatial var conversion input");
                badEq = true;
                break;
        }

        return "p[" + dimension + "].st";
    }

    function convertOperator(op) {
        // returns function name corresponding to operator
        let s = " ";
        switch (op) {
            case "+":
                s = "iadd";
                break;
            case "-":
                s = "isub";
                break;
            case "*":
                s = "imul";
                break;
            default:
                console.log("bad operator coversion");
                badEq = true;
                break;
        }
        return s;
    }

    function convertFunction(func) {
        let matchedFunctions = eqFunctions.filter(
            f => f.str == func        
        );
        if (matchedFunctions.length == 0) {
            console.log("unknown function found: " + func);
            return UNKNOWN;
        }
        return matchedFunctions[0].glsl;
    }

    function convertSpecialConst(sConst) {
        switch (sConst) {
            case "e":
                return "CONST_E";
            case piFlag:
                return "CONST_PI";
            default:
                console.log("unknown special constant");
                return UNKNOWN;
        }
    }


    // returns string "<func>(<args[0]>, <args[1]>, ...)"
    function enclose(func, args) {
        let str = func + "(";

        str += args[0];
        for (let i = 1; i < args.length; i++) 
            str += ", " + args[i];
        str += ")";
        return str;
    }



    class eqCodePart {
        constructor(id, value, condition) {
            this.label = "part" + id.toString();
            this.str = "ifloat " + this.label + " = " + value + "; \n";
            this.condition = condition;
        }
    };    
    let parts = [];
    let recParts = 0;

    let stack = [];

    function addLnPart(value) {
        let partVal = convertFunction("ln") + "(" + value + ")";
        let newPart = new eqCodePart(
            parts.length, 
            partVal, 
            "");
        newPart.condition = newPart.label + ".t < LN_MIN + 0.1";

        parts.push(newPart);

        return newPart.label;
    }

    function addRecPart(value) {
        let partVal = enclose(
            convertFunction("rec"), 
            [value, enclose("getSeedPart", ["seed",  recParts])]
        );
        let newPart = new eqCodePart(
            parts.length, 
            partVal, 
            "");
        newPart.condition = 
            `((getSeedPart(seed, ` + recParts + `) == -1 && ` + newPart.label + `.t < -(REC_MAX - 1.)) ||
            (getSeedPart(seed, ` + recParts + `) ==  1 && ` + newPart.label + `.s >  (REC_MAX - 1.)))`;
    
        recParts++; 

        parts.push(newPart);
        return newPart.label;
    }

    for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i].type) {
            case LITERAL_CONSTANT:
                let lcStr = convertLiteralConst(tokens[i].text);
                stack.push(lcStr);
                break;

            case SPATIAL_VARIABLE:
                svStr = convertSpatialVar(tokens[i].text);
                stack.push(svStr);
                break;

            case SPECIAL_CONSTANT:
                svStr = convertSpecialConst(tokens[i].text);
                stack.push(svStr);
                break;
            
            case FUNCTION:
                if (stack.length < 1) {
                    console.log("function stack fail");
                    badEq = true;
                }
                switch (tokens[i].text) {
                    case "ln": {
                        let content = stack.pop();
                        stack.push(addLnPart(content));
                    }
                        break;
                        
                    case "rec": {
                        let content = stack.pop();
                        stack.push(addRecPart(content));
                    }
                        break;

                    // repeated "case" acts as an "or"
                    case "csc":
                    case "cosec":
                    case "sec":
                        {
                            let content = stack.pop();
                            stack.push(addRecPart(
                                enclose(
                                    convertFunction(tokens[i].text),
                                    [content]
                                )
                                ));
                        }
                        break;

                    case "tan":
                    case "cot":
                         {
                        // convert tan x to sin x / cos x,
                        //         cot x to cos x / sin x

                        let content = stack.pop();
                        let numerator = enclose(convertFunction(tokens[i].text == "tan"? "sin" : "cos"), [content]);
                        let denominator = enclose(convertFunction(tokens[i].text == "tan"? "cos" : "sin"), [content]);
                        let recDenom = addRecPart(denominator);
                        stack.push(
                            enclose(
                                convertOperator("*"), 
                                [numerator, recDenom]
                            )
                        );

                    }
                        break;

                    case "min":
                    case "max":
                        let arg2 = stack.pop();
                        let arg1 = stack.pop();

                        stack.push(
                            enclose(
                                convertFunction(tokens[i].text),
                                [arg1, arg2]
                            )
                        );

                        break;

                    default:
                        {
                        let content = stack.pop();
                        let funcString = convertFunction(tokens[i].text);
        
                        stack.push(
                            enclose(
                                funcString,
                                [content]
                            )
                            );
                        
                        break;
                        }
                }                
                break;

            case OPERATOR:
                if (stack.length < 2) {
                    console.log("operator stack fail");
                    badEq = true;
                }
                switch (tokens[i].text) {
                    case ",":
                        // this works without doing anything here
                        // TODO: add some code to consider when the inputted equation is bad
                        // and also code to allow for a variable number of args
                        break;

                    case "/":
                        // convert x/y to x*rec(y)

                        let str2 = stack.pop();
                        let str1 = stack.pop();

                        let recStr2 = "";
                        // if denominator is a constant, no need to do the whole part shenanigans
                        if (!isNaN(Number(str2)))
                            recStr2 = (1 / Number(str2)).toString();
                        else if (str2 == "CONST_PI" || str2 == "CONST_E") 
                            recStr2 = "(1. / " + str2 + ")"
                        else 
                            recStr2 = addRecPart(str2);

                        stack.push(
                            enclose(
                                convertOperator("*"),
                                [str1,
                                recStr2
                                ]
                            )
                        );

                        break;

                    case "^": {
                        // x^y
                        let y = stack.pop();
                        let x = stack.pop();



                        // if y is an integer
                        
                        if (!isNaN(parseInt(y))) {
                            // convert to x*x*x*x*..., y times
                            let repetitions = parseInt(y);
                            function mul() {
                                if (repetitions > 1) {
                                    repetitions--;
                                    return enclose(
                                        convertOperator("*"),
                                        [x, mul()]
                                        );
                                } else 
                                    return x;
                            }
                            stack.push(mul());
                        }
                        else if (x == "CONST_E") {
                            stack.push(enclose(
                                convertFunction("exp"),
                                [y]
                                ));
                        } 
                        else if (!isNaN(Number(x))) {
                            // if the base is a known number, no additional part needed
                            stack.push(enclose(
                                convertFunction("exp"),
                                [
                                    enclose(
                                        convertOperator("*"),
                                        [
                                            y, 
                                            enclose("log", [x])
                                        ]
                                    ) 
                                ]
                                ));
                        }
                        else {
                            // convert x^y to exp(y * ln(x))
                            let lnX = addLnPart(x);
                            let newStr = enclose(
                                convertFunction("exp"),
                                [
                                    enclose(
                                        convertOperator("*"),
                                        [y, lnX]
                                    )
                                ]
                            );
                            stack.push(newStr);
                        }
                    }
                        break;

                    default: {
                        let str2 = stack.pop();
                        let str1 = stack.pop();
                        
                        let newStr = enclose(
                            convertOperator(tokens[i].text),
                            [str1, str2]
                            );

                        stack.push(newStr);
                    }
                }
                break;

            default:
                console.log("creating glsl code failed on unknown token type at position " + i.toString() + ": ")
                console.log()
                badEq = true;
                break;
        }
    }
    
    let r = "ifloat r = " + stack.pop() + "; \n";

    let code = "";
    for (let i = 0; i < parts.length; i++) {
        code += parts[i].str;
    }
    code += r;

    if (parts.length >= 1) {
        code += "if (" + parts[0].condition;
        for (let i = 1; i < parts.length; i++)
            code += " || " + parts[i].condition;

        code += ") \n return ifloat(r.t, r.s); \n else \n"
    }
    code += "return r;";

    //let code = "return " + stack.pop() + ";";

    //console.log(code);
    //console.log(tokens);

    if (badEq)
        return BAD_EQUATION;
    else
        return {
            code: code,
            seedCount: Math.pow(2, recParts)
        };
}