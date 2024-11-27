function Det2(a, b, c, d) {
    return a*d - b*c;
}

class Mat3 {
    constructor(a, b, c) {
        if (b == undefined) {
            this.mat = a;
        } else {
            // a, b and c are the column vectors
            this.mat = [
                a.x,    b.x,    c.x,
                a.y,    b.y,    c.y,
                a.z,    b.z,    c.z
            ]
        }
    }

    

    GetColumn(column) { // note - column input is 0 based
        return new Vec3(
            this.mat[0 + column],
            this.mat[3 + column],
            this.mat[6 + column]
        );
        
    }

    static ScalarMul(scalar, matrix) {
        let newMat = [];
        for (let i = 0; i < matrix.mat.length; i++)
            newMat.push(scalar * matrix.mat[i]);

        return new Mat3(newMat);
    }
    
    static VecMul(matrix, vec) {
        let mat = matrix.mat;
        return new Vec3(
            mat[0]*vec.x + mat[1]*vec.y + mat[2]*vec.z,
            mat[3]*vec.x + mat[4]*vec.y + mat[5]*vec.z,
            mat[6]*vec.x + mat[7]*vec.y + mat[8]*vec.z
        );
    }

    static Mul(a, b) {
        return new Mat3(
            Mat3.VecMul(a, b.GetColumn(0)), 
            Mat3.VecMul(a, b.GetColumn(1)), 
            Mat3.VecMul(a, b.GetColumn(2))
        );
    }

    static Det(matrix) {
        let mat = matrix.mat;
        return (
            mat[0]*Det2(mat[4], mat[5], mat[7], mat[8]) +
            mat[1]*Det2(mat[5], mat[3], mat[8], mat[6]) +
            mat[2]*Det2(mat[3], mat[4], mat[6], mat[7])
        )
    }

    static Inverse(matrix) {
        let m = matrix.mat;
        let adjugateTranspose = new Mat3([
            Det2(m[4],m[5],m[7],m[8]), Det2(m[2],m[1],m[8],m[7]), Det2(m[1],m[2],m[4],m[5]), 
            Det2(m[5],m[3],m[8],m[6]), Det2(m[0],m[2],m[6],m[8]), Det2(m[2],m[0],m[5],m[3]),
            Det2(m[3],m[4],m[6],m[7]), Det2(m[1],m[0],m[7],m[6]), Det2(m[0],m[1],m[3],m[4]),
        ]);
        return Mat3.ScalarMul(1 / Mat3.Det(matrix), adjugateTranspose);
    }
    
}