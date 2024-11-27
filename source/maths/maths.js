function cross3(a, b) {
    return new Vec3(
        a.y*b.z - a.z*b.y,
        a.z*b.x - a.x*b.z,
        a.x*b.y - a.y*b.x
    )
}
function normalise3(a) {
    let length = Math.sqrt(
        a.x*a.x +
        a.y*a.y +
        a.z*a.z
        );
    return Vec3.ScalarMul(1 / length, a);
}

function clamp(x, lower, upper) {
    return Math.min(
        Math.max(x, lower),
        upper
    );
}