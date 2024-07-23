const r = 10; // default digit to round to

/**
 * A class that contains helper methods for math opertaions.
 */
class MathHelper {
    /**
     * Converts a row vector to a column vector
     * @param {Array<Number>} vecToConvert the row vector storing vertices
     * @returns {Array<Array<Number>>} the converted column vector
     */
    static vec(vecToConvert) {
        return [[vecToConvert[0]], [vecToConvert[1]], [vecToConvert[2]]];
    }

    /**
     * Solve for the roots of a quadratic equation ax^2 + bx + c = 0.
     * Raise error if the equation has negative discriminant or has no solution.
     * @param {Number} a 2nd order coefficient
     * @param {Number} b 1st order coefficient
     * @param {Number} c 0th order coefficient
     * @param {number} [rounding=16] rounding of the discriminant
     * @returns {Array<Number>} the solution to the quadratic equation
     */
    static solveQuadratic(a, b, c, rounding=16) {
        if (this.round(b * b - 4 * a * c, rounding) < 0) {
            throw "The quadratic equation has negative discriminant.";
        }
        if (a == 0) {
            if (b == 0 & c != 0) {
                throw "The equation is linear but has no solution.";
            }
            return [-c/b, -c/b];
        }
        const delta = Math.sqrt(this.round(b * b - 4 * a * c, rounding));
        const x1 = (-b + delta) / (2 * a);
        const x2 = (-b - delta) / (2 * a);
        return [x1, x2];
    }

    /**
     * Convert an angle to a 2d rotation matrix
     * @param {Number} theta the angle to rotate
     * @returns {Array<Array<Number>>} the 2-by-2 rotation matrix
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
     * @param {Array<Array<Number>>} Q the 2-by-2 orthogonal matrix
     * @returns {Number} the angle of rotation
     */
    static matrixToAngle(Q) {
        if (!this.isOrthogonal2(Q)) {
            console.error("The input is not an orthogonal matrix.");
            return null;
        }
        return Math.atan(Q[1][0] / Q[0][0]);
    }

    /**
     * Compute the eigenvalues of a 2-by-2 matrix
     * @param {Array<Array<Number>>} mat the matrix to take the eigenvalues
     * @returns the two eigenvalues
     */
    static eigenvalue2(mat) {
        let a = 1;
        let b = -mat[0][0] - mat[1][1];
        let c = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
        // round if floating point error occurs
        try {
            return this.solveQuadratic(a, b, c);
        }
        catch (err) {
            console.log("Rounded");
            return this.solveQuadratic(a, b, c, 10);
        }
    }

