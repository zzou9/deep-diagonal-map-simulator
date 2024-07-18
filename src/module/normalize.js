/**
 * Helper class for normalization
 */
class Normalize {

    /**
     * Normalize the shape so that the first four vertices are on the unit square
     *  v0 -> [1, 1, 1]
     *  v1 -> [-1, 1, 1]
     *  v2 -> [-1, -1, 1]
     *  v3 -> [1, -1, 1]
     * @param {Array<Array<Number>>} vertices vertices of the polygon
     * @param {number} [i0=0] index of first vertex
     * @param {number} [i1=1] index of second vertex
     * @param {number} [i2=2] index of third vertex
     * @param {number} [i3=3] index of fourth vertex
     * @returns vertices after normalization
     */
    static squareNormalize(vertices, i0=0, i1=1, i2=2, i3=3) {
        /**
         * our method consists of calculating a map M that maps any
         * four vertices u0, u1, u2, u3 in the following way:
         *  u0 -> [1, 0, 0]
         *  u1 -> [0, 1, 0]
         *  u2 -> [0, 0, 1]
         *  u3 -> [1, 1, 1]
         * we say M is good if it maps the four ui's to scalar multiples of the target 
         */

        function getMatrix(v0, v1, v2, v3) {
            let M = [v0, v1, v2];
            try {
                M = MathHelper.transpose(MathHelper.invert3(M));
            }
            catch (err) {
                console.error(err);
                throw new Error("The points are not in general position");
            }

            const l = MathHelper.matrixMult(M, MathHelper.vec(v3));

            // check if colinear, throw error
            if (l[0][0] == 0 || l[0][1] == 0 || l[0][2] == 0) {
                throw new Error("The points are not in general position");
            }
            const D = [
                [1/l[0][0], 0, 0],
                [0, 1/l[1][0], 0],
                [0, 0, 1/l[2][0]]
            ]
            return MathHelper.matrixMult(D, M);
        }

        const e0 = [1, 1, 1];
        const e1 = [-1, 1, 1];
        const e2 = [-1, -1, 1];
        const e3 = [1, -1, 1];

        const v0 = [vertices[i0][0], vertices[i0][1], 1];
        const v1 = [vertices[i1][0], vertices[i1][1], 1];
        const v2 = [vertices[i2][0], vertices[i2][1], 1];
        const v3 = [vertices[i3][0], vertices[i3][1], 1];

        const E = getMatrix(e0, e1, e2, e3);
        const M = getMatrix(v0, v1, v2, v3);

        // get the projection map
        const T = MathHelper.matrixMult(MathHelper.invert3(E), M);

        // transform all the vertices 
        let newVertices = new Array(vertices.length);
        for (let i = 0; i < vertices.length; i++) {
            const v = MathHelper.affineTransform(T, vertices[i]);
            // error if v is not on the affine plane
            if (v[2] == 0) {
                console.error("v is on the line at infinity!");
                return null;
            }
            // normalize and round
            // const x = MathHelper.round(v[0]/v[2], 15); // need to round to 10 digits, otherwise would explode
            // const y = MathHelper.round(v[1]/v[2], 1);
            newVertices[i] = [v[0]/v[2], v[1]/v[2], 1];
        }
        console.log(newVertices);
        return newVertices;
    }

    /**
     * Square normalize for twisted polygons. 
     * Fixes the first vertex of the first four iterations.
     * @param {Array<Array<Number>>} vertices vertices of the polygon
     * @returns vertices after normalization
     */
    static twistedSquareNormalize(vertices) {
        const k = Math.floor(vertices.length / 4);

        const source = [
            [vertices[0][0], vertices[0][1], 1], 
            [vertices[k][0], vertices[k][1], 1], 
            [vertices[2*k][0], vertices[2*k][1], 1], 
            [vertices[3*k][0], vertices[3*k][1], 1], 
        ];

        const unitSquare = [
            [1, 1, 1],
            [-1, 1, 1],
            [-1, -1, 1],
            [1, -1, 1]
        ];

        // get the projection map
        const T = MathHelper.fourToFourProjection(source, unitSquare);

        // transform all the vertices 
        let newVertices = new Array(vertices.length);
        for (let i = 0; i < vertices.length; i++) {
            const v = MathHelper.affineTransform(T, vertices[i]);
            // error if v is not on the affine plane
            if (v[2] == 0) {
                console.error("v is on the line at infinity!");
                return null;
            }
            // normalize and round
            const x = MathHelper.round(v[0]/v[2],10); // need to round to 10 digits, otherwise would explode
            const y = MathHelper.round(v[1]/v[2],10);
            newVertices[i] = [x, y, 1];
        }
        return newVertices;
    }


