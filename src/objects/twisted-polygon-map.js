/**
 * A class that applies the shifted Delta(3, 1) map on a twisted n-gon
 */
class TwistedPolygonMap {
    /**
     * Constructor
     */
    constructor(k=2, l=1) {
        this.k = k; // diagonal parameter
        this.l = l; // spacing parameter
        this.prev = new Array(); // keep charge of previous operations (in the form of vertices)
        this.power = 1; // the power of the map (# of times to apply the map)
        this.shifts = 0; // shifting the vertices 
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
        const k = this.k;
        const l = this.l;
        let imgCoords = new Array(coords.length);

        if (k == 3 && l == 1) {
            let xTemp = Geometry.applyShifted31(coords.slice());
            // redo shifts
            for (let i = 0; i < xTemp.length; i++) {
                imgCoords[(i+2)%(xTemp.length)] = xTemp[i];
            }
        } else {
            imgCoords = this.applyFactor(this.applyFactor(coords, k), l);
        }

        // check for errors 
        for (let i = 0; i < imgCoords.length; i++) {
            if (!Number.isFinite(imgCoords[i]) || Number.isNaN(imgCoords[i]) || imgCoords[i] == 0) {
                throw new Error("The image is at a singularity");
            } 
        }

        // shifting the coordinates
        const s = this.shifts;
        let xShifted = new Array(imgCoords.length); // shifted coords
        for (let i = 0; i < imgCoords.length; i++) {
            xShifted[i] = imgCoords[(i+2*s)%(imgCoords.length)];
        }
        
        if (p == 1) {
            return xShifted;
        }

        return this.applyMap(xShifted, p-1);
    }

    /**
     * Apply a factorized version of the map D_k:
     * The map D_k on P = (x0, x1, ..., x(2n-1)) is given as 
     * D_k(P)_i = <x(-k-i), x(-i)>
     * @param {Array<number>} x corner coordinates
     * @param {Array<Array<number>>} T the monodromy
     * @param {number} k diagonal parameter
     */
    applyFactor(x, k) {
        // use monodromy to draw vertices
        const n = x.length/2;
        let v = Reconstruct.reconstruct3(x, n+4);
        let M1 = Normalize.getProjectiveLift(v[0], v[1], v[2], v[3]);
        let M2 = Normalize.getProjectiveLift(v[n], v[n+1], v[n+2], v[n+3]);
        let M2Inv = MathHelper.invert3(M2);
        let T = MathHelper.matrixMult(M2Inv, M1);
        // apply the map
        let vertices = Reconstruct.reconstructMonodromy(T, x, n, k+n+4);
        // populate the new vertices 
        let vImg = new Array(n+4);
        for (let i = 0; i < n+4; i++) {
            vImg[i] = MathHelper.cross(vertices[i], vertices[i+k]); 
            // vImg[i] = P'(-k+2-i)
        }
        let xTemp = Geometry.getCornerCoords(vImg);
        // populate the image corner invariants
        let xImg = new Array(2*n);
        const c = (Math.floor(2*k/n)+4)*n;
        for (let i = 0; i < 2*n; i++) {
            xImg[(-2*k+1-i+c)%(2*n)] = xTemp[i+4];
        }
        return xImg;
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