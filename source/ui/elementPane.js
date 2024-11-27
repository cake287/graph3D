let epWidth = 400;
function updateEPWidth(newWidth) {
    if (newWidth != undefined)
        epWidth = newWidth;       

    document.body.style.setProperty('--ePWidth', epWidth.toString() + "px");
    resizeGLCanvas();
}

function EPResizerListeners() {

    let resizerObj = document.getElementById("ePResizer");
    
    let resizing = false;
	let lastMouseX = 0;
	resizerObj.addEventListener("mousedown", function(e) {
		lastMouseX = e.clientX;
        resizing = true;
    });
	document.documentElement.addEventListener("mouseup", function(e) {
        resizing = false;
    });    
	document.documentElement.addEventListener("mousemove", function(e) {
        if (resizing) {
            let newEPwidth = Math.max(
                    Math.min(e.clientX, document.documentElement.offsetWidth * 0.8),
                    200
            );

            updateEPWidth(newEPwidth);
            lastMouseX = e.clientX;
        }
    });

}

let lastEPWidth = 0;
function closeElementPane() {
    document.getElementById("elementPane").style.visibility = "hidden";
    document.getElementById("vpShowEP").style.display = "block";
    lastEPWidth = parseInt((document.body.style.getPropertyValue("--ePWidth")).replace("px", ""));
    updateEPWidth(0);
}

function showElementPane() {
    document.getElementById("elementPane").style.visibility = "visible";
    document.getElementById("vpShowEP").style.display = "none";
    updateEPWidth(lastEPWidth);
}