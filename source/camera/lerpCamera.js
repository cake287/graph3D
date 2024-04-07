let lerpingCam = false;

let lerpYRotTravel = 0;
let lerpYRotTarget = 0;

let lerpZRotTravel = 0;
let lerpZRotTarget = 0;

let lerpZoomLevelTravel = 0;
let lerpZoomLevelTarget = 0;

let totalLerpTime = 0;



function SetCamLerp(newYRot, newZRot, newZoomLevel, lerpTime) {
    if (lerpTime !== undefined)
        totalLerpTime = lerpTime;
    else
        totalLerpTime = 1;


    if (newYRot === false)
        lerpYRotTravel = 0;
    else {
        lerpYRotTarget = newYRot;
        lerpYRotTravel = lerpYRotTarget - yRotation;
    }

    if (newZRot === false)
        lerpZRotTravel = 0;
    else {
        lerpZRotTarget = newZRot;
        lerpZRotTravel = lerpZRotTarget - zRotation;
    }    

    if (newZoomLevel === false)
        lerpZoomLevelTravel = 0;
    else {
        lerpZoomLevelTarget = newZoomLevel;
        lerpZoomLevelTravel = lerpZoomLevelTarget - zoomLevel;
    }

    lerpingCam = true;
}

function CamLerpStep(timeSinceLastStep) {
    function Equal(a, b) {
        return Math.abs(a - b) < 0.0001;
    }

    if (lerpingCam) {
        let proportionComplete = timeSinceLastStep / totalLerpTime;

        yRotation += lerpYRotTravel * proportionComplete;
        zRotation += lerpZRotTravel * proportionComplete;
        zoomLevel += lerpZoomLevelTravel * proportionComplete;

        if (Equal(yRotation, lerpYRotTarget))
            lerpYRotTravel = 0;
        if (Equal(zRotation, lerpZRotTarget))
            lerpZRotTravel = 0;
        if (Equal(zoomLevel, lerpZoomLevelTarget))
            lerpZoomLevelTravel = 0;

        // if all properties have reached their targets, stop lerping
        if (lerpYRotTravel == 0 && lerpZRotTravel == 0 && lerpZoomLevelTravel == 0)
            lerpingCam = false;
    }
}