class Vec2 {
    constructor(a, b) {
        if (b == undefined) {
            this.x = a.x;
            this.y = a.y;
        } else {
            this.x = a;
            this.y = b;
        }
    }

    static Normalise(a) {
        let length = Math.sqrt(a.x*a.x + a.y*a.y);
        return new Vec2(
            a.x / length,
            a.y / length
        );
    }

    static Perpendicular(a) {
        return new Vec2(
            a.y,
            -a.x
        );
    }

    static Add(a, b) {
        return new Vec2(
            a.x + b.x,
            a.y + b.y
        );
    }
    static Sub(a, b) {
        return new Vec2(
            a.x - b.x,
            a.y - b.y
        );
    }
    static Mul(a, b) {
        return new Vec2(
            a.x * b.x,
            a.y * b.y
        );
    }
    static Div(a, b) {
        return new Vec2(
            a.x / b.x,
            a.y / b.y
        );
    }
    static ScalarMul(a, b) {
        return new Vec2(
            a * b.x,
            a * b.y
        );
    }
}
