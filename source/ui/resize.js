function resizeGLCanvas() {
    let canvas = document.getElementById("glCanvas");
    let gl = canvas.getContext("webgl2");
    gl.canvas.width = canvas.clientWidth;
    gl.canvas.height = canvas.clientHeight;
}

let oldWindowWidth = 0;
function onWindowResize() {
    let epWidthPreportion = epWidth / oldWindowWidth;
    updateEPWidth(epWidthPreportion * window.innerWidth);
    oldWindowWidth = window.innerWidth;
    resizeGLCanvas();
}
