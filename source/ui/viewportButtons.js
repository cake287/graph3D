function viewportOverlayListeners() {
    let fpsShown = false;
    document.getElementById("fpsCounter").addEventListener("click", function(e) {
        fpsShown = !fpsShown;
        document.getElementById("fpsCounter").style.opacity = fpsShown ? "100%" : "0";
    });

    function changeZoom(delta) {
        zoomLevel += 5 * delta;
        updateCamera();
    }
    document.getElementById("vpZoomIn").addEventListener("click", function() { 
        changeZoom(-1);
     });
    document.getElementById("vpZoomOut").addEventListener("click", function() { 
        changeZoom(1);
    });

    document.getElementById("vpHome").addEventListener("click", function() {
        resetCamera(true);
    });


    
}