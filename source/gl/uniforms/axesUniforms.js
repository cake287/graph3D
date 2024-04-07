let axesUniformLocations = {
    "u_originOffset": -1,
    "u_resolution" : -1,
    "u_camPos" : -1,
    "u_camTar" : -1,
    "u_camMat" : -1,
    "u_projectionID" : -1
};
function GetAxesUniforms(gl, program) {
    for(let key in axesUniformLocations) { 
        axesUniformLocations[key] = gl.getUniformLocation(program, key);
    }
}
function SetAxesUniforms(gl) {
    gl.uniform3f(axesUniformLocations["u_originOffset"], graphOriginOffset.x, graphOriginOffset.y, graphOriginOffset.z)
    gl.uniform2f(axesUniformLocations["u_resolution"], gl.canvas.width, gl.canvas.height);
    gl.uniform3f(axesUniformLocations["u_camPos"], cameraPos.x, cameraPos.y, cameraPos.z);
    gl.uniform3f(axesUniformLocations["u_camTar"], cameraTar.x, cameraTar.y, cameraTar.z);
    gl.uniformMatrix3fv(axesUniformLocations["u_camMat"], true, cameraMatrix.mat);
    gl.uniform1i(axesUniformLocations["u_projectionID"], projection);
}