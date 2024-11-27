let axesUniformLocations = {
    "iOriginOffset": -1,
    "iResolution" : -1,
    "iCamPos" : -1,
    "iCamTar" : -1,
    "iCamMat" : -1,
    "iProjectionID" : -1
};
function GetAxesUniforms(gl, program) {
    for(let key in axesUniformLocations) { 
        axesUniformLocations[key] = gl.getUniformLocation(program, key);
    }
}
function SetAxesUniforms(gl) {
    gl.uniform3f(axesUniformLocations["iOriginOffset"], graphOriginOffset.x, graphOriginOffset.y, graphOriginOffset.z)
    gl.uniform2f(axesUniformLocations["iResolution"], gl.canvas.width, gl.canvas.height);
    gl.uniform3f(axesUniformLocations["iCamPos"], cameraPos.x, cameraPos.y, cameraPos.z);
    gl.uniform3f(axesUniformLocations["iCamTar"], cameraTar.x, cameraTar.y, cameraTar.z);
    gl.uniformMatrix3fv(axesUniformLocations["iCamMat"], true, cameraMatrix.mat);
    gl.uniform1i(axesUniformLocations["iProjectionID"], projection);
}