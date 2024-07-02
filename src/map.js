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
        this.normalization = "None";
        this.power = 1; // the power of the map (# of times to apply the map)
    }

    /**
     * Take in a set of vertices and apply the map to it
     * @param {Array} vertices 
     * @returns the vertices of the image polygon of the pentagram map
     */
    act(vertices) {
        
        /**
         * A helper method that applies the map
         * @param {Array} vertices vertices of the polygon
         * @param {Number} l diagonal parameter
         * @param {Number} k spacing parameter
         * @param {Number} p number of times to apply the map 
         * @param {String} normalization normalization to apply
         * @returns {Array} the resulting homogeneous coordinates of the vertices
         */
        function applyMap(vertices, l, k, p, normalization) {
            const n = vertices.length;
            let newVertices = new Array(n);
            for (let i = 0; i < n; i++) {
                // the numbering of the vertices follows from Schwartz's bird paper
                const ver1 = vertices[i%n];
                const ver2 = vertices[(i+l)%n];
                const ver3 = vertices[(i-k+2*n)%n];
                const ver4 = vertices[(i-k+l+2*n)%n];
                const ver = MathHelper.intersect(ver1, ver2, ver3, ver4);
                newVertices[i] = ver;
            }
            // apply normalization
            if (normalization == "Square") {
                newVertices =  Normalize.squareNormalize(newVertices);
            }
            if (normalization === "Ellipse") {
                newVertices = Normalize.ellipseNormalize(newVertices);
            }

            if (p == 1) {
                return newVertices;
            }
            return applyMap(newVertices, l, k, p-1, normalization);
        }

        // record the previous vertices for undo purposes
        this.prev.push(vertices);
        if (this.prev.length > 20) {
            this.prev.shift();
        }

        // apply the map
        return applyMap(vertices, this.l, this.k, this.power, this.normalization);
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
     * @returns {Array} the vertices of the last stored polygon
     */
    revert() {
        if (this.prev.length === 0) {
            console.log("nothing to revert")
            return null;
        }
        // pop the last set of vertices
        return this.prev.pop();
    }

    /**
     * Clear all histories of the revert actions
     */
    clearHistory() {
        this.prev = new Array();
    }
}