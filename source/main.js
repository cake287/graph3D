function main() {
	let viewport = document.getElementById("viewport");
	let canvas = document.getElementById("glCanvas");
	let vpOverlay = document.getElementById("viewportOverlay");

	canvas.width = viewport.offsetWidth;
	canvas.height = viewport.offsetHeight;
	let gl = glInit(canvas);
	if (gl == false) {
		console.log("gl null");
		return;
	}


	updateEPWidth();
	EPResizerListeners();
	//panRotButtonListeners();
	document.getElementById("renderButton").addEventListener("click", function() { drawEquations(gl); });
	document.getElementById("eh-add").addEventListener("click", function() { addElement(gl); });
	document.getElementById("ehClose").addEventListener("click", function() { closeElementPane(); })
	document.getElementById("vpShowEP").addEventListener("click", function() { showElementPane(); })

	addElement();
	const startEqs = [
		"xyz=cosx",
		"1=max(|xy|, max(|xz|, |yz|))",
		"yz=x(y-z)",
		"zy=5cos(xy+z)",
		"(2x^2-y^2)(2y^2-z^2)(2z^2-x^2)=(x^2+y^2+z^2-1)^2",
		"3y^3=xzcos(xyz+t)",
		"cos(x^2+y^2+z^2)=0.5",
		"4(\u03C6^2*x^2-y^2)(\u03C6^2*y^2-z^2)(\u03C6^2*z^2-x^2)=(1+2*\u03C6)(x^2+y^2+z^2-1)^2",
	];
	document.getElementById("elementInput0").value = startEqs[5];


	// i didn't write element hiding to be triggered programmatically. currently bodging this for a better demo
	addElement();
	let row = document.getElementById("elementInput1");
	row.value = "y=x^2-z^2";
	let rowIcon = row.parentElement.parentElement.querySelector(".el-icon");
	hideElement({target: rowIcon});

	addElement();
	row = document.getElementById("elementInput2");
	row.value = startEqs[1];
	rowIcon = row.parentElement.parentElement.querySelector(".el-icon");
	hideElement({target: rowIcon});

	addElement();
	row = document.getElementById("elementInput3");
	row.value = startEqs[4];
	rowIcon = row.parentElement.parentElement.querySelector(".el-icon");
	hideElement({target: rowIcon});



	drawEquations(gl);


	//const barthSextic = "4(1.61803^2*x^2-y^2)(1.61803^2*y^2-z^2)(1.61803^2*z^2-x^2)-(1+2*1.61803)(x^2+y^2+z^2-1)^2=0";
	//const batchSextic = "4(φ^2*x^2-y^2)(φ^2*y^2-z^2)(φ^2*z^2-x^2)=(1+2*φ)(x^2+y^2+z^2-1)^2";
	


	// performance test
	// addElement();
	// document.getElementById("elementInput1").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput2").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput3").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput4").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput5").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput6").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput7").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput8").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput9").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput10").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput11").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput12").value = "y=cos(|z+ysin(x)|)";
	// addElement();
	// document.getElementById("elementInput13").value = "y=cos(|z+ysin(x)|)";


	viewportOverlayListeners();
	settingsListeners();
	cameraMouseListeners(vpOverlay);
	resetCamera();
		
	//surfacePrograms.push(createProgram(gl, surfacesVS, surfacesFS));

	let axesProgram = createProgram(gl, axesVS, axesFS);
	GetAxesUniforms(gl, axesProgram);

	let posBuffer = gl.createBuffer();
	
	let lineDirBuffer = gl.createBuffer();
	let linePointBuffer = gl.createBuffer();
	let lineTypeBuffer = gl.createBuffer();

	// fill view space
	const fillTris = [
		new Triangle(
			new Vec2(-1, -1),
			new Vec2(1, -1),
			new Vec2(-1, 1)
		),
		new Triangle(
			new Vec2(1, -1),
			new Vec2(-1, 1),
			new Vec2(1, 1)
		)
	];

	
	let fpsElement = document.getElementById("fps");
	let lastFrameTime = 0;
	let frame = 0;

	function render(time) {		
		let now = time * 0.001;
		let fps = Math.round(1 / (now - lastFrameTime));
		lastFrameTime = now;
		if (frame % 10 == 0) // only update fps every 10th frame
			fpsElement.innerHTML = fps.toString();
		frame++;

		CamLerpStep(now - lastFrameTime);

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);

		if (renderSurfaces) {
			gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer); // set the position buffer as the currently active buffer
			let positions1 = Triangle.CreatePosArray(fillTris, 1);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions1), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(
				0,
				2,
				gl.FLOAT,
				false,
				0, 0
			);
			for (let i = 0; i < surfacePrograms.length; i++) {
				if (document.getElementById("element" + i.toString()).getAttribute("data-visible") == "true") {

					gl.useProgram(surfacePrograms[i]);
					GetSurfaceUniforms(gl, surfacePrograms[i]);
					SetSurfaceUniforms(gl, time);
					gl.drawArrays(
						gl.TRIANGLES,
						0,
						fillTris.length * 3
					);
				}
			}
		}
		
		if (renderAxes || renderGrid) {
			gl.useProgram(axesProgram);
			SetAxesUniforms(gl);

			let axisData = renderAxes ? GetAxesData(			frame) : { triangles: [], directions: [], points: [], lineTypes: [] };
			let gridData = renderGrid ? GetGridData(renderAxes, frame) : { triangles: [], directions: [], points: [], lineTypes: [] };;

			let linesData = {
				triangles: 	axisData.triangles.concat(gridData.triangles),
				directions:	axisData.directions.concat(gridData.directions),
				points: 	axisData.points.concat(gridData.points),
				lineTypes: 	axisData.lineTypes.concat(gridData.lineTypes),
			}

			// if (frame == 10) {
			// 	console.log(linesData);	
			// }

			gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer); // set the position buffer as the currently active buffer
			let positions2 = Triangle.CreatePosArray(linesData.triangles, viewport.offsetWidth / viewport.offsetHeight);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(
				0,
				2,
				gl.FLOAT,
				false,
				0, 0
			);

			gl.bindBuffer(gl.ARRAY_BUFFER, lineDirBuffer); // set the position buffer as the currently active buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesData.directions), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(1);
			gl.vertexAttribPointer(
				1,
				3,
				gl.FLOAT,	
				false,
				0, 0
			);

			gl.bindBuffer(gl.ARRAY_BUFFER, linePointBuffer); // set the position buffer as the currently active buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesData.points), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(2);
			gl.vertexAttribPointer(
				2,
				3,
				gl.FLOAT,	
				false,
				0, 0
			);

			gl.bindBuffer(gl.ARRAY_BUFFER, lineTypeBuffer); // set the position buffer as the currently active buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(linesData.lineTypes), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(3);
			gl.vertexAttribIPointer(
				3,
				1,
				gl.INT,	
				false,
				0, 0
			);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			gl.drawArrays(
				gl.TRIANGLES,
				0,
				linesData.triangles.length * 3
			);
		
		}
				

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}
oldWindowWidth = window.innerWidth;
window.onresize = onWindowResize;
window.onload = main;