    /**
     * Take the spectral decomposition of a 2-by-2 real symmetric matrix.
     * @param {Array<Array<Number>>} mat the symmetric matrix to take the spectral decomposition
     * @returns {Array<Array<Number>>} Q, the eigenbasis; Lambda, the diagonal matrix
     */
    static spectralDecomposition2(mat) {
        if (this.round(mat[0][1]) != this.round(mat[1][0])) {
            console.error("The input matrix is not symmetric");
        }
        const eigenval = this.eigenvalue2(mat);
        const lambda = eigenval[0];
        const eigenmat = [
            [mat[0][0] - lambda, mat[0][1]], 
            [mat[1][0], mat[1][1] - lambda]
        ];
        if (this.round(eigenmat[0][0]) == 0) {
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
     * @param {Array<Array<Number>>} mat the matrix to be transposed
     * @returns {Array<Array<Number>>} the transposed matrix
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
     * Compute the l2 distance of two finite dimensional real vectors
     * @param {Array<Number>} v1 
     * @param {Array<Number>} v2 
     * @returns 
     */
    static l2dist(v1, v2) {
        if (v1.length != v2.length) {
            throw "The length of the vectors don't match up.";
        }
        let dist = 0;
        for (let i = 0; i < v1.length; i++) {
            dist += Math.pow(v1[i] - v2[i], 2);
        }
        return Math.sqrt(dist);
    }

    /**
     * Invert a 2x2 matrix
     * @param {Array<Array<Number>>} mat matrix to invert
     * @returns {Array<Array<Number>>} the inverted matrix
     */
    static invert2(mat) {
        const det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
        // check invertibility
        if (det == 0) {
            throw new Error("Matrix is not invertible");
        }
        let inverse = [
            [mat[1][1] / det, -mat[0][1] / det],
            [-mat[1][0] / det, mat[0][0] / det]
        ];
        return inverse;
    }

    /**
     * Compute the cofactor of a 3-by-3 matrix
     * @param {Array<Array<number>>} matrix the matrix
     * @param {number} row the row
     * @param {number} col the column
     */
    static cofactor3(matrix, row, col) {
        const subMatrix = new Array();
        for (let i = 0; i < 3; i++) {
            if (i !== row) {
                const subRow = new Array();
                for (let j = 0; j < 3; j++) {
                    if (j !== col) {
                        subRow.push(matrix[i][j]);
                    }
                }
                subMatrix.push(subRow);
            }
        }
        return ((row + col) % 2 === 0 ? 1 : -1) * (subMatrix[0][0] * subMatrix[1][1] - subMatrix[0][1] * subMatrix[1][0]);
    }

    /**
     * Invert a 3-by-3 matrix
     * @param {Array<Array<Number>>} mat the 3-by-3 matrix to compute the inverse
     * @returns the inverted matrix
     */
    static invert3(mat) {
        // Check if the input is a 3x3 matrix
        if (mat.length !== 3 || mat[0].length !== 3 || mat[1].length !== 3 || mat[2].length !== 3) {
            throw new Error('The input must be a 3x3 matrix.');
        }

        const det = this.det3(mat);
        if (det === 0) {
            throw new Error('The matrix is singular and cannot be inverted.');
        }

        const inverse = new Array(3);
        for (let i = 0; i < 3; i++) {
            inverse[i] = new Array(3);
            for (let j = 0; j < 3; j++) {
                inverse[i][j] = this.cofactor3(mat, i, j) / det;
            }
        }

        return this.transpose(inverse);
    }
    
    /**
     * Multiplies two matrices. Raises an error if they cannot be multiplied.
     * @param {Array<Array<Number>>} mat1 first matrix 
     * @param {Array<Array<Number>>} mat2 second matrix
     * @returns {Array<Array<Number>>} the resulting matrix after multiplication
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
     * Compute the dot product of two row vectors
     * @param {Array<Number>} v1 the first vector
     * @param {Array<Number>} v2 the secondt vector
     * @returns the dot product as a row vector
     */
    static dot(v1, v2) {
        if (v1.length != v2.length) {
            throw new Error("The lengths of the two vectors don't match up");
        }
        let prod = 0;
        for (let i = 0; i < v1.length; i++) {
            prod += v1[i] * v2[i];
        }
        return prod;
    }

    /**
     * Compute the cross product of two row vectors
     * @param {Array<Number>} v1 the first vector
     * @param {Array<Number>} v2 the secondt vector
     * @returns the cross product as a row vector
     */
    static cross(v1, v2) {
        if (v1.length != 3 || v2.length != 3) {
            throw new Error("The vectors are not 3-dimensional");
        }
        const x = v1[1] * v2[2] - v1[2] * v2[1];
        const y = -v1[0] * v2[2] + v1[2] * v2[0];
        const z = v1[0] * v2[1] - v1[1] * v2[0];
        return [x, y, z];
    }

    /**
     * Compute the determinant of a 3x3 matrix
     * @param {Array<Array<Number>>} mat the matrix to compute
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
     * @param {Array<Array<Number>>} T the transformation
     * @param {Array<Number>} v the homogeneous coord of the vector
     * @returns {Array<Number>} Tv
     */
    static affineTransform(T, v) {
        // apply the projective transformation on the vector
        const vert = this.vec(v);
        const result = this.matrixMult(T, vert);
        const x = result[0][0];
        const y = result[1][0];
        const z = result[2][0];
        return [x, y, z];
    }

    /**
     * Takes in two lists of four points in general position of the projective plane. 
     * Done by solving a linear equation.
     * @param {Array<Array<Number>>} s the four vertices of the source
     * @param {Array<Array<Number>>} t the four vertices of the target
     * @returns {Array<Array<Number>>} the projective transformation that maps s to t
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
     * @param {Array<Array<Number>>} matrix the matrix to compute
     * @returns {Array<Array<Number>>} the RREF of the matrix
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


    // for debugging purposes
    /**
     * Check whether a 2-by-2 matrix is orthogonal
     * @param {Array<Array<Number>>} Q matrix to check
     * @returns {Boolean} whether Q is an orthogonal matrix
     */
    static isOrthogonal2(Q) {
        // check whether a 2-by-2 matrix is orthogonal
        const Qt = this.transpose(Q);
        const Qinv = this.invert2(Q);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (this.round(Qt[i][j] - Qinv[i][j]) != 0) {
                    return false;
                }
            }
        }
        return true;
    }

}