    // normalization using the moment of inertia matrix 



    // physical quantities

    /**
     * Get the center of mass of the polygon. The polygon is assumed to have point mass evenly
     * distributed to its vertices.
     * @param {Array<Array<Number>>} vertices the vertices to take the center of mass
     * @returns {Array<Number>} the vector that represents the center of mass of the polygon
     */
    static getCenterOfMass(vertices) {
        const n = vertices.length;
        let x0 = 0;
        let y0 = 0;
        for (let i = 0; i < n; i++) {
            x0 = x0 + vertices[i][0]; 
            y0 = y0 + vertices[i][1];
        }
        const x = x0 / n;
        const y = y0 / n;
        return [x, y, 1];
    }

    /**
     * Translate the vertices so that the center of mass lies at (0, 0, 1).
     * @param {Array<Array<Number>>} vertices the vertices to normalize
     * @returns {Array<Array<Number>>} the list of vertex coordinates normalized to center of mass.
     */
    static normalizeCOM(vertices) {
        const v0 = Normalize.getCenterOfMass(vertices);
        let vNew  = new Array(vertices.length);
        for (let i = 0; i < vertices.length; i++) {
            const x = vertices[i][0] - v0[0];
            const y = vertices[i][1] - v0[1];
            vNew[i] = [x, y, 1];
        }
        return vNew;
    }

    /**
     * Get the inertia matrix of the polygon with respect to the origin. 
     * Here the polygon assumed to have its center of mass at the origin. 
     * @param {Array<Array<Number>>} vertices vertices to derive inertia matrix
     * @returns {Array<Array<Number>>} the inertia matrix
     */
    static getInertiaMatrix(vertices) {
        /**
         * Helper method for inertia calculation
         * @param {Array<Array<Number>>} vertices vertices coordinates centered at COM
         * @param {Number} x0 x weights
         * @param {Number} y0 y weights
         * @returns {Number} the inertia value
         */
        function inertia(vertices, x0, y0) {
            let total = 0;
            for (let i = 0; i < vertices.length; i++) {
                const s = x0 * vertices[i][0] + y0 * vertices[i][1];
                total = total + s * s;
            }
            return total / vertices.length;
        }

        // normalize
        const vn = Normalize.normalizeCOM(vertices);
        const ixx = inertia(vn, 1, 0);
        const iyy = inertia(vn, 0, 1);
        const ixy = 0.5 * (inertia(vn, 1, 1) - ixx - iyy);
        const Ip = [
            [ixx, -ixy],
            [-ixy, iyy]
        ];
        return Ip;
    }

    /**
     * Normalize the vertices of a polygon so that the ellipse of inertia 
     * is the unit circle.
     * @param {Array<Array<Number>>} vertices homogeneous coordinates of vertices to normalize
     * @returns {Array<Array<Number>>} normalized homogeneous coordinates
     */
    static ellipseNormalize(vertices) {
        // calculate the new coordinates
        let newVertices = new Array(vertices.length);
        const normalizedVert = Normalize.normalizeCOM(vertices);
        const Ip = Normalize.getInertiaMatrix(normalizedVert);

        // get the spectral decomposition of the inertia matrix
        let decomp = MathHelper.spectralDecomposition2(Ip);
        const Q = decomp[0];
        const Qt = MathHelper.transpose(Q);
        const L = decomp[1];
        const sqrtInvL = [
            [1 / Math.sqrt(L[0][0]), 0], 
            [0, 1 / Math.sqrt(L[1][1])]
        ];

        for (let i = 0; i < normalizedVert.length; i++) {
            const vec = [[normalizedVert[i][0]], [normalizedVert[i][1]]];
            const result = MathHelper.matrixMult(Qt, MathHelper.matrixMult(sqrtInvL, MathHelper.matrixMult(Q, vec)));
            const xNew = MathHelper.round(result[0][0]);
            const yNew = MathHelper.round(result[1][0]);
            newVertices[i] = [xNew, yNew, 1];
        }
        return newVertices;
    }
}