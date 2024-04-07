let renderSurfaces = true;
let renderAxes = true;
let renderArrows = false;
let renderGrid = true;
let renderLabels = true;


const PERSPECTIVE = 100;
const ORTHOGRAPHIC = 200;
let projection = PERSPECTIVE;

let angleScale = 1;

const baseLimit = 3;

function getCamDataFromBoundsInput(dimension) {
    // find graphOriginOffset and zoom from given lower and upper bounds
    
    // x lower = zoom * (-3 - offset.x)
    // x upper = zoom * ( 3 - offset.x)
    
    // lower/zoom = -3 - offset.x
    // offset.x = -3 - lower/zoom	[1]
    
    // upper/zoom = 3 - offset.x
    // offset.x = 3 - upper/zoom	[2]
    
    // [1] = [2]:
    // -3 - lower/zoom = 3 - upper/zoom
    // upper/zoom - lower/zoom = 2*3
    // zoom = (upper - lower) / (2*3)


    let lower = parseFloat(document.getElementsByClassName("settings-axis-bound-lower")[dimension].value);
    let upper = parseFloat(document.getElementsByClassName("settings-axis-bound-upper")[dimension].value);

    if (!isNaN(lower) && !isNaN(upper) && lower < upper) {
        let newZoom = (upper - lower) / (2 * baseLimit);
        zoomLevel = zoomToZoomLevel(newZoom);

        graphOriginOffset.SetComp(dimension, -baseLimit - lower / newZoom);
        updateCamera();

        let changeDimensions = [true, true, true];
        changeDimensions[dimension] = false;
        setSettingBoundsText(changeDimensions);
    }
}


function setSettingBoundsText(changeDimensions) {
    for (let dimension = 0; dimension <= 2; dimension++) {
        if (changeDimensions[dimension])
            for (let bound = 0; bound <= 1; bound++) {
                let value = (bound * 2 - 1) * baseLimit; // -baselimit for lower, +baselimit for upper
                value -= graphOriginOffset.GetComp(dimension);
                value *= zoom;
                document.getElementsByClassName("settings-axis-bound")[dimension * 2 + bound].value = value.toPrecision(3);
            }
    }
}

function settingsListeners() {
    document.getElementById("settingsAxes").checked = true;
    document.getElementById("settingsXAxis").checked = true;
    document.getElementById("settingsYAxis").checked = true;
    document.getElementById("settingsZAxis").checked = true;

    document.getElementById("settingsArrows").checked = false;
    document.getElementById("settingsGrid").checked = true;
    
    document.getElementById("settingsAxes").addEventListener("change", function(e) {
        renderAxes = e.target.checked;
        document.getElementById("settingsXAxis").disabled = !e.target.checked;
        document.getElementById("settingsYAxis").disabled = !e.target.checked;
        document.getElementById("settingsZAxis").disabled = !e.target.checked;
    });
    document.getElementById("settingsXAxis").addEventListener("change", function(e) {
        renderEachAxis[0] = e.target.checked;
    });
    document.getElementById("settingsYAxis").addEventListener("change", function(e) {
        renderEachAxis[1] = e.target.checked;
    });
    document.getElementById("settingsZAxis").addEventListener("change", function(e) {
        renderEachAxis[2] = e.target.checked;
    });


    document.getElementById("settingsXLowerbound").addEventListener("input", function(e) {
        getCamDataFromBoundsInput(0);
    });
    document.getElementById("settingsXUpperbound").addEventListener("input", function(e) {
        getCamDataFromBoundsInput(0);
    });
    document.getElementById("settingsYLowerbound").addEventListener("input", function(e) {
        getCamDataFromBoundsInput(1);
    });
    document.getElementById("settingsYUpperbound").addEventListener("input", function(e) {
        getCamDataFromBoundsInput(1);
    });
    document.getElementById("settingsZLowerbound").addEventListener("input", function(e) {
        getCamDataFromBoundsInput(2);
    });
    document.getElementById("settingsZUpperbound").addEventListener("input", function(e) {
        getCamDataFromBoundsInput(2);
    });


    document.getElementById("settingsArrows").addEventListener("change", function(e) {
        renderArrows = e.target.checked;
    });
    document.getElementById("settingsGrid").addEventListener("change", function(e) {
        renderGrid = e.target.checked;
    });


    let settingsShown = false;
    function showSettings() {
        settingsShown = true;
        setSettingBoundsText([true, true, true]);
        document.getElementById("settingsMenu").style.display = "block";
    }
    function hideSettings() {
        settingsShown = false;
        document.getElementById("settingsMenu").style.display = "none";

    }

    document.getElementById("vpSettings").addEventListener("click", function() { 
        if (!settingsShown)
            showSettings();
        else 
            hideSettings();
    });
    document.addEventListener("mousedown", function(e) {
        if (!document.getElementById("settingsMenu").contains(e.target) && !document.getElementById("vpSettings").contains(e.target))
            hideSettings();
    });
    document.addEventListener("keydown", function(e) {
        if (e.code == "Escape")
            hideSettings();
    });
    document.addEventListener("wheel", function(e) {
        if (settingsShown)
            setSettingBoundsText([true, true, true]);
    });
    // document.addEventListener("mousemove", function(e) {
    //     if (settingsShown)
    //         setSettingBoundsText([true, true, true]);
    // })



    function toggleOn(button) {
        button.classList.add("settings-toggle-on");
        button.classList.remove("settings-toggle-off");
    }
    function toggleOff(button) {
        button.classList.add("settings-toggle-off");
        button.classList.remove("settings-toggle-on");
    }

    let toggleButtons = document.getElementsByClassName("settings-toggle");
    for (let i = 0; i < toggleButtons.length; i++) {
        toggleButtons[i].addEventListener("click", function(e) {
            let togglesInGroup = e.target.parentNode.getElementsByClassName("settings-toggle-on");
            for (let i = 0; i < togglesInGroup.length; i++) {
                toggleOff(togglesInGroup[i]);
            }
            toggleOn(e.target);
        });
    }


    document.getElementById("settingsPerspective").addEventListener("click", function() {
        projection = PERSPECTIVE;
    });
    document.getElementById("settingsOrthographic").addEventListener("click", function() {
        projection = ORTHOGRAPHIC;
    });

    document.getElementById("settingsRadians").addEventListener("click", function() {
        angleScale = 1;
    });
    document.getElementById("settingsDegrees").addEventListener("click", function() {
        angleScale = Math.PI / 180;
    });

    //showSettings();
}