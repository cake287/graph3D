const focalLength = 1.5;
let cameraMatrix = null;

function UpdateCameraMatrix() {
    let a = Vec3.Normalise(Vec3.Sub(cameraTar, cameraPos));
    let b = Vec3.Normalise(Vec3.Cross(a, new Vec3(0, 1, 0)));
    let c = Vec3.Normalise(Vec3.Cross(b, a));
    cameraMatrix = new Mat3(b, c, a);
}