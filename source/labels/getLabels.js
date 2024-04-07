function getLabels(gl, frame) {
    let labels = [];

    function addLabel(pos, str, fillCol, strokeCol) {
        labels.push({
            pos: pos,
            str: str,
            fillCol: fillCol,
            strokeCol: strokeCol,
            id: labels.length
        });
    }

    // if (frame % 300 == 1)
    //     console.log(labels);
    
    const axisLabelDist = axisLength + 0.2;
    addLabel(new Vec3(axisLabelDist, 0, 0), "x", "#F00", "black");
    addLabel(new Vec3(0, axisLabelDist, 0), "y", "#0F0", "black");
    addLabel(new Vec3(0, 0, axisLabelDist), "z", "#00F", "black");


    let gridUnit = 1;
    let gridGap = 1 / zoom; // the gap between grid lines in scene units (not graph units)
    while (gridGap < 0.4) {
        gridGap *= 2;
        //gridUnit /= 2;
    }
    while (gridGap > 1) {
        gridGap /= 2;
        //gridUnit *= 2;
    }
    // if (frame % 200 == 0) {
    //     console.log(gridUnit);  
    //     console.log(""); 
    // } 

    function numToString(num) {
        return num.toPrecision(3);
    }


    // //for (let dim = 0; dim < 3; dim++) { // for each dimension
        // for (let i = 0; i <= 3.2 / gridGap; i++) {
        //     let val = gridUnit * i;
        //     // if (frame % 200 == 0)
        //     //     console.log(i);
        //     addLabel(new Vec3(i * gridGap, 0, 0), numToString(val), "black", -1);
        // }
    // //}

    console.log(3.2 / gridGap);
    for (let i = 0; i < 3.2 / gridGap; i++) {
        // console.log(i);
        addLabel(new Vec3(i, 0, 0), numToString(i), "black", -1);
    }

    // let i = 0;
    // while (i <= 3.2) {
    //     let val = gridUnit * i;
    //     addLabel(new Vec3(i * gridGap, 0, 0), numToString(val), "black", -1);
    //     i++;
    // }



    // if (frame % 200 == 0)
    //     console.log("");   
    
    
    genLabelsTextures(gl, labels.map(l => l.str), labels.map(l => l.fillCol), labels.map(l => l.strokeCol));



    // sort the labels in order of distance between their pos and the camera
    // the label furthest away appears first in the list, and is thus rendered first
    // this ensures correct blending with transparent parts of the texture, alongside the depth test
    labels.sort((a, b) => 
        Vec3.Length(Vec3.Sub(cameraPos, b.pos)) - Vec3.Length(Vec3.Sub(cameraPos, a.pos))
    );

    const rectTexCoords = [
        new Vec2(0, 0),
        new Vec2(1, 0),
        new Vec2(0, 1),

        new Vec2(1, 0),
        new Vec2(0, 1),
        new Vec2(1, 1)
    ];

    let tris = [];
    let texCoords = [];
    let scenePoints = [];
    let IDs = [];

    for (let l = 0; l < labels.length; l++) {
        let ID = labels[l].id;

        const baseHeight = 0.05;
        const baseWidth = baseHeight * (labelTextureWidth / labelTextureHeight);

        let texBounds = currentLabelTextBounds[ID];
        let texWidth = texBounds.right - texBounds.left;
        //let texHeight = texBounds.bottom - texBounds.top;

        // all labels have the same height on screen but different width
        // this variable describes what proportion of the entire texture contains the label text
        let texWidthProportion = texWidth / labelTextureWidth;

        let screenPos = GetScreenCoord(labels[l].pos);
        let size = new Vec2(baseWidth * texWidthProportion, baseHeight);

        let verts = [
            new Vec2(screenPos.x - size.x, screenPos.y + size.y),
            new Vec2(screenPos.x + size.x, screenPos.y + size.y),
            new Vec2(screenPos.x - size.x, screenPos.y - size.y),
            new Vec2(screenPos.x + size.x, screenPos.y - size.y)
        ];
    
        tris.push(
            new Triangle(
                verts[0],
                verts[1],
                verts[2],
            )
        );
        tris.push(
            new Triangle(
                verts[1],
                verts[2],
                verts[3],
            )
        );

        let normalisedWidth = texWidth / labelTextureWidth;
        //let normalisedHeight = texHeight / labelTextureHeight;
        let normalisedLeft = texBounds.left / labelTextureWidth;
        //let normalisedTop = texBounds.top / labelTextureHeight;

        let thisTexCoords = [];
        for (let i = 0; i < rectTexCoords.length; i++) {
            // crop texture coords to the bounding box of the text

            // (0, 0) -> (normalisedLeft, normalisedTop)
            // (1, 1) -> (normalisedLeft + normalisedWidth, normalisedTop + normalisedHeight)
            
            thisTexCoords.push(
                normalisedLeft + rectTexCoords[i].x * normalisedWidth
            );
            thisTexCoords.push(
                rectTexCoords[i].y
                //normalisedTop + rectTexCoords[i].y * normalisedHeight
            );
        }

        texCoords = texCoords.concat(thisTexCoords);

        for (let i = 0; i < 6; i++) {
            // note we can't just push the value of l here as the labels are sorted by distance
            IDs.push(ID);

            scenePoints.push(labels[l].pos.x);
            scenePoints.push(labels[l].pos.y);
            scenePoints.push(labels[l].pos.z);
        }
    }


    return {
        labelCount: labels.length, 
        triangles: tris,
        texCoords: texCoords,
        scenePoints: scenePoints,
        IDs: IDs
    };
}