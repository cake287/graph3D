function strToInfixTokens(eq) {
    eq = eq.replace(/\s+/g, ''); // replaces all whitespace with nothing

    let badEq = false;

    function replaceAbsBars(str) {
        // go from start of string to first bar, and replace the bar with "abs("
        // continue until found the next bar *at the same bracket level*, and replace with ")"
        // if no bar is found at the same bracket level on the second run, the bars are mismatched

        // if the string still contains any bars, run this procedure on the string again

        // this procedure will, given "|x + |y| |", return abs(x +) y abs( )
        // there is no real way to discern how bars should be interpreted here
        // instead, i'm relying on the user supplying brackets to indicate the intention

        // desmos uses a system where the second bar is automatically typed when you type the first bar,
        //  and presumably keeps track of which bar corresponds to which other bar
        // (or inserts some hidden brackets), but i didn't have time to impliment something like this (yet)

        
        let j = 0;
        while (j < str.length && str.charAt(j) != "|")
            j++;
        
        if (str.charAt(j) == "|") {
            str = str.substring(0, j) + "abs(" + str.substring(j + 1);
            j += 4; // go past the "abs("
            
            let bracketLevel = 0;
            while (j < str.length && (str.charAt(j) != "|" || bracketLevel != 0)) {
                if (str.charAt(j) == "(")
                    bracketLevel++;
                else if (str.charAt(j) == ")")
                    bracketLevel--;
                j++;

            }

            if (str.charAt(j) == "|")
                str = str.substring(0, j) + ")" + str.substring(j + 1);
            else {
                badEq = true;
                console.log("mismatched abs bars");
            }
        }
        if (/\|/.test(str))
            str = replaceAbsBars(str);

        return str;
    }

    eq = replaceAbsBars(eq);

    if (eq.includes(functionFlag) || eq.includes(piFlag))
        badEq = true;
    eq = eq.replaceAll(piStr, piFlag);
    console.log(eq);
    eq = eq.replaceAll(phiStr, phiFlag);
    console.log(eq);

    for (let f = 0; f < eqFunctions.length; f++) {
        let pattern = new RegExp(eqFunctions[f].str, "g");
        let newTxt = functionFlag + eqFunctions[f].str + functionFlag;
        eq = eq.replace(pattern, newTxt);
    }

    let i = 0; // char index in equation
    let eqTokens = [];
    // iterate over every character in the string
    // find the appropriate token type and append the new token to the list of tokens
    while(i < eq.length && !badEq) {
        let tokenText = eq.charAt(i).toString();
        i++;

        let tokenType = geteqTokenType(tokenText);
        if (tokenType == UNKNOWN)
            badEq = true;
        else if (tokenType == LITERAL_CONSTANT || tokenType == DOT) {
            if (tokenType == DOT)
                tokenType = LITERAL_CONSTANT;

            // literal constants can be more than one character long 
            // iterate until the end of the literal is found
            while (i < eq.length && 
                (
                    geteqTokenType(eq.charAt(i)) == LITERAL_CONSTANT ||
                    geteqTokenType(eq.charAt(i)) == DOT
                )
            ) {
                tokenText = tokenText.concat(eq.charAt(i).toString());
                i++;
            }
        }
        else if (tokenType == FUNCTION) {
            tokenText = "";
            // find next instance of the function flag (which indicates the end of this function string)
            while (i < eq.length && 
                eq.charAt(i).toString() != functionFlag
            ) {
                tokenText = tokenText.concat(eq.charAt(i).toString());
                i++;
            }
            i++; // go to next char past end flag
        }

        if (!badEq)
            eqTokens.push(new eqToken(tokenText, tokenType));
    }
    if (badEq)
        return BAD_EQUATION;
    else
        return eqTokens;
}