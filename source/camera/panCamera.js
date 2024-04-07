function panCamera(mouse) {
	let cameraToOrigin = Vec3.Sub(new Vec3(0, 0, 0), cameraPos);
	let horizontalPan = normalise3(cross3(new Vec3(0, 1, 0), cameraToOrigin));
	let verticalPan = normalise3(cross3(horizontalPan, cameraToOrigin));

	let pan = Vec2.Mul(mouse, new Vec2(horizontalMouseSpeed, verticalMouseSpeed));

	graphOriginOffset = Vec3.Add(graphOriginOffset, Vec3.ScalarMul(-pan.x, horizontalPan));
	graphOriginOffset = Vec3.Add(graphOriginOffset, Vec3.ScalarMul(-pan.y, verticalPan));

	updateCamera();
}
