/**
 * A class designed specifically for the pentagram map variants to act 
 * on the twisted bigons
 */
class TwistedMap {
    /**
     * Constructor
     * @param {number} l diagonal parameter, # vertices skipped
     * @param {number} k spacing parameter, # vertices skipped
     */
    constructor(l=2, k=1) {
        this.l = l; // the diagonal parameter (# vertices skipped)
        this.k = k; // the spacing parameter (# vertices skipped)
        this.prev = new Array(); // keep charge of previous operations (in the form of vertices)
        this.power = 1; // the power of the map (# of times to apply the map)
        this.shifts = 0; // shifting the vertices 
        this.numIterations = 0; // number of iterations applied to the map
    }

    /**
     * A helper method that applies the map
     * @param {Array<number>} coords corner coords of the twisted bigon
     * @param {Number} l diagonal parameter
     * @param {Number} k spacing parameter
     * @param {Number} p number of times to apply the map 
     * @returns {Array<Array<Number>>} the resulting homogeneous coordinates of the vertices
     */
    applyMap(coords, l, k, p) {
        // draw the old vertices
        let vertices = Reconstruct.reconstruct3(coords, k+l+6);
        // populate the new vertices
        let imgVertices = new Array(6);
        for (let i = 0; i < 6; i++) {
            // the numbering of the vertices follows from Schwartz's bird paper
            const v1 = vertices[i+k];
            const v2 = vertices[i+k+l];
            const v3 = vertices[i];
            const v4 = vertices[i+l];
            const vInt = Geometry.getIntersection(v1, v2, v3, v4);
            imgVertices[i] = vInt;
        }
        let tempCoords = Geometry.getCornerCoords(imgVertices);
        let imgCoords = new Array(4);
        if (k % 2 == 0) {
            imgCoords[0] = tempCoords[4];
            imgCoords[1] = tempCoords[5];
            imgCoords[2] = tempCoords[6];
            imgCoords[3] = tempCoords[7];
        } else {
            imgCoords[0] = tempCoords[6];
            imgCoords[1] = tempCoords[7];
            imgCoords[2] = tempCoords[4];
            imgCoords[3] = tempCoords[5];
        }
        
        if (p == 1) {
            return imgCoords;
        }

        return this.applyMap(imgCoords, l, k, p-1);
    }

    /**
     * Take in a set of vertices and apply the map to it
     * @param {Array<number>} coords corner coordinates of the bigon to act
     * @param {boolean} [store=true] whether to store the vertex
     * @param {boolean} [countIteration=true] whether to count iterations
     * @returns the vertices of the image polygon of the pentagram map
     */
    act(coords, store=true, countIteration=true) {
        // record the previous vertices for undo purposes
        if (store) {
            this.store(coords);
        }

        // record the number of iterations
        if (countIteration) {
            this.numIterations += this.power;
        }
        return this.applyMap(coords, this.l, this.k, this.power);
    }

    /**
     * Record the previous vertices for undo purposes
     * @param {Array<number>} coords the coordinates to store
     */
    store(coords) {
        this.prev.push([coords.slice(), this.numIterations]);
        if (this.prev.length > 20) {
            this.prev.shift();
        }
    }

    /**
     * A function that checks whether there are any actions to revert
     * @returns {Number} the number of polygons stored
     */
    canRevert() {
        return this.prev.length;
    }

    /**
     * Revert the last action. Can only revert up to 20 times
     * @returns {Array<number>} the corner coordinates of the last stored polygon
     */
    revert() {
        if (this.prev.length) {
            return this.prev.pop();
        }
    }
        

    /**
     * Clear all histories of the revert actions
     */
    clearHistory() {
        this.prev = new Array();
    }
}