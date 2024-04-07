function GetGridData(renderAxes, frame) {
    class GridLine {
        constructor(source, dir) {
            this.source = source;
            this.dir = dir;
        }
    }
    let inverseCamMatrix = Mat3.Inverse(cameraMatrix);

    const gridLength = 3.2;
    const gridLinesBasis = [
        new GridLine(
            new Vec3(1, 0, 0),
            new Vec3(0, 0, 1)
        ),
        new GridLine(
            new Vec3(0, 0, 1),
            new Vec3(1, 0, 0)
        )
    ];

    
    let gridGap = 1 / zoom;
    while (gridGap < 0.4)
        gridGap *= 2;

    while (gridGap > 1)
        gridGap /= 2;

    let gridLines = [];

    function addGridLine(basis, sourceScalar) {
        let minorDimensions = Vec3.Abs(Vec3.Sub(gridLinesBasis[basis].dir, new Vec3(1, 1, 1)));

        let source = Vec3.ScalarMul(sourceScalar, gridLinesBasis[basis].source);

        source = Vec3.Add(
            source, 
            Vec3.Mul(
                minorDimensions,
                new Vec3(
                    graphOriginOffset.x % gridGap,
                    graphOriginOffset.y,
                    graphOriginOffset.z % gridGap
                )
            )
        );

        if (
            source.InBounds(gridLength) && 
            !( // don't draw the grid line if it's 
                renderAxes && 
                (
                    // if the grid line is parallel to the x axis, and source.z == graphOriginOffset.z
                    (renderEachAxis[0] && 
                        gridLinesBasis[basis].dir.x == 1 && 
                        Math.abs(source.z - graphOriginOffset.z) < gridGap / 10) || 

                    // if the grid line is parallel to the z axis, and source.x == graphOriginOffset.x
                    (renderEachAxis[2] && 
                        gridLinesBasis[basis].dir.z == 1 && 
                        Math.abs(source.x - graphOriginOffset.x) < gridGap / 10)
                )
            )
        )
            gridLines.push(
                new GridLine(
                    source,
                    gridLinesBasis[basis].dir
                )
            );
    }


    let gridMax = (Math.ceil(gridLength / gridGap) + 0.01) * gridGap;
    for (let i = 0; i < gridLinesBasis.length; i++) {
        for (let j = 0; j <=  gridMax; j += gridGap)
            addGridLine(i, j);
        for (let j = 0; j >= -gridMax; j -= gridGap)
            addGridLine(i, j);
    }
    
    let tris = [];
    let dirs = [];
    let points = [];
    let lineTypes = [];
    for (let i = 0; i < gridLines.length; i++) {
        let linePoints = [
            Vec3.Sub(
                gridLines[i].source,
                Vec3.ScalarMul(gridLength, gridLines[i].dir)
                ),

            Vec3.Add(
                gridLines[i].source,
                Vec3.ScalarMul(gridLength, gridLines[i].dir)
                ),
        ];

        let line = new Line(
            GetScreenCoord(linePoints[0], inverseCamMatrix),
            GetScreenCoord(linePoints[1], inverseCamMatrix),
            0.003
        );

        let lineTris = line.GetTriangles();
        for (let j = 0; j < lineTris.length; j++) {
            tris.push(lineTris[j]);
            for (let k = 0; k < 3; k++) {
                points.push(gridLines[i].source.x);
                points.push(gridLines[i].source.y);
                points.push(gridLines[i].source.z);

                dirs.push(gridLines[i].dir.x);
                dirs.push(gridLines[i].dir.y);
                dirs.push(gridLines[i].dir.z);

                lineTypes.push(2);
            }
        }
    }

    return {
        triangles: tris,
        directions: dirs,
        points: points,
        lineTypes: lineTypes
    };
}