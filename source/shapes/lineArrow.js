class Line {
    constructor(start, end, thickness) {
        this.start = start;
        this.end = end;
        this.thickness = thickness;
    }

    GetVecs() {
        let lengthVec = Vec2.Sub(this.end, this.start);
        let widthVec = Vec2.ScalarMul(
            this.thickness / 2,
            Vec2.Normalise(Vec2.Perpendicular(lengthVec))
        );
        return {
            length: lengthVec,
            width: widthVec
        }
    }

    GetTriangles() {
        let vecs = this.GetVecs();
                
        let vert1 = Vec2.Add(this.start, vecs.width);
        let vert2 = Vec2.Sub(this.start, vecs.width);
        let vert3 = Vec2.Add(this.end, vecs.width);
        let vert4 = Vec2.Sub(this.end, vecs.width);
        
        return [
            new Triangle(vert1, vert2, vert3),
            new Triangle(vert2, vert3, vert4)
        ];
    }
}

class Arrow {
    constructor(start, end, thickness, headThickness, headDepth, drawHead1, drawHead2) {
        this.start = start;
        this.end = end;
        this.thickness = thickness;
        this.headThickness = headThickness;
        this.headDepth = headDepth;
        this.drawHead1 = drawHead1;
        this.drawHead2 = drawHead2;
    }

    GetTriangles() {
        let vecs = (new Line(this.start, this.end, this.thickness)).GetVecs();
        let shaftStart = this.start;
        let shaftEnd = this.end;

        let triangles = [];
        let headVertOffset = Vec2.ScalarMul(this.headThickness / 2, Vec2.Normalise(vecs.width));

        
        if (this.drawHead1) {
            shaftStart = Vec2.Add(this.start, Vec2.ScalarMul(this.headDepth, Vec2.Normalise(vecs.length)))
            let vert1 = Vec2.Add(shaftStart, headVertOffset);
            let vert2 = Vec2.Sub(shaftStart, headVertOffset);
            triangles.push(new Triangle(vert1, vert2, this.start));
        }

        if (this.drawHead2) {
            shaftEnd = Vec2.Sub(this.end, Vec2.ScalarMul(this.headDepth, Vec2.Normalise(vecs.length)));
            let vert1 = Vec2.Add(shaftEnd, headVertOffset);
            let vert2 = Vec2.Sub(shaftEnd, headVertOffset);
            triangles.push(new Triangle(vert1, vert2, this.end));
        }
        triangles = triangles.concat((new Line(shaftStart, shaftEnd, this.thickness)).GetTriangles());

        return triangles;
    }

    static GetTrianglesFromArray(arrows) {
        let triangles = [];
		for (let i = 0; i < arrows.length; i++) 
			triangles = triangles.concat(arrows[i].GetTriangles());
        return triangles;
    }
}