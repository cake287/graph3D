const horizontalMouseSpeed = 5;
const verticalMouseSpeed = 5;

let startCameraPos = new Vec3(8, 0, 0);
let cameraPos = new Vec3(0, 0, 0);
let cameraTar = new Vec3(0, 0, 0);
let zoom = 1;
let graphOriginOffset = new Vec3(0, 0, 0);

let zRotation = 0;
let yRotation = 0;
let zoomLevel = 0;

function resetCamera(preserveRotation) {
	if (preserveRotation == false || preserveRotation == undefined) {	
		zRotation = 0.25;
		yRotation = -1;
		cameraPos = new Vec3(0, 0, 0);
		cameraTar = new Vec3(0, 0, 0);
	}
	zoomLevel = 1;
	graphOriginOffset = new Vec3(0, 0, 0);
	updateCamera();
}