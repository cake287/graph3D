function createShader(gl, shaderType, source) {
	let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		let errors = gl.getShaderInfoLog(shader);
		gl.useProgram(null);
        let shaderTypeString = "UNDEFINED SHADER"
        if (shaderType == 0x8B30) shaderTypeString = "Fragment";
        else if (shaderType == 0x8B31) shaderTypeString = "Vertex";
		throw (shaderTypeString + " shader compilation error: \n" + errors);
	}
    return shader;
}

function createProgram(gl, vertShader, fragShader) {
    	let vs = createShader(gl, gl.VERTEX_SHADER, vertShader);
    	let fs = createShader(gl, gl.FRAGMENT_SHADER, fragShader);

    	let program = gl.createProgram();
    	gl.attachShader(program, vs);
    	gl.attachShader(program, fs);
    	gl.linkProgram(program);
    	gl.detachShader(program, vs);
    	gl.detachShader(program, fs);
    	gl.deleteShader(vs);
    	gl.deleteShader(fs);
    	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    		let errors = gl.getProgramInfoLog(program);
    		gl.useProgram(null);
    		console.log("Shader link error: " + errors);
    		return;
    	}
        return program;
}

// function addSurfaceProgram(gl, fragShader) {
// 	// if (glProgram !== -1)
// 	// 	gl.deleteProgram(glProgram);
// 	let program = createProgram(gl, surfacesVS, fragShader);
// 	//GetSurfaceUniforms(gl, program);
// 	surfacePrograms.push(program);
// }
