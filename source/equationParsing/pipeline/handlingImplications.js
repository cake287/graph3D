// resolves --+-a to -a
function resolveMultiplePlusMinus(tokens) {
    let newTokens = [];    
    for (let i = 0; i < tokens.length;) {
        if (tokens[i].text == "+" ||
            tokens[i].text == "-"
        ) {
            let resolvedValue = 1;
            while(i < tokens.length && (tokens[i].text == "+" || tokens[i].text == "-")) {
                if (tokens[i].text == "-")
                    resolvedValue *= -1;
                i++;
            }
            if (resolvedValue == 1) 
                newTokens.push(new eqToken("+", OPERATOR));
            else if (resolvedValue == -1) 
                newTokens.push(new eqToken("-", OPERATOR));
        } else {
            newTokens.push(tokens[i]);
            i++;
        }
    }
    return newTokens;
}

// returns index of the ) that corresponds to the given index of a (
function findMatchingBracket(tokens, openBracketIndex) {
    let i = openBracketIndex + 1;
    let openCount = 1;
    while (openCount > 0 && i < tokens.length) { 
        i++;
        if (tokens[i].text == "(")
            openCount++;
        else if (tokens[i].text == ")")
            openCount--;
    }

    // if we've got to the end of the tokens array without finding the matching bracket, the brackets are mismatched
    if (i == tokens.length - 1 && openCount > 0) 
        return BAD_EQUATION;
    else
        return i;
}

// if preceded by an operator or left bracket "("
// replaces "-a" with "(0-a)"
// replaces "+a" with "(0+a)"
function handleSigns(tokens) {
    let newTokens = [];
    // loop from second to second last token 
    // (a minus or plus will always be preceded by something as the expression is "(<LHS>) - (<RHS>)")
    newTokens.push(tokens[0]);
    for (let i = 1; i < tokens.length - 1; i++) {
        if (
            (
                tokens[i].text == "+" ||
                tokens[i].text == "-"
            ) && (
                tokens[i - 1].type == OPERATOR ||
                tokens[i - 1].text == "("
            )
        ) 
        {
            if (tokens[i + 1].type == SPATIAL_VARIABLE ||
                tokens[i + 1].type == USER_VARIABLE ||
                tokens[i + 1].type == SPECIAL_CONSTANT
            ) {
                newTokens.push(new eqToken("(", BRACKET));
                newTokens.push(new eqToken("0", LITERAL_CONSTANT));
                newTokens.push(tokens[i]);
                newTokens.push(tokens[i + 1]);
                newTokens.push(new eqToken(")", BRACKET));
                i++;
            } else if (tokens[i + 1].type == LITERAL_CONSTANT) {
                if (tokens[i].text == "-") {
                    let num = parseInt(tokens[i + 1].text);
                    num *= -1;
                    newTokens.push(new eqToken(num.toString(), LITERAL_CONSTANT));
                } else {
                    newTokens.push(tokens[i + 1]);
                }
                i++;
            }  else if (tokens[i + 1].text == "(") {
                // enclose the entire bracket in (0 - (...))
                // the bracketted term must also have its signs made explicit, as it is skipped over here.
                
                let closingBracket = findMatchingBracket(tokens, i + 1);
                let brackettedTokens = tokens.slice(i + 1, closingBracket + 1);
                //console.log(brackettedTokens);

                let explicitlySignedBrackettedTokens = handleSigns(brackettedTokens); // recursion babyyyy!!!
                //console.log(explicitlySignedBrackettedTokens);

                newTokens.push(new eqToken("(", BRACKET));
                newTokens.push(new eqToken("0", LITERAL_CONSTANT));
                newTokens.push(tokens[i]);
                for (let j = 0; j < explicitlySignedBrackettedTokens.length; j++) {
                    newTokens.push(explicitlySignedBrackettedTokens[j]);
                    i++;
                }
                newTokens.push(new eqToken(")", BRACKET));
            } else if (tokens[i + 1].type == FUNCTION) {
                newTokens.push(new eqToken(parseInt(tokens[i].text + "1").toString(), LITERAL_CONSTANT));
                newTokens.push(new eqToken("*", OPERATOR));
                newTokens.push(tokens[i + 1]);
                i++;
            }                         
            else {
                return BAD_EQUATION;
            }


        } else {
            newTokens.push(tokens[i]);
        }
    }
    newTokens.push(tokens[tokens.length - 1]);

    return newTokens;
}

// adds multiplication signs to implicit multiplication
// i.e. "ab" becomes "a*b"
function addImpliedMultiplication(tokens) {
    let newTokens = [];
    // loop to the second last token (last token will never be followed by an implied multiplication)
    for (let i = 0; i < tokens.length - 1; i++) {
        newTokens.push(tokens[i]);
        if (
            (
                tokens[i].type == LITERAL_CONSTANT ||
                tokens[i].type == SPATIAL_VARIABLE ||
                tokens[i].type == SPECIAL_CONSTANT ||
                //tokens[i].type == USER_VARIABLE ||
                tokens[i].text == ")"
            ) && 
            (
                tokens[i + 1].type == SPATIAL_VARIABLE ||
                tokens[i + 1].type == SPECIAL_CONSTANT ||
                //tokens[i + 1].type == USER_VARIABLE ||
                tokens[i + 1].type == FUNCTION ||
                tokens[i + 1].text == "("
            )
        ) {
            newTokens.push(new eqToken("*", OPERATOR));    
        }
    }
    newTokens.push(tokens[tokens.length - 1]); // last token was not iterated over, so it must now be pushed onto newTokens 

    return newTokens;
}


function handleImplications(tokens) {
    tokens = resolveMultiplePlusMinus(tokens);
    tokens = handleSigns(tokens);
    if (tokens != BAD_EQUATION) 
        tokens = addImpliedMultiplication(tokens);

    return tokens;
}