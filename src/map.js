/**
 * A class that contains the method of applying the pentagram map
 * on vertices of a polygon on the affine plane.
 */
class PentagramMap {
    /**
     * Constructor
     * @param {Number} l diagonal parameter, # vertices skipped
     * @param {Number} k spacing parameter, # vertices skipped
     */
    constructor(l=2, k=1) {
        this.l = l; // the diagonal parameter (# vertices skipped)
        this.k = k; // the spacing parameter (# vertices skipped)
        this.prev = new Array(); // keep charge of previous operations (in the form of vertices)
        this.normalization = "Ellipse";
        this.twisted = false;
        this.power = 1; // the power of the map (# of times to apply the map)
        this.numIterations = 0; // number of iterations applied to the map
        this.onlyEmbedded = false; // skip to the nearest embedded power of the map
        this.onlyConvex = false; // skip to the nearest convex power of the map
    }

    /**
     * Take in a set of vertices and apply the map to it
     * @param {Array<Array<Number>>} vertices 
     * @returns the vertices of the image polygon of the pentagram map
     */
    act(vertices) {
        
        /**
         * A helper method that applies the map
         * @param {Array<Array<Number>>} vertices vertices of the polygon
         * @param {Number} l diagonal parameter
         * @param {Number} k spacing parameter
         * @param {Number} p number of times to apply the map 
         * @param {String} normalization normalization to apply
         * @param {Boolean} twisted whether the polygon is twisted
         * @returns {Array<Array<Number>>} the resulting homogeneous coordinates of the vertices
         */
        function applyMap(vertices, l, k, p, normalization, twisted) {
            // if the polygon has collapsed to a point or a line, stop applying the map
            if (MathHelper.isPoint(vertices)) {
                throw "The polygon collapsed to a point";
            }
            if (MathHelper.isLinear(vertices)) {
                throw "The polygon collapsed to a line.";
            }

            const n = vertices.length;
            let newVertices = new Array(n);
            for (let i = 0; i < n; i++) {
                // the numbering of the vertices follows from Schwartz's bird paper
                const ver1 = vertices[i%n];
                const ver2 = vertices[(i+l)%n];
                const ver3 = vertices[(i-k+2*n)%n];
                const ver4 = vertices[(i-k+l+2*n)%n];
                const vint = MathHelper.getIntersection(ver1, ver2, ver3, ver4);
                newVertices[i] = vint;
            }
            // apply normalization
            if (normalization == "Square") {
                if (twisted) {
                    newVertices = Normalize.twistedSquareNormalize(newVertices);
                } else {
                    newVertices = Normalize.squareNormalize(newVertices);
                }
            }
            if (normalization == "Ellipse") {
                newVertices = Normalize.ellipseNormalize(newVertices);
            }

            if (p == 1) {
                return newVertices;
            }

            return applyMap(newVertices, l, k, p-1, normalization, twisted);
        }

        // record the previous vertices for undo purposes
        this.store(vertices);

        // only showing embedded powers
        if (this.onlyEmbedded) {
            let vTemp = applyMap(vertices, this.l, this.k, this.power, this.normalization, this.twisted);
            let count = 1;
            while (!MathHelper.isEmbedded(vTemp)) {
                vTemp = applyMap(vTemp, this.l, this.k, this.power, this.normalization, this.twisted);
                if (count > 1000) {
                    console.error("Cannot find power that is embedded.");
                    return vertices;
                }
                count++;
            }
            this.numIterations += this.power * count;
            return vTemp;
        }

        // only showing convex powers
        if (this.onlyConvex) {
            let vTemp = applyMap(vertices, this.l, this.k, this.power, this.normalization, this.twisted);
            let count = 1;
            while (!MathHelper.isConvex(vTemp)) {
                vTemp = applyMap(vTemp, this.l, this.k, this.power, this.normalization, this.twisted);
                if (count > 10000) {
                    console.error("Cannot find power that is convex.");
                    return vertices;
                }
                count++;
            }
            this.numIterations += this.power * count;
            return vTemp;
        }

        // record the number of iterations
        this.numIterations += this.power;
        return applyMap(vertices, this.l, this.k, this.power, this.normalization, this.twisted);
    }

    /**
     * Record the previous vertices for undo purposes
     * @param {Array<Array<Number>>} vertices the vertices to store
     */
    store(vertices) {
        this.prev.push([vertices, this.numIterations]);
        if (this.prev.length > 20) {
            this.prev.shift();
        }
    }

    /**
     * A function that checks whether there are any actions to revert
     * @returns {Number} the length of the stored polygons
     */
    canRevert() {
        return this.prev.length;
    }

    /**
     * Revert the last action. Can only revert up to 20 times
     * @returns {Array<Array<Number>>} the vertices of the last stored polygon
     */
    revert() {
        if (this.prev.length === 0) {
            console.log("nothing to revert")
            return null;
        }
        // pop the last set of vertices
        this.numIterations = this.numIterations - this.power;
        return this.prev.pop();
    }

    /**
     * Clear all histories of the revert actions
     */
    clearHistory() {
        this.prev = new Array();
    }
}