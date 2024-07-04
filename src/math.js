const r = 10; // default digit to round to

/**
 * A class that contains helper methods for math opertaions.
 */
class MathHelper {
    /**
     * Converts a p5 vector object to a column vector
     * @param {p5.Vector} vecToConvert 
     */
    static vec(vecToConvert) {
        return [[vecToConvert.x], [vecToConvert.y], [vecToConvert.z]];
    }

    /**
     * Solve for the roots of a quadratic equation ax^2 + bx + c = 0.
     * Raise error if the equation has negative discriminant or has no solution.
     * @param {Number} a 2nd order coefficient
     * @param {Number} b 1st order coefficient
     * @param {Number} c 0th order coefficient
     * @returns {Array} the solution to the quadratic equation
     */
    static solveQuadratic(a, b, c) {
        if (MathHelper.round(b * b - 4 * a * c) < 0) {
            console.error("The quadratic equation has negative discriminant.");
        }
        if (a == 0) {
            if (b == 0 & c != 0) {
                console.error("The equation is linear but has no solution.");
            }
            return [-c/b, -c/b];
        }
        const delta = Math.sqrt(MathHelper.round(b * b - 4 * a * c));
        const x1 = (-b + delta) / (2 * a);
        const x2 = (-b - delta) / (2 * a);
        return [x1, x2];
    }

    /**
     * Convert an angle to a 2d rotation matrix
     * @param {Number} theta the angle to rotate
     * @returns {Array} the 2-by-2 rotation matrix
     */
    static angleToMatrix(theta) {
        const Q = [
            [Math.cos(theta), -Math.sin(theta)],
            [Math.sin(theta), Math.cos(theta)]
        ];
        return Q;
    }

    /**
     * Given a 2-by-2 orthogonal matrix, return its rotation angle
     * @param {Array} Q the 2-by-2 orthogonal matrix
     * @returns {Number} the angle of rotation
     */
    static matrixToAngle(Q) {
        if (!MathHelper.isOrthogonal2(Q)) {
            console.error("The input is not an orthogonal matrix.");
            return null;
        }
        return Math.atan(Q[1][0] / Q[0][0]);
    }

    /**
     * Compute the eigenvalues of a 2-by-2 matrix
     * @param {Array} mat the matrix to take the eigenvalues
     * @returns the two eigenvalues
     */
    static eigenvalue2(mat) {
        const a = 1;
        const b = -mat[0][0] - mat[1][1];
        const c = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
        return MathHelper.solveQuadratic(a, b, c);
    }

    /**
     * Take the spectral decomposition of a 2-by-2 real symmetric matrix.
     * @param {Array} mat the symmetric matrix to take the spectral decomposition
     * @returns {Array} Q, the eigenbasis; Lambda, the diagonal matrix
     */
    static spectralDecomposition2(mat) {
        if (MathHelper.round(mat[0][1]) != MathHelper.round(mat[1][0])) {
            console.error("The input matrix is not symmetric");
        }
        const eigenval = MathHelper.eigenvalue2(mat);
        const lambda = eigenval[0];
        const eigenmat = [
            [mat[0][0] - lambda, mat[0][1]], 
            [mat[1][0], mat[1][1] - lambda]
        ];
        if (MathHelper.round(eigenmat[0][0]) == 0) {
            const Q = [[1, 0], [0, 1]];
            const Lambda = [[lambda, 0], [0, eigenval[1]]];
            return [Q, Lambda];
        } else {
            const norm = Math.sqrt((eigenmat[0][1] ** 2) / (eigenmat[0][0] ** 2) + 1);
            const Q = [
                [-eigenmat[0][1] / (eigenmat[0][0] * norm), -1 / norm], 
                [1 / norm, -eigenmat[0][1] / (eigenmat[0][0] * norm)]
            ];
            const Lambda = [[lambda, 0], [0, eigenval[1]]];
            return [Q, Lambda];
        }
    }



