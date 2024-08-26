/**
 * A class that applies the shifted Delta(3, 1) map on a twisted n-gon
 */
class Map31 {
    /**
     * Constructor
     */
    constructor() {
        this.prev = new Array(); // keep charge of previous operations (in the form of vertices)
        this.power = 1; // the power of the map (# of times to apply the map)
        this.numIterations = 0; // number of iterations applied to the map
    }

    /**
     * A helper method that applies Delta(3, 1) map for a twisted polygon
     * The formula is derived from the jupyter notebook 31_coords_construction.ipynb
     * @param {Array<number>} coords corner coords of the twisted polygon
     * @param {number} p number of times to apply the map 
     * @param {boolean} checkAfine check whether the image vertices are on the affine plane
     * @returns {Array<Array<Number>>} the resulting homogeneous coordinates of the vertices
     */
    applyMap(coords, p, checkAfine) {
        // set up image coordinates
        let imgCoords = Geometry.applyShifted31(coords.slice());

        // check whether the image is on the affine plane
        if (checkAfine) {
            // TODO: delete this function?
        }

        // check for errors 
        for (let i = 0; i < imgCoords.length; i++) {
            if (!Number.isFinite(imgCoords[i]) || Number.isNaN(imgCoords[i]) || imgCoords[i] == 0) {
                throw new Error("The image is at a singularity");
            } 
        }
        
        if (p == 1) {
            return imgCoords;
        }

        return this.applyMap(imgCoords, p-1);
    }

    /**
     * Take in a set of vertices and apply the map to it
     * @param {Array<number>} coords corner coordinates of the bigon to act
     * @param {boolean} [store=true] whether to store the vertex
     * @param {boolean} [countIteration=true] whether to count iterations
     * @param {boolean} [checkAfine=true] check whether the image vertices are on the affine patch
     * @returns the vertices of the image polygon of the pentagram map
     */
    act(coords, store=true, countIteration=true, checkAfine=true) {
        const newCoords = this.applyMap(coords, this.power, checkAfine);
        // record the previous vertices for undo purposes
        if (store) {
            this.store(coords);
        }

        // record the number of iterations
        if (countIteration) {
            this.numIterations += this.power;
        }
        return newCoords;
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