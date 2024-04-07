let rotMainMove = true; // true if left click rotates scene, false if left click pans scene
let tempOrtho = false;
let tempHideGrid = false;

function cameraMouseListeners(listenerObj) {
	let lastMouse = new Vec2(0, 0);

	function persp() {
		if (tempOrtho) {			
			tempOrtho = false;
			projection = PERSPECTIVE;
		}
	}
	function ortho() {
		if (projection == PERSPECTIVE) {
			tempOrtho = true;
			projection = ORTHOGRAPHIC;
		}
	}
	function showGrid() {		
		if (tempHideGrid) {
			tempHideGrid = false;
			renderGrid = true;
		}
	}
	function hideGrid() {
		tempHideGrid = true;
		renderGrid = false;
	}

	function clampZRotation() {
		zRotation = clamp(zRotation, -Math.PI * 0.5 + 0.0001, Math.PI * 0.5 - 0.0001);		
	}


	let mouseType = -1;

	// returns normalised mouse coords (from [0, 0] at bottom left to [1, 1] at top right)
	function getMousePos(e) {
		let rect = listenerObj.getBoundingClientRect();
		let realMouse = new Vec2(
			e.clientX - rect.left,
			rect.height - (e.clientY - rect.top) - 1
		);
		return Vec2.Div(realMouse, new Vec2(rect.width, rect.height));
	}
	function onMouseMove(e) {
		if (mouseType != -1) {
			let thisMouse = getMousePos(e);
			let deltaMouse = Vec2.Sub(thisMouse, lastMouse);

			if (mouseType == 0) {
				yRotation += deltaMouse.x * horizontalMouseSpeed;
				zRotation += deltaMouse.y * verticalMouseSpeed;
				clampZRotation();
				updateCamera();
			} else if (mouseType == 1) {
				panCamera(deltaMouse);
			}

			lastMouse = thisMouse;

			persp();
			showGrid();
		}
	}
	function onMouseDown(e) {
		lastMouse = getMousePos(e);
		mouseType = e.button;
		if (mouseType == 0 && e.shiftKey) {
			mouseType = 1;
		}

		if (mouseType == 0) 
			listenerObj.style.cursor = "grabbing";
		else if (mouseType == 1)		
			listenerObj.style.cursor = "all-scroll";
	}
	function onMouseUp(e) {
		listenerObj.style.cursor = "grab";
		mouseType = -1;
	}
	listenerObj.addEventListener("mousemove", onMouseMove);
	listenerObj.addEventListener("mousedown", onMouseDown);
	listenerObj.addEventListener("mouseup", onMouseUp);

	function onMouseScroll(e) {
		zoomLevel += e.deltaY * 0.01;
		updateCamera();
	}
	listenerObj.addEventListener("wheel", onMouseScroll);


	let isMouseOnOverlay = true;

	function onKeyDown(e) {
		//console.log(e.code);
		switch (e.code) {
			case "ShiftLeft":
			case "ShiftRight":
				listenerObj.style.cursor = "all-scroll";
				break;

			
			case "Numpad1":
				// SetCamLerp(
				// 	(e.ctrlKey || e.altKey) ? Math.PI * 0.5 : -Math.PI * 0.5,
				// 	0,
				// 	false
				// );
				yRotation = (e.ctrlKey || e.altKey) ? Math.PI * 0.5 : -Math.PI * 0.5;
				zRotation = 0;
				ortho();
				hideGrid();
				break;
			case "Numpad3":
				yRotation = (e.ctrlKey || e.altKey) ? 0 : Math.PI;
				zRotation = 0;
				ortho();
				hideGrid();
				break;
			case "Numpad7":
				yRotation = Math.PI;
				zRotation = (e.ctrlKey || e.altKey) ? -0.5 * Math.PI + 0.0001 : 0.5 * Math.PI - 0.0001;
				ortho();
				showGrid();
				break;


			case "Numpad4":
				persp();
				showGrid();
				yRotation -= Math.PI / 12;
				break;
			case "Numpad6":
				persp();
				showGrid();
				yRotation += Math.PI / 12;
				break;
			case "Numpad2":
				persp();
				showGrid();
				zRotation -= Math.PI / 12;
				clampZRotation();
				break;
			case "Numpad8":
				persp();
				showGrid();
				zRotation += Math.PI / 12;
				clampZRotation();
				break;
					

			case "Numpad5":
				projection = projection == PERSPECTIVE ? ORTHOGRAPHIC : PERSPECTIVE;			
				document.getElementById("settingsPerspective").classList.add("settings-toggle-" + (projection == PERSPECTIVE ? "on" : "off"));
				document.getElementById("settingsPerspective").classList.remove("settings-toggle-" + (projection == PERSPECTIVE ? "off" : "on"));
				document.getElementById("settingsOrthographic").classList.add("settings-toggle-" + (projection == ORTHOGRAPHIC ? "on" : "off"));
				document.getElementById("settingsOrthographic").classList.remove("settings-toggle-" + (projection == ORTHOGRAPHIC ? "off" : "on"));
				showGrid();
				break;


		}
		updateCamera();	
	}
	document.addEventListener("keyup", function(e) {
		if (mouseType == -1) // if mouse is up
			listenerObj.style.cursor = "grab";
	});

	document.addEventListener("keydown", function (e) {
		if (isMouseOnOverlay)
			onKeyDown(e);
	});

	listenerObj.addEventListener("mouseenter", function() {
		isMouseOnOverlay = true;
	})
	listenerObj.addEventListener("mouseleave", function() {
		isMouseOnOverlay = false;
	})
}
