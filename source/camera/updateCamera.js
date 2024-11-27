function zoomLevelToZoom(level) {
	// zoom = exp(0.0625 * level)
	return Math.exp(level * 0.0625);
}
function zoomToZoomLevel(z) {
	// level = ln(zoom) / 0.0625
	return Math.log(z) / 0.0625;
}

function updateCamera() {
	zoom = zoomLevelToZoom(zoomLevel);

	let temp = rotateZO(startCameraPos, zRotation, cameraTar);
	cameraPos = rotateYO(temp, yRotation, cameraTar);
	
	UpdateCameraMatrix();
}