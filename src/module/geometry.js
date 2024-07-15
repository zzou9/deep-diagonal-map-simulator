/**
 * geometry methods
 */
class Geometry extends MathHelper {
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

    static 
}