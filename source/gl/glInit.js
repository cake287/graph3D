function glInit(canvas) {
    let gl = canvas.getContext("webgl2", { antialias: true });
    if (!gl) {
        alert("WebGL failed to initialise. Your WebGL version may not be supported: this program uses WebGL 2.");
        return false;
    }

    console.log("WebGL version: " + gl.getParameter(gl.VERSION));
    console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    console.log("WebGL vendor: " + gl.getParameter(gl.VENDOR));

    gl.clearColor(0.1, 0.1, 0.1, 1.0); // dark grey background shown if program creation fails
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
}
