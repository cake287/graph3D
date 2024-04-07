function GetScreenCoord(sceneCoord, inverseCamMatrix) {
    // it's an optional argument so the inverse only has to be calculated once if it's being repeated
    if (inverseCamMatrix == undefined)
        inverseCamMatrix = Mat3.Inverse(cameraMatrix);


    if (projection == PERSPECTIVE) {
        let rayDirection = Vec3.Sub(sceneCoord, cameraPos);
        let screenPos = Mat3.VecMul(inverseCamMatrix, rayDirection);

        // z coord needs to be focalLength. multiply by focalLength / screenPos.z to obtain this.
        screenPos = Vec3.ScalarMul(focalLength / screenPos.z, screenPos); 
        return new Vec2(screenPos.x, screenPos.y);
    } else if (projection == ORTHOGRAPHIC) {
        const orthoScale = 5;
        let rayDir = Vec3.Sub(cameraTar, cameraPos);
        let camRight = Vec3.Normalise(Vec3.Cross(rayDir, new Vec3(0, 1, 0)));
        let camUp = Vec3.Normalise(Vec3.Cross(camRight, rayDir));
    
        let screenPos = new Vec2(
            Vec3.Dot(sceneCoord, camRight),
            Vec3.Dot(sceneCoord, camUp),
            );

        return Vec2.ScalarMul(1 / orthoScale, screenPos);
    }
    return null;
}
