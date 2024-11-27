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

function getFragShaderFromEq(eqSrc) {
    let eqExpression = BAD_EQUATION; // eqExpression is left hand side minus right hand side
    
    // if there is exactly one equals sign in eqSrc
    if ((eqSrc.match(/=/g) || []).length == 1) {
        let LHS = eqSrc.substring(0, eqSrc.indexOf("="));
        let RHS = eqSrc.substring(eqSrc.indexOf("=") + 1);
        if (LHS.length != 0 && RHS.length != 0) 
            eqExpression = "(" + LHS + ") - (" + RHS + ")";
    }
    

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
    surfacePrograms = [];

    let elements = document.getElementsByClassName("element-row");
    for (let i = 0; i < elements.length; i++) {
        let eqSrc = elements[i].getElementsByClassName("element-input")[0].value;
        let fs = getFragShaderFromEq(eqSrc);

        let r = convertLiteralConst(elements[i].getAttribute("data-r"));
        let g = convertLiteralConst(elements[i].getAttribute("data-g"));
        let b = convertLiteralConst(elements[i].getAttribute("data-b"));
        let colStr = "#define SURFACE_COL vec3(" + r + "," + g + "," + b + ")";
        
        function setGoodEqStyle(eqIndex) {
            elements[eqIndex].getElementsByClassName("el-warning")[0].style.display = "none";            
            elements[eqIndex].getElementsByClassName("el-icon")[0].style.display = "block";            
        }
        function setBadEqStyle(eqIndex) {
            elements[eqIndex].getElementsByClassName("el-warning")[0].style.display = "block";            
            elements[eqIndex].getElementsByClassName("el-icon")[0].style.display = "none";         
        }

        if (fs !== false) {
            setGoodEqStyle(i);
            //console.log(fs);
            fs = fs.replace("//#COL_IN#", colStr);
            surfacePrograms.push(createProgram(gl, surfacesVS, fs));
        } else {
            setBadEqStyle(i);
        }
    }
}