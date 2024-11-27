let surfaceUniformLocations = {
    "iResolution" : -1,
    "iTime" : -1,
    "iCamPos" : -1,
    "iCamTar" : -1,
    "iCamMat" : -1,
    "iZoom" : -1,
    "iOriginOffset" : -1,
    "iProjectionID" : -1,
    "iAngleScale": -1
};

function GetSurfaceUniforms(gl, program) {
    for(let key in surfaceUniformLocations) { 
        surfaceUniformLocations[key] = gl.getUniformLocation(program, key);
    }
}

function SetSurfaceUniforms(gl, time) {
    gl.uniform2f(surfaceUniformLocations["iResolution"], gl.canvas.width, gl.canvas.height);
    gl.uniform1f(surfaceUniformLocations["iTime"], time * 0.001);
    gl.uniform3f(surfaceUniformLocations["iCamPos"], cameraPos.x, cameraPos.y, cameraPos.z);
    gl.uniform3f(surfaceUniformLocations["iCamTar"], cameraTar.x, cameraTar.y, cameraTar.z);

    // second parameter to uniformMatrix3fv() specificies whether the matrix should be transposed on input
    // opengl seems to used a transposed matrix format to mine, so it is true here
    // webgl 1 (based on opengl es 2) requires it to be false
    // webgl 2 (based on opengl es 3), which i am using, allows it to be used.
    // i commented this because it took me a while to work this all out
    gl.uniformMatrix3fv(surfaceUniformLocations["iCamMat"], true, cameraMatrix.mat);

    gl.uniform1f(surfaceUniformLocations["iZoom"], zoom);
    gl.uniform3f(surfaceUniformLocations["iOriginOffset"], graphOriginOffset.x, graphOriginOffset.y, graphOriginOffset.z);

    gl.uniform1i(surfaceUniformLocations["iProjectionID"], projection);
    gl.uniform1f(surfaceUniformLocations["iAngleScale"], angleScale);
}