    /**
     * Take the transpose of a matrix
     * @param {Array} mat the matrix to be transposed
     * @returns {Array} the transposed matrix
     */
    static transpose(mat) {
        const m = mat.length;
        const n = mat[0].length;

        // initialize the new array
        let tMat = new Array(n);
        for (let i = 0; i < n; i++) {
            tMat[i] = new Array(m);
        }

        // populate the values
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                tMat[i][j] = mat[j][i];
            }
        }
        return tMat;
    }

    /**
     * Invert a 2x2 matrix
     * @param {Array} mat matrix to invert
     * @returns {Array} the inverted matrix
     */
    static invert2(mat) {
        const det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
        // check invertibility
        if (det == 0) {
            console.error("Matrix is not invertible");
            return null;
        }
        let inverse = [
            [mat[1][1] / det, -mat[0][1] / det],
            [-mat[1][0] / det, mat[0][0] / det]
        ];
        return inverse;
    }
    
    /**
     * Multiplies two matrices. Raises an error if they cannot be multiplied.
     * @param {Array} mat1 first matrix 
     * @param {Array} mat2 second matrix
     * @returns {Array} the resulting matrix after multiplication
     */
    static matrixMult(mat1, mat2) {
        // calculate the product of two matrices
        // mat1 is m-by-n, mat2 is n-by-k
        // the product should be m-by-k
        const m = mat1.length;
        const n = mat2.length;
        const k = mat2[0].length;
    
        // Check if matrices are valid for multiplication
        if (mat1[0].length != n) {
            console.error("Matrices cannot be multiplied: Invalid dimensions.");
            return null;
        }
    
        // Initialize the result matrix with zeros
        let result = new Array(m);
        for (let i = 0; i < m; i++) {
            result[i] = new Array(k);
        }
    
        // Perform matrix multiplication
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < k; j++) {
                result[i][j] = 0;
                for (let l = 0; l < n; l++) {
                    result[i][j] = result[i][j] + mat1[i][l] * mat2[l][j];
                }
            }
        }
        return result;
    }

    /**
     * Compute the determinant of a 3x3 matrix
     * @param {Array} mat the matrix to compute
     * @returns {Number} the determinant of the matrix
     */
    static det3(mat) {
        const a = mat[0][0] * mat[1][1] * mat[2][2];
        const b = mat[0][0] * mat[1][2] * mat[2][1];
        const c = mat[0][1] * mat[1][0] * mat[2][2];
        const d = mat[0][1] * mat[1][2] * mat[2][0];
        const e = mat[0][2] * mat[1][0] * mat[2][1];
        const f = mat[0][2] * mat[1][1] * mat[2][0];
        return a - b - c + d + e - f;
    }

    /**
     * Check whether a projective transformation fixes the line at infinity
     * @param {Array} T transformation to check
     * @returns {Boolean} true if it is an affine transformation, false otherwise
     */
    static checkAffineTransform(T) {
        const v1 = this.matrixMult(T, [[1], [0], [0]]);
        const v2 = this.matrixMult(T, [[0], [1], [0]]);
        if (v1[2][0] != 0 || v2[2][0] != 0) {
            return false;
        }
        return true;
    }

    /**
     * Apply a projective transformation T on a vector v 
     * @param {Array} T the transformation
     * @param {p5.Vector} v the homogeneous coord of the vector
     * @returns Tv
     */
    static affineTransform(T, v) {
        // apply the projective transformation on the vector
        const vert = this.vec(v);
        const result = this.matrixMult(T, vert);
        const x = result[0][0];
        const y = result[1][0];
        const z = result[2][0];
        return createVector(x, y, z);
    }

    /**
     * Takes in two lists of four points in general position of the projective plane. 
     * Done by solving a linear equation.
     * @param {Array} s the four vertices of the source
     * @param {Array} t the four vertices of the target
     * @returns {Array} the projective transformation that maps s to t
     */
    static fourToFourProjection(s, t) {
        // populate the augmented matrix 
        const A = [
            [s[0][0], s[0][1], s[0][2], 0, 0, 0, 0, 0, 0, -t[0][0], 0, 0, 0], 
            [0, 0, 0, s[0][0], s[0][1], s[0][2], 0, 0, 0, -t[0][1], 0, 0, 0],
            [0, 0, 0, 0, 0, 0, s[0][0], s[0][1], s[0][2], -t[0][2], 0, 0, 0], 
            [s[1][0], s[1][1], s[1][2], 0, 0, 0, 0, 0, 0, 0, -t[1][0], 0, 0], 
            [0, 0, 0, s[1][0], s[1][1], s[1][2], 0, 0, 0, 0, -t[1][1], 0, 0],
            [0, 0, 0, 0, 0, 0, s[1][0], s[1][1], s[1][2], 0, -t[1][2], 0, 0], 
            [s[2][0], s[2][1], s[2][2], 0, 0, 0, 0, 0, 0, 0, 0, -t[2][0], 0], 
            [0, 0, 0, s[2][0], s[2][1], s[2][2], 0, 0, 0, 0, 0, -t[2][1], 0],
            [0, 0, 0, 0, 0, 0, s[2][0], s[2][1], s[2][2], 0, 0, -t[2][2], 0], 
            [s[3][0], s[3][1], s[3][2], 0, 0, 0, 0, 0, 0, 0, 0, 0, -t[3][0]], 
            [0, 0, 0, s[3][0], s[3][1], s[3][2], 0, 0, 0, 0, 0, 0, -t[3][1]],
            [0, 0, 0, 0, 0, 0, s[3][0], s[3][1], s[3][2], 0, 0, 0, -t[3][2]]
        ];

        // solve for the linear system using Gaussian elimination
        const AR = this.computeRREF(A);
        const T = [
            [-AR[0][12], -AR[1][12], -AR[2][12]], 
            [-AR[3][12], -AR[4][12], -AR[5][12]], 
            [-AR[6][12], -AR[7][12], -AR[8][12]]
        ];

        return T;
    }

    /**
     * Compute the reduced row echelon form of a rectangular matrix
     * @param {Array} matrix the matrix to compute
     * @returns {Array} the RREF of the matrix
     */
    static computeRREF(matrix) {
        // Make a copy of the matrix to avoid modifying the original
        const m = matrix.map(row => [...row]);
    
        let lead = 0;
        const rowCount = m.length;
        const colCount = m[0].length;
    
        for (let r = 0; r < rowCount; r++) {
            if (colCount <= lead) {
                return;
            }
    
            let i = r;
            while (m[i][lead] === 0) {
                i++;
                if (rowCount === i) {
                    i = r;
                    lead++;
                    if (colCount === lead) {
                        return;
                    }
                }
            }
    
            // Swap the rows
            const temp = m[i];
            m[i] = m[r];
            m[r] = temp;
    
            // Normalize the pivot row
            const val = m[r][lead];
            for (let j = 0; j < colCount; j++) {
                m[r][j] /= val;
            }
    
            // Eliminate other rows
            for (let i = 0; i < rowCount; i++) {
                if (i !== r) {
                    const val = m[i][lead];
                    for (let j = 0; j < colCount; j++) {
                        m[i][j] -= val * m[r][j];
                    }
                }
            }
            lead++;
        }
    
        return m;
    }

    /**
     * Round a umber to the nearest digit
     * @param {Number} number the number to round
     * @param {Number} digit the decimals to keep
     * @returns {Number} the rounded number
     */
    static round(number, digit=15) {
        /*   
            round a number to the nearest digit 
        */
        const scale = Math.pow(10, digit);
        const scaledNumber = number * scale;
        const roundedScaledNumber = Math.round(scaledNumber);
        return roundedScaledNumber / scale;
    }

    // geometry methods

    /**
     * This method calculates the intersection of two lines by solving a linear system.
     * The method takes in four vertices v_1, v_2, v_3, v_4. It construct two lines using:
     *  l_1(s) = v_1 + s * (v_2 - v_1)
     *  l_2(t) = v_3 + s * (v_4 - v_3)
     * It then solves for s and t by solving a linear system
     * @param {Vector} ver1 line 1 vertex 1
     * @param {Vector} ver2 line 1 vertex 2
     * @param {Vector} ver3 line 2 vertex 1
     * @param {Vector} ver4 line 2 vertex 2
     * @returns {Vector} the vertex of the intersection
     */
    static getIntersection(ver1, ver2, ver3, ver4) {
        // setting up the linear system
        const mat = [[ver2.x - ver1.x, ver3.x - ver4.x], 
                   [ver2.y - ver1.y, ver3.y - ver4.y]];
        const b = [[ver3.x - ver1.x], 
                 [ver3.y - ver1.y]];
        const matInverse = MathHelper.invert2(mat);
        const param = MathHelper.matrixMult(matInverse, b);

        // finding the intersection point
        const s = param[0][0];
        const interX = ver1.x + s * (ver2.x - ver1.x);
        const interY = ver1.y + s * (ver2.y - ver1.y);
        return createVector(interX, interY, 1);
    }

    /**
     * Check the orientation of a triangle (given as 3 ordered vertices)
     * @param {Vector} ver1 first vertex
     * @param {Vector} ver2 second vertex
     * @param {Vector} ver3 third vertex
     * @returns 1 if counterclockwise, -1 if clockwise, 0 if collinear
     */
    static triangleOrientation(ver1, ver2, ver3) {
        const M = [
            [ver1.x, ver2.x, ver3.x],
            [ver1.y, ver2.y, ver3.y],
            [1, 1, 1]
        ]
        const det = MathHelper.round(MathHelper.det3(M));
        if (det > 0) {
            return 1;
        }
        if (det < 0) {
            return -1;
        }
        return 0;
    }
    
    
    static intersects(ver1, ver2, ver3, ver4) {

    }

    // for debugging purposes
    static isOrthogonal2(Q) {
        // check whether a 2-by-2 matrix is orthogonal
        const Qt = MathHelper.transpose(Q);
        const Qinv = MathHelper.invert2(Q);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (MathHelper.round(Qt[i][j] - Qinv[i][j]) != 0) {
                    return false;
                }
            }
        }
        return true;
    }
}
