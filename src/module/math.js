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


    /**
     * geometry methods
     */

    /**
     * This method calculates the intersection of two lines by solving a linear system.
     * The method takes in four vertices v_1, v_2, v_3, v_4. It construct two lines using:
     *  l_1(s) = v_1 + s * (v_2 - v_1)
     *  l_2(t) = v_3 + s * (v_4 - v_3)
     * It then solves for s and t by solving a linear system
     * @param {Array<Number>} ver1 line 1 vertex 1
     * @param {Array<Number>} ver2 line 1 vertex 2
     * @param {Array<Number>} ver3 line 2 vertex 1
     * @param {Array<Number>} ver4 line 2 vertex 2
     * @returns {Array<Number>} the vertex of the intersection
     */
    static getIntersection(ver1, ver2, ver3, ver4) {
        // setting up the linear system
        const mat = [
            [ver2[0] - ver1[0], ver3[0] - ver4[0]], 
            [ver2[1] - ver1[1], ver3[1] - ver4[1]]
        ];
        const b = [
            [ver3[0] - ver1[0]], 
            [ver3[1] - ver1[1]]
        ];
        const matInverse = this.invert2(mat);
        const param = this.matrixMult(matInverse, b);

        // finding the intersection point
        const s = param[0][0];
        const interX = ver1[0] + s * (ver2[0] - ver1[0]);
        const interY = ver1[1] + s * (ver2[1] - ver1[1]);
        return [interX, interY, 1];
    }

    /**
     * Project a 2d vector onto another 2d vector.
     * @param {Array<Number>} u the vector to project
     * @param {Array<Number>} v the direction of the projection
     * @returns the projected vector
     */
    static proj2(u, v) {
        if (this.round(v[0]) == 0 && this.round(v[1]) == 0) {
            return [0, 0];
        }
        const lambda = (u[0] * v[0] + u[1] * v[1]) / (v[0] * v[0] + v[1] * v[1]);
        return [v[0] * lambda, v[1] * lambda];
    }

    /**
     * Take the orthogonal component of a 2d vector with respect to a 1d linear subspace
     * @param {Array<Number>} u the vector to take the orthogonal component
     * @param {Array<Number>} v the linear subspace to take the orthogonal component
     * @returns the orthogonal component
     */
    static orthoComp2(u, v) {
        const proj = this.proj2(u, v); 
        return [u[0] - proj[0], u[1] - proj[1]];
    }

    /**
     * Check whether the polygon has collapsed to a point
     * @param {Array<Array<Number>>} vertices vertices of the polygon
     * @param {number} [threshold=0.00000001] distance threshold of two points. 
     * @returns true if all vertices of the polygon are within some distance of each other.
     */
    static isPoint(vertices, threshold=0.0001) {
        for (let i = 0; i < vertices.length; i++) {
            for (let j = 0; j < i; j++) {
                const r = [vertices[i][0] - vertices[j][0], vertices[i][1] - vertices[j][1]];
                const mag = Math.sqrt(r[0] * r[0] + r[1] * r[1]);
                if (mag > threshold) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Check whether the polygon has collapsed to a linear subspace
     * @param {Array<Array<Number>>} vertices vertices of the polygon
     * @param {number} [threshold=0.0000001] threshold of the distance to the line
     */
    static isLinear(vertices, threshold=0.00001) {
        
        /**
         * Choose a pair of vertices that are enough distance away from each other for the line reference.
         * @param {Array<Number>} vertices the vertices of the polygon
         * @returns 
         */
        function chooseLine(vertices) {
            let maxDist = 0;
            const threshold = 0.01;
            let maxInd = [0, 1];
            for (let i = 0; i < vertices.length; i++) {
                for (let j = 0; j < i; j++) {
                    const r = [vertices[i][0] - vertices[j][0], vertices[i][1] - vertices[j][1]];
                    const mag = Math.sqrt(r[0] * r[0] + r[1] * r[1]);
                    if (mag > threshold) {
                        return [i, j];
                    }
                    if (mag > maxDist) {
                        maxDist = mag;
                        maxInd = [i, j];
                    }
                }
            }
            return maxInd;
        }

        const ind = chooseLine(vertices);
        const v = [
            vertices[ind[1]][0] - vertices[ind[0]][0], 
            vertices[ind[1]][1] - vertices[ind[0]][1] 
        ]

        // project to v and calculate the distance
        for (let i = 0; i < vertices.length; i++) {
            const u = [
                vertices[i][0] - vertices[ind[0]][0],
                vertices[i][1] - vertices[ind[0]][1]
            ]
            const orth = this.orthoComp2(u, v);
            const mag = Math.sqrt(orth[0] * orth[0] + orth[1] * orth[1]);
            // if the distance exceeds the threshold, return false.\
            if (mag > threshold) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check the orientation of a triangle (given as 3 ordered vertices)
     * @param {Array<Number>} ver1 first vertex
     * @param {Array<Number>} ver2 second vertex
     * @param {Array<Number>} ver3 third vertex
     * @returns 1 if counterclockwise, -1 if clockwise, 0 if collinear
     */
    static triangleOrientation(ver1, ver2, ver3) {
        const M = [
            [ver1[0], ver2[0], ver3[0]],
            [ver1[1], ver2[1], ver3[1]],
            [1, 1, 1]
        ]
        const det = this.round(this.det3(M));
        if (det > 0) {
            return 1;
        }
        if (det < 0) {
            return -1;
        }
        return 0;
    }
    
    /**
     * Check if two line segments intersect each other
     * @param {Array<Number>} ver1 segment 1 vertex 1
     * @param {Array<Number>} ver2 segment 1 vertex 2
     * @param {Array<Number>} ver3 segment 2 vertex 1
     * @param {Array<Number>} ver4 segment 2 vertex 2
     * @returns {Boolean} whether two segments intersect
     */
    static intersects(ver1, ver2, ver3, ver4) {
        // if the two lines are colinear
        if (this.triangleOrientation(ver1, ver2, ver3) == 0 && this.triangleOrientation(ver1, ver2, ver4) == 0) { 
            // check if any one point lies in between a line
            let t1;
            let t2; 
            let t3;
            let t4;
            if (this.round(ver4[0] - ver3[0]) != 0) {
                t1 = this.round((ver1[0] - ver3[0]) / (ver4[0] - ver3[0]));
                t2 = this.round((ver2[0] - ver3[0]) / (ver4[0] - ver3[0]));
            } else {
                t1 = this.round((ver1[1] - ver3[1]) / (ver4[1] - ver3[1]));
                t2 = this.round((ver2[1] - ver3[1]) / (ver4[1] - ver3[1]));
            }
            if (this.round(ver2[0] - ver1[0]) != 0) {
                t3 = this.round((ver3[0] - ver1[0]) / (ver2[0] - ver1[0]));
                t4 = this.round((ver4[0] - ver1[0]) / (ver2[0] - ver1[0]));
            } else {
                t3 = this.round((ver3[1] - ver1[1]) / (ver2[1] - ver1[1]));
                t4 = this.round((ver4[1] - ver1[1]) / (ver2[1] - ver1[1]));
            }
            if (t1 >= 0 && t1 <= 1) {
                return true;
            }
            if (t2 >= 0 && t2 <= 1) {
                return true;
            }
            if (t3 >= 0 && t3 <= 1) {
                return true;
            }
            if (t4 >= 0 && t4 <= 1) {
                return true;
            }
        }

        // if the two lines are parallel
        const M = [
            [ver2[0] - ver1[0], ver3[0] - ver4[0]], 
            [ver2[1] - ver1[1], ver3[1] - ver4[1]]
        ];
        const det = this.round(M[0][0] * M[1][1] - M[0][1] * M[1][0]);
        if (det == 0) {
            return false;
        }

        // if not parallel or colinear
        const vint = this.getIntersection(ver1, ver2, ver3, ver4);
        let t5;
        let t6;
        if (this.round(ver2[0] - ver1[0]) != 0) {
            t5 = this.round((vint[0] - ver1[0]) / (ver2[0] - ver1[0]));
        } else {
            t5 = this.round((vint[1] - ver1[1]) / (ver2[1] - ver1[1]));
        }
        if (this.round(ver4[0] - ver3[0]) != 0) {
            t6 = this.round((vint[0] - ver3[0]) / (ver4[0] - ver3[0]));
        } else {
            t6 = this.round((vint[1] - ver3[1]) / (ver4[1] - ver3[1]));
        }
        if (t5 >= 0 && t5 <= 1 && t6 >= 0 && t6 <= 1) {
            return true;
        }
        return false;
    }

    /**
     * Check whether a polygon is embedded (whether the edges intersect)
     * @param {Array<Array<Number>>} vertices the coords of the vertices of the polygon
     * @returns {Boolean} whether the polygon is embedded
     */
    static isEmbedded(vertices) {
        const n = vertices.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < i-1; j++) {
                if (this.intersects(vertices[i%n], vertices[(i+1)%n], vertices[j%n], vertices[(j+1)%n])) {
                    if (i != n-1 || j != 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check whether a polygon is convex
     * @param {Array<Array<Number>>} vertices the coords of the vertices of the polygon
     * @returns {Boolean} whether the polygon is convex
     */
    static isConvex(vertices) {
        // first, check whether the polygon is embedded
        if (!this.isEmbedded(vertices)) {
            return false;
        }
        const orientation = this.triangleOrientation(vertices[0], vertices[1], vertices[2]);
        if (orientation == 0) {
            return false;
        }
        const n = vertices.length
        for (let i = 1; i < n; i++) {
            if (orientation != this.triangleOrientation(vertices[i%n], vertices[(i+1)%n], vertices[(i+2)%n])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check whether a polygon is a k-bird
     * @param {Array<Array<Number>>} vertices the coords of the vertices of the polygon 
     * @param {Number} k k
     * @returns whether the polygon is a k-bird
     */
    static isBird(vertices, k) {
        const n = vertices.length
        // first, check whether the polygon is embedded
        if (!this.isEmbedded(vertices)) {
            return false;
        }

        // check the clockwise orientations
        const orientation = this.triangleOrientation(vertices[0], vertices[1], vertices[k]);
        if (orientation == 0) {
            return false;
        }
        for (let i = 1; i < n; i++) {
            if (orientation != this.triangleOrientation(vertices[i%n], vertices[(i+1)%n], vertices[(i+k)%n])) {
                return false;
            }
        }

        // check the counterclockwise orientations
        const orientation2 = this.triangleOrientation(vertices[0], vertices[n-1], vertices[n-k]);
        if (orientation2 == 0) {
            return false;
        }
        for (let i = 1; i < n; i++) {
            if (orientation2 != this.triangleOrientation(vertices[i%n], vertices[(i-1+n)%n], vertices[(i-k+n)%n])) {
                return false;
            }
        }
        return true;
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

    /**
     * Compute the inverse cross ratio of four lines (see https://en.wikipedia.org/wiki/Pentagram_map)
     * @param {Array<Number>} l1 l1 coords
     * @param {Array<Number>} l2 l2 coords
     * @param {Array<Number>} l3 l3 coords
     * @param {Array<Number>} l4 l4 coords
     * @returns the cross ratio
     */
    static inverseCrossRatio(l1, l2, l3, l4) {
        // check if parallel to y-axis
        if (this.round(l1[0]) == 0) {
            return (l4[1]/l4[0] - l3[1]/l3[0]) / (l4[1]/l4[0] - l2[1]/l2[0]);
        }
        if (this.round(l2[0]) == 0) {
            return -(l4[1]/l4[0] - l3[1]/l3[0]) / (l3[1]/l3[0] - l1[1]/l1[0]);
        }
        if (this.round(l3[0]) == 0) {
            return -(l2[1]/l2[0] - l1[1]/l1[0]) / (l4[1]/l4[0] - l2[1]/l2[0]);
        }
        if (this.round(l4[0]) == 0) {
            return (l2[1]/l2[0] - l1[1]/l1[0]) / (l3[1]/l3[0] - l1[1]/l1[0]);
        }

        // if not, take the inverse cross ratio
        const num = (l2[1]/l2[0] - l1[1]/l1[0]) * (l4[1]/l4[0] - l3[1]/l3[0]);
        const denom = (l3[1]/l3[0] - l1[1]/l1[0]) * (l4[1]/l4[0] - l2[1]/l2[0]);
        return num / denom;
    }

    /**
     * Get the corner coordinates of the polygon in the moduli space 
     * (see https://en.wikipedia.org/wiki/Pentagram_map)
     * @returns the corner coordinates of the moduli space in a 3-by-3 matrix
     */
    static getCornerCoords(vertices) {
        const n = vertices.length;
        let coords = new Array(2*n);
        for (let i = 0; i < n; i++) {
            const t1 = [
                vertices[(i-2+n)%n][0] - vertices[(i-1+n)%n][0], 
                vertices[(i-2+n)%n][1] - vertices[(i-1+n)%n][1]
            ];
            const t2 = [
                vertices[i][0] - vertices[(i-1+n)%n][0], 
                vertices[i][1] - vertices[(i-1+n)%n][1]
            ];
            const t3 = [
                vertices[(i+1)%n][0] - vertices[(i-1+n)%n][0], 
                vertices[(i+1)%n][1] - vertices[(i-1+n)%n][1]
            ];
            const t4 = [
                vertices[(i+2)%n][0] - vertices[(i-1+n)%n][0], 
                vertices[(i+2)%n][1] - vertices[(i-1+n)%n][1]
            ];
            coords[2*i] = this.inverseCrossRatio(t1, t2, t3, t4);

            const s1 = [
                vertices[(i+2)%n][0] - vertices[(i+1)%n][0], 
                vertices[(i+2)%n][1] - vertices[(i+1)%n][1]
            ];
            const s2 = [
                vertices[i][0] - vertices[(i+1)%n][0], 
                vertices[i][1] - vertices[(i+1)%n][1]
            ];
            const s3 = [
                vertices[(i-1+n)%n][0] - vertices[(i+1)%n][0], 
                vertices[(i-1+n)%n][1] - vertices[(i+1)%n][1]
            ];
            const s4 = [
                vertices[(i-2+n)%n][0] - vertices[(i+1)%n][0], 
                vertices[(i-2+n)%n][1] - vertices[(i+1)%n][1]
            ];
            coords[2*i+1] = this.inverseCrossRatio(s1, s2, s3, s4);
        }
        return coords;
    }
}
