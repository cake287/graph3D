class Vec3 {
    constructor(a, b, c) {
        if (b != undefined) {
            this.x = a;
            this.y = b;
            this.z = c;
        } else {
            if (a.x != undefined) {
                this.x = a.x;
                this.x = a.y;
                this.x = a.z;
            } else if (a.length === 3) {
                this.x = a[0];
                this.y = a[1];
                this.z = a[2];
            }
            
        }
    }
    
    SetComp(dim, val) {
        switch (dim) {
            case 0:
                this.x = val;
                break;
            case 1:
                this.y = val;
                break;
            case 2:
                this.z = val;
                break;
            default:
                return null;
        }
        return this;
    }

    GetComp(dim) {
        switch (dim) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                return null;
        }
    }

    InBounds(a) {
        if (a.x == undefined)
            return this.x <= a && this.x >= -a && this.y <= a && this.y >= -a && this.z <= a && this.z >= -a;
        else 
            return this.x <= a.x && this.x >= -a.x && this.y <= a.y && this.y >= -a.y && this.z <= a.z && this.z >= -a.z;
    }

    // static Equals(a, b, tol) {
    //     let c = Vec3.Abs(Vec3.Sub(a, b));
    //     return c.x < tol && c.y < tol && c.z < tol;
    // }

    static Add(a, b) {
        return new Vec3(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z
        );
    }
    static Sub(a, b) {
        return new Vec3(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z
        );
    }
    static Mul(a, b) {
        return new Vec3(
            a.x * b.x,
            a.y * b.y,
            a.z * b.z
        );
    }
    static Div(a, b) {
        return new Vec3(
            a.x / b.x,
            a.y / b.y,
            a.z / b.z
        );
    }
    static ScalarMul(a, b) {
        return new Vec3(
            a * b.x,
            a * b.y,
            a * b.z
        );
    }

    static Min(a, b) {
        return new Vec3(
            Math.min(a.x, b.x),
            Math.min(a.y, b.y),
            Math.min(a.z, b.z),
        );
    }

    static Max(a, b) {
        return new Vec3(
            Math.max(a.x, b.x),
            Math.max(a.y, b.y),
            Math.max(a.z, b.z),
        );
    }

    static Abs(a) {
        return new Vec3(
            Math.abs(a.x),
            Math.abs(a.y),
            Math.abs(a.z)
        );
    }

    static Length(a) {
        return Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
    }

    static Normalise(a) {
        let length = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
        return new Vec3(
            a.x / length,
            a.y / length,
            a.z / length
        );
    }

    static Cross(a, b) {
        return new Vec3(
            a.y*b.z - a.z*b.y,
            a.z*b.x - a.x*b.z,
            a.x*b.y - a.y*b.x
        );
    }

    static Dot(a, b) {
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }
}
