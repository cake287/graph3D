let renderEachAxis = [true, true, true];
const axisLength = 3.5;
function GetAxesData(frame) {
    let inverseCamMatrix = Mat3.Inverse(cameraMatrix);
    let axes = [];
    for (let i = 0; i < renderEachAxis.length; i++) {
        let axis = (new Vec3(0, 0, 0)).SetComp(i, 1);
        if (renderEachAxis[i])
            axes.push(axis);
    }

    let tris = [];
    let dirs = [];
    let points = [];
    let lineTypes = [];
    for (let i = 0; i < axes.length; i++) {
        // minor dimensions is 1 for all components except the axis direction
        // i.e. axis (0, 1, 0) becomes (1, 0, 1)
        let minorDimensions = Vec3.Abs(Vec3.Sub(axes[i], new Vec3(1, 1, 1)));
        let offsetAxis = Vec3.Mul(minorDimensions, graphOriginOffset);

        offsetAxis = Vec3.Max(offsetAxis, new Vec3(-axisLength, -axisLength, -axisLength));
        offsetAxis = Vec3.Min(offsetAxis, new Vec3( axisLength,  axisLength,  axisLength));

        let drawHeads = [false, false];

        if (renderArrows) {
            drawHeads = [
                graphOriginOffset.GetComp(i) > -axisLength + 0.01,
                graphOriginOffset.GetComp(i) <  axisLength - 0.01
            ];
        }

        let axisPoints = [
            Vec3.Add(offsetAxis, Vec3.ScalarMul(-axisLength, axes[i])),
            Vec3.Add(offsetAxis, Vec3.ScalarMul( axisLength, axes[i]))
        ];

        let arrow = new Arrow(
            GetScreenCoord(axisPoints[0], inverseCamMatrix),
            GetScreenCoord(axisPoints[1], inverseCamMatrix),
            0.004,
            0.03, 0.03,
            drawHeads[0],
            drawHeads[1]
        );
        let arrowTris = arrow.GetTriangles();
        for (let j = 0; j < arrowTris.length; j++) {
            tris.push(arrowTris[j]);
            for (let k = 0; k < 3; k++) {
                dirs.push(axes[i].x);
                dirs.push(axes[i].y);
                dirs.push(axes[i].z);

                points.push(0);
                points.push(0);
                points.push(0);

                lineTypes.push(1);
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
    
    