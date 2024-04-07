function rotateZ(point, angle) {
    let sinA = Math.sin(angle);
    let cosA = Math.cos(angle);
    return new Vec3(
        cosA * point.x - sinA * point.y,
        sinA * point.x + cosA * point.y,
        point.z
    );
}
function rotateZO(point, angle, origin) {
    let temp = rotateZ(Vec3.Sub(point, origin), 
         angle);
    return Vec3.Add(temp, origin);
}

function rotateY(point, angle) {
    let sinA = Math.sin(angle);
    let cosA = Math.cos(angle);
    return new Vec3(
        cosA * point.x + sinA * point.z,
        point.y,
        -sinA * point.x + cosA * point.z
    );
}
function rotateYO(point, angle, origin) {
    let temp = rotateY(Vec3.Sub(point, origin), 
         angle);
    return Vec3.Add(temp, origin);
}