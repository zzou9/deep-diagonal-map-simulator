/**
 * Helper class for normalization
 */
class Normalize {

    /**
     * Normalize the shape so that the first four vertices are on the unit square
     * @param {vertices of the polygon} vertices 
     * @returns vertices after normalization
     */
    static squareNormalize(vertices) {
        // First, record the homogeneous coords of the points
        // to project from, which will be the first four vertices
        // of the polygon
        const source = [
            [vertices[0].x, vertices[0].y, 1], 
            [vertices[1].x, vertices[1].y, 1], 
            [vertices[2].x, vertices[2].y, 1], 
            [vertices[3].x, vertices[3].y, 1], 
        ];

        // set up the homogeneous coords of the unit square
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
            if (v.z == 0) {
                console.error("v is on the line at infinity!");
                return null;
            }
            // normalize and round
            const x = MathHelper.round(v.x/v.z, 10);
            const y = MathHelper.round(v.y/v.z, 10);
            newVertices[i] = createVector(x, y, 1);
        }
        return newVertices;
    }


    // normalization using the moment of inertia matrix 



    // physical quantities

    /**
     * Get the center of mass of the polygon. The polygon is assumed to have point mass evenly
     * distributed to its vertices.
     * @param {Array} vertices the vertices to take the center of mass
     * @returns {p5.Vector} the vector that represents the center of mass of the polygon
     */
    static getCenterOfMass(vertices) {
        const n = vertices.length;
        let x0 = 0;
        let y0 = 0;
        for (let i = 0; i < n; i++) {
            x0 = x0 + vertices[i].x; 
            y0 = y0 + vertices[i].y;
        }
        const x = x0 / n;
        const y = y0 / n;
        return createVector(x, y, 1);
    }

    /**
     * Translate the vertices so that the center of mass lies at (0, 0, 1).
     * @returns {Array} the list of vertex coordinates normalized to center of mass.
     */
    static normalizeCOM(vertices) {
        const v0 = Normalize.getCenterOfMass(vertices);
        let vNew  = new Array(vertices.length);
        for (let i = 0; i < vertices.length; i++) {
            const x = vertices[i].x - v0.x;
            const y = vertices[i].y - v0.y;
            vNew[i] = createVector(x, y, 1);
        }
        return vNew;
    }

    /**
     * Get the inertia matrix of the polygon with respect to the origin. 
     * Here the polygon assumed to have its center of mass at the origin. 
     * @param {Array} vertices vertices to derive inertia matrix
     * @returns {Array} the inertia matrix
     */
    static getInertiaMatrix(vertices) {
        /**
         * Helper method for inertia calculation
         * @param {Array} vertices vertices coordinates centered at COM
         * @param {Number} x0 x weights
         * @param {Number} y0 y weights
         * @returns {Number} the inertia value
         */
        function inertia(vertices, x0, y0) {
            let total = 0;
            for (let i = 0; i < vertices.length; i++) {
                const s = x0 * vertices[i].x + y0 * vertices[i].y;
                total = total + s * s / vertices.length;
            }
            return total;
        }

        // normalize
        const vn = Normalize.normalizeCOM(vertices);
        const ixx = MathHelper.round(inertia(vn, 1, 0), 10);
        const iyy = MathHelper.round(inertia(vn, 0, 1), 10);
        const ixy = MathHelper.round(0.5 * (inertia(vn, 1, 1) - ixx - iyy), 10);
        const Ip = [
            [ixx, -ixy],
            [-ixy, iyy]
        ];
        return Ip;
    }

    /**
     * Normalize the vertices of a polygon so that the ellipse of inertia 
     * is the unit circle.
     * @param {Array} vertices homogeneous coordinates of vertices to normalize
     * @returns {Array} normalized homogeneous coordinates
     */
    static ellipseNormalize(vertices) {
        // calculate the new coordinates
        let newVertices = new Array(vertices.length);
        const normalizedVert = Normalize.normalizeCOM(vertices);
        const Ip = Normalize.getInertiaMatrix(normalizedVert);
        console.log(Ip);

        // get the spectral decomposition of the inertia matrix
        const decomp = MathHelper.spectralDecomposition2(Ip);
        const Q = decomp[0];
        const Qt = MathHelper.transpose(Q);
        const L = decomp[1];
        const sqrtInvL = [
            [1 / Math.sqrt(L[0][0]), 0], 
            [0, 1 / Math.sqrt(L[1][1])]
        ];

        for (let i = 0; i < normalizedVert.length; i++) {
            const vec = [[normalizedVert[i].x], [normalizedVert[i].y]];
            const result = MathHelper.matrixMult(Qt, MathHelper.matrixMult(sqrtInvL, MathHelper.matrixMult(Q, vec)));
            const xNew = MathHelper.round(result[0][0], 10);
            const yNew = MathHelper.round(result[1][0], 10);
            newVertices[i] = createVector(xNew, yNew, 1);
        }
        return newVertices;
    }
}