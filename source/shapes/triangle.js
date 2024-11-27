class Triangle {
    constructor(a, b, c) {
        this.verts = [];
        this.verts.push(new Vec2(a.x, a.y));
        this.verts.push(new Vec2(b.x, b.y));
        this.verts.push(new Vec2(c.x, c.y));
    }

    static CreatePosArray(triangles, aspectRatio) {
        let posArray = [];
        for (let t = 0; t < triangles.length; t++) {
            for (let v = 0; v < triangles[t].verts.length; v++) {
                posArray.push(triangles[t].verts[v].x / aspectRatio);
                posArray.push(triangles[t].verts[v].y);
            }
        }
        return posArray;
    }
}