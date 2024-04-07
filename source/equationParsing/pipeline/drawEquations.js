function checkMismatchedBrackets(tokens) {
    let openCount = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].text == "(")
            openCount++;
        else if (tokens[i].text == ")")
            openCount--;
    }
    if (openCount == 0)
        return GOOD_EQUATION;
    else
        return BAD_EQUATION;
}

function getFragShaderFromEq(eqExpression) {
    // each stage in the pipeline is conditional on all the prev stages succeeding
    // otherwise the stage will evaluate to BAD_EQUATION
    
    let tokensInfix = BAD_EQUATION;
    if (eqExpression != BAD_EQUATION) 
        tokensInfix = strToInfixTokens(eqExpression);
    if (tokensInfix.length == 0)
        tokensInfix = BAD_EQUATION;


    if (checkMismatchedBrackets(tokensInfix) == BAD_EQUATION)
        tokensInfix = BAD_EQUATION;


    let tokensInfixExplicit = BAD_EQUATION; 
    if (tokensInfix != BAD_EQUATION) 
        tokensInfixExplicit = handleImplications(tokensInfix);


    let tokensPostfix = BAD_EQUATION;
    if (tokensInfixExplicit != BAD_EQUATION) {
        tokensPostfix = infixToPostfix(tokensInfixExplicit);
    }

    //console.log(tokensPostfix);
    
    let glslCode = BAD_EQUATION;
    if (tokensPostfix != BAD_EQUATION) {
        glslCode = postfixToGLSL(tokensPostfix);
    }
    //console.log(glslCode);

    if (glslCode != BAD_EQUATION) {
        //console.log("good equation");
        let newFS = surfacesFS.replace("#define SEED_COUNT 1", "#define SEED_COUNT " + glslCode.seedCount);
        return newFS.replace("//#EQ_IN#", glslCode.code);
    } else {
        //console.log("bad equation");
        return false;
    }
}
 
let surfacePrograms = [];
function drawEquations(gl) {
    function setGoodEqStyle(eqIndex) {
        elements[eqIndex].getElementsByClassName("el-warning")[0].style.display = "none";            
        elements[eqIndex].getElementsByClassName("el-icon")[0].style.display = "block";            
    }
    function setBadStyle(eqIndex) {
        elements[eqIndex].getElementsByClassName("el-warning")[0].style.display = "block";            
        elements[eqIndex].getElementsByClassName("el-icon")[0].style.display = "none";         
    }
    function setNoneStyle(eqIndex) {
        elements[eqIndex].getElementsByClassName("el-warning")[0].style.display = "none";            
        elements[eqIndex].getElementsByClassName("el-icon")[0].style.display = "none";         
    }
    function setUserVarStyle(eqIndex) {

    }


    surfacePrograms = [];

    let elements = document.getElementsByClassName("element-row");
    for (let i = 0; i < elements.length; i++) {
        let elementText = elements[i].getElementsByClassName("element-input")[0].value;

        if ((elementText.match(/=/g) || []).length != 1)
            setNoneStyle();
        else {
            let LHS = elementText.substring(0, elementText.indexOf("="));
            let RHS = elementText.substring(elementText.indexOf("=") + 1);

            if (strIsEntirelyType(LHS, USER_VARIABLE)) {
                let goodVar = true;

                goodVar = !RHS.includes(piFlag);
                RHS = RHS.replace(piStr, piFlag);

                if (goodVar)
                    goodVar = RHS.length != 0 && strIsEntirelyTypes(RHS, [LITERAL_CONSTANT, SPECIAL_CONSTANT]);

                
                if (goodVar) {
                    console.log("GOOD USER VARIABLE BRUV");
                    setUserVarStyle(i);
                }
                else {
                    console.log("BAD USER VARIABLE U SCHMUCK");
                    setBadStyle(i);
                }
            } 
            else 
            {
                let eqExpression = BAD_EQUATION;
                if (LHS.length != 0 && RHS.length != 0) 
                    eqExpression = "(" + LHS + ") - (" + RHS + ")";

                let fs = getFragShaderFromEq(eqExpression);

                let r = convertLiteralConst(elements[i].getAttribute("data-r"));
                let g = convertLiteralConst(elements[i].getAttribute("data-g"));
                let b = convertLiteralConst(elements[i].getAttribute("data-b"));
                let colStr = "#define SURFACE_COL vec3(" + r + "," + g + "," + b + ")";
                
                

                if (fs !== false) {
                    setGoodEqStyle(i);
                    //console.log(fs);
                    fs = fs.replace("//#COL_IN#", colStr);
                    surfacePrograms.push( {
                        elementID: elements[i].id,
                        program: createProgram(gl, surfacesVS, fs)
                    });
                } else {
                    setBadStyle(i);
                }
            }            
        }
    }
}