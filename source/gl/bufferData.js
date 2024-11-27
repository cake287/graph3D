function SetBufferData(gl, buffer, data, unbindAfter) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // set the position buffer as the currently active buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    if (unbindAfter)
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
}