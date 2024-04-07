const labelTextureWidth = 250;
const labelTextureHeight = 70;

let currentLabelStrs = [];
let currentLabelTextBounds = [];
let labelsGLtexture = -1;

function genLabelsTextures(gl, strs, fillCols, strokeCols) {
	let strsMatchExistingLabels = true;
	for (let i = 0; i < strs.length; i++)
		if (strs[i] !== currentLabelStrs[i])
			strsMatchExistingLabels = false;


	if (strsMatchExistingLabels)
		return;

	
	//console.log("generating new label textures");
	currentLabelStrs = strs;
	currentLabelTextBounds = [];

	const fontSize = 50;

	let textureData = [];

	let canvas = document.getElementById("textImageCanvas");
	let ctx = canvas.getContext("2d");

	canvas.width = labelTextureWidth;
	canvas.height = labelTextureHeight;

	ctx.font = fontSize.toString() + "px Helvetica";
	ctx.lineWidth = 1;

	let textBounds = [];
	for (let l = 0; l < strs.length; l++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.fillStyle = fillCols[l];
		ctx.fillText(strs[l], 4, fontSize);
		if (strokeCols[l] !== -1) {
			ctx.strokeStyle= strokeCols[l];
			ctx.strokeText(strs[l], 4, fontSize);
		}

		let canvasColours = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		textureData = textureData.concat(Array.from(canvasColours));

		// find the smallest bounding box
		let textLeft = canvas.width - 1;
		//let textTop = 0;//canvas.height - 1; // NOT CROPPING VERTICALLY
		let textRight = 0;
		//let textBottom = canvas.height - 1;//0;
		for (let x = 0; x < canvas.width; x++) {
			for (let y = 0; y < canvas.height; y++) {
				let pixelIndex = x + y*canvas.width;
				if (canvasColours[pixelIndex * 4 + 3] > 0) {
					// if the alpha of the pixel is not 0, adjust bounding box
					textLeft = Math.min(textLeft, x);
					//textTop = Math.min(textTop, y);
					textRight = Math.max(textRight, x);
					//textBottom = Math.max(textBottom, y);
				}
			}
		}
		currentLabelTextBounds.push({
			left: textLeft,
			//top: textTop,
			right: textRight,
			//bottom: textBottom
		});
	}
	textureData = new Uint8Array(textureData);

	gl.activeTexture(gl.TEXTURE0);

	if (labelsGLtexture === -1) {
		labelsGLtexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_3D, labelsGLtexture);
		gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}

	gl.bindTexture(gl.TEXTURE_3D, labelsGLtexture);

	gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, labelTextureWidth, labelTextureHeight, strs.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, 
		textureData
		);
}





function genLabelsTexturesOLD(gl) {
    const fontSize = 50;

	let canvas = document.getElementById("textImageCanvas");
	let ctx = canvas.getContext("2d");

	ctx.font = "50px Helvetica";
    ctx.fillStyle = "red";

	const labelTextureWidth = 38;
	const labelTextureHeight = 38;

	
	let testCanvas = document.getElementById("testCanvas");
	let testCtx = testCanvas.getContext("2d");

	// testCtx.fillStyle = 'purple';
	// testCtx.rect(0, 0, testCanvas.width, testCanvas.height);
	// testCtx.fill();


	let textureDepth = 0;
	let textureData = [];

	function addTextImage(text) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// cropping texture to non transparent colours
		ctx.fillText(text, fontSize / 2, fontSize);
		let canvasColours = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		let textLeft = canvas.width - 1;
		let textTop = canvas.height - 1;
		let textRight = 0;
		let textBottom = 0;
		for (let x = 0; x < canvas.width; x++) {
			for (let y = 0; y < canvas.height; y++) {
				let pixelIndex = x + y*canvas.width;
				if (canvasColours[pixelIndex * 4 + 3] > 0) {
					// if the alpha of the pixel is not 0, adjust bounding box
					textLeft = Math.min(textLeft, x);
					textTop = Math.min(textTop, y);
					textRight = Math.max(textRight, x);
					textBottom = Math.max(textBottom, y);
				}
			}
		}
		
		let textWidth = textRight - textLeft;
		let textHeight = textBottom - textTop;
		textLeft -= Math.floor((labelTextureWidth - textWidth) / 2 - 1);
		textTop -= Math.floor((labelTextureHeight - textHeight - 1) / 2);

		let thisTextureData = ctx.getImageData(textLeft, textTop, labelTextureWidth, labelTextureHeight);

		textureData = textureData.concat(Array.from(thisTextureData.data));

		testCanvas.width = thisTextureData.width;
		testCanvas.height = thisTextureData.height;
		testCtx.putImageData(thisTextureData, 0, 0);

        textureDepth++;
	}

    for (let i = 0; i <= 9; i++) {
        addTextImage(i.toString());
    }
    for (let i = 0; i <= 25; i++) {
        addTextImage(String.fromCharCode(97 + i));
    }
	addTextImage("hel");
	//addTextImage(".");

	textureData = new Uint8Array(textureData);
	// for (let i = 0; i < uint8TextureData.length; i++) 
	// 	if (uint8TextureData[i] > 255 || uint8TextureData[i] < 0)
	// 		console.log("s");

	// var buf = gl.createBuffer();
  	// gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, buf);
	// gl.bufferData(gl.PIXEL_UNPACK_BUFFER, new Uint8Array(textureData), gl.STATIC_DRAW);

	gl.activeTexture(gl.TEXTURE0);
	let texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_3D, texture);

	
	gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, labelTextureWidth, labelTextureHeight, textureDepth, 0, gl.RGBA, gl.UNSIGNED_BYTE, 
		textureData
		);

}