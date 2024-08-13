/**
 * A class that reconstructs the homogeneous coordinates of a 7-gon given its corner invariants
 */

class Reconstruct extends Geometry {
    /**
     * Reconstruction polynomials
     */

    /**
     * Computes the sign of an admissible sequence
     * @param {Array<Array<Number>>} seq the admissible sequence to compute
     * @returns the sign (number of singletons in the sequence)
     */
    static computeSign(seq) {
        let sign = 1;
        for (let i = 0; i < seq.length; i++) {
            if (seq[i].length == 1) {
                sign *= -1;
            }
        }
        return sign;
    }

    /**
     * Computes all finite odd admissible sequences given upper and lower bounds
     * @param {number} upper the upper bound 
     * @param {number} lower the lower bound
     * @returns the collection of all finite odd admissible sequences
     */
    static findFiniteOddAdmissible(upper, lower) {
        // if there is no odd number in between upper and lower, return an empty array
        if (upper - lower <= 2) {
            return new Array();
        }

        // if there is only one value allowed, add the value
        if (upper - lower == 4) {
            return [[[lower+2]]];
        }

        // otherwise, recurse
        let seqs = new Array();

        // case 1, starting with empty sequence
        const s1 = this.findFiniteOddAdmissible(upper, lower + 2);
        for (let i = 0; i < s1.length; i++) {
            seqs.push(s1[i]);
        }

        // case 2, starting with a singleton
        const s2 = this.findFiniteOddAdmissible(upper, lower + 4);
        seqs.push([[lower+2]]);
        for (let i = 0; i < s2.length; i++) {
            const newSeq = [[lower+2]];
            seqs.push(newSeq.concat(s2[i]));
        }

        // case 3, starting with a triple (only used when upper - lower > 6)
        if (upper - lower >= 6) {
            seqs.push([[lower+2, lower+3, lower+4]]);
            const s3 = this.findFiniteOddAdmissible(upper, lower + 6);
            for (let i = 0; i < s3.length; i++) {
                const newSeq = [[lower+2, lower+3, lower+4]];
                seqs.push(newSeq.concat(s3[i]));
            }
        }
        return seqs;
    }

    /**
     * Compute the reconstruction polynomials
     * @param {number} upper upper bound
     * @param {number} lower lower bound
     * @param {Array<number>} coords corner invariants
     * @param {boolean} [print=false] whether to display the polynomial
     * @returns 
     */
    static O(upper, lower, coords, print=false) {
        const n = coords.length;

        // find the admissible sequences
        const seqs = this.findFiniteOddAdmissible(upper, lower);
        // console.log(upper, lower, seqs);

        // otherwise, compute the polynomial
        let poly = 1;
        let disp = "1 "; // display the polynomial
        for (let i = 0; i < seqs.length; i++) {
            let val = this.computeSign(seqs[i]);
            disp = disp +  "+ " + val.toString() + " ";
            for (let j = 0; j < seqs[i].length; j++) {
                for (let k = 0; k < seqs[i][j].length; k++) {
                    val *= coords[(seqs[i][j][k] + n) % n];
                    disp = disp + "x" + ((seqs[i][j][k] + n) % n).toString() + " ";
                }
            }
            poly += val;
        } 
        if (print) {
            console.log("upper", upper, "lower", lower);
            console.log(disp);
        }
        return poly;
    }

    /**
     * Reconstruct the homogeneous coordinates of a polygon given its corner invariants
     * The formula comes from equation 19 of [Sch07]
     * @param {Array<number>} x the corner invariants
     * @returns the homogeneous coordinates of the polygon
     */
    static reconstruct(x) {
        const n = x.length/2;

        let coords = new Array();
        coords[0] = [0, 1, 1];
        coords[1] = [1, 1, 1];
        for (let i = 2; i < n; i++) {
            const hX = this.O(2*i-1, 1, x);
            const hY = this.O(2*i-1, -1, x) + x[1] * this.O(2*i-1, 3, x);
            const hZ = this.O(2*i-1, -1, x);
            coords[i] = [hX, hY, hZ];
        }
        return Normalize.squareNormalize(coords.map(a => a.slice()), 6, 0, 2, 4);
    }

    static reconstruct2(x) {
        // the formulas below come from section 4.2 of [Sch07]
        // this is specifically for 7-gons
        let coords = new Array();
        coords[0] = [0, 1, 1];
        coords[1] = [1, 1, 1];
        coords[2] = [1, 1, 1-x[1]];

    }

    /**
     * Reconstruct the homogeneous coordinates of a polygon given its corner invariants
     * The formula comes from a mathematica file Schwartz sent to me
     * @param {Array<number>} x the corner invariants
     * @param {number} [numVertices=6] number of vertices to reconstruct
     * @returns the homogeneous coordinates of the polygon
     */
    static reconstruct3(x, numVertices=6) {
        let coords = new Array(numVertices);
        const M = [
            [1, -1, x[0]*x[1]],
            [1, 0, 0],
            [1, 0, x[0]*x[1]]
        ];
        coords[0] = [0, 0, 1];
        coords[1] = [1, 0, 1];
        coords[2] = [1, 1, 1];
        coords[3] = [0, 1, 1];
        for (let i = 4; i < numVertices; i++) {
            const v = [
                [this.O((2*i-5), -1, x)], 
                [this.O((2*i-5), 1, x)], 
                [this.O((2*i-5), 3, x)]
            ];
            const r = this.matrixMult(M, v);
            coords[i] = [r[0][0], r[1][0], r[2][0]];
        }
        return coords;
    }

    /**
     * Reconstruct the first 6 homogeneous coordinates of a twisted bigon
     * @param {Array<number>} x 
     */
    static reconstructBigon6(x) {
        if (x.length != 4) {
            throw new Error("The input invariance is not a twisted bigon");
        }
        let coords = new Array(6);
        coords[0] = [0, 0, 1];
        coords[1] = [1, 0, 1];
        coords[2] = [1, 1, 1];
        coords[3] = [0, 1, 1];
        coords[4] = [
            -x[1] + x[0]*x[1],
            1 - x[1],
            1 - x[1] + x[0]*x[1]
        ];
        coords[5] = [
            -x[1] + x[0]*x[1] + x[1]*x[2]*x[3],
            1 - x[1] - x[3] + x[1]*x[2]*x[3],
            1 - x[1] - x[3] + x[0]*x[1] + x[1]*x[2]*x[3]
        ];
        return coords;
    }

    /**
     * Reconstruct the homogeneous coordinates of a twisted bigon given its monodromy.
     * The first four coordinates are given as 
     *  [0, 0, 1]
     *  [1, 0, 1]
     *  [1, 1, 1]
     *  [0, 1, 1]
     * The method then applies the monodromy repeatedly to get the coordinates
     * @param {Array<Array<number>>} T a lift of the monodromy of the bigon
     * @param {number} [numVertices=6] number of vertices to construct
     * @returns 
     */
    static reconstructBigon(T, numVertices=6) {
        let coords = new Array(numVertices);
        coords[0] = [0, 0, 1];
        coords[1] = [1, 0, 1];
        coords[2] = [1, 1, 1];
        coords[3] = [0, 1, 1];
        for (let i = 4; i < numVertices; i++) {
            const v = this.matrixMult(T, this.vec(coords[i-2]));
            coords[i] = [v[0][0], v[1][0], v[2][0]];
        }
        return coords;
    }

    /**
     * Get the monodromy of a twisted polygon
     * @param {Array<number>} x the corner invariants of the twisted polygon
     * @returns a lift of the monodromy
     */
    static monodromy(x) {
        const n = x.length / 2;
        const A = this.reconstruct3(x, n + 4);
        
        // compute the lift
        const v00 = x[1] * A[n+3][0] - x[1] * A[n+2][0];
        const v10 = x[1] * A[n+3][1] - x[1] * A[n+2][1];
        const v20 = x[1] * A[n+3][2] - x[1] * A[n+2][2];

        const v01 = x[2*n-1] * x[0] * x[1] * A[n+1][0];
        const v11 = x[2*n-1] * x[0] * x[1] * A[n+1][1];
        const v21 = x[2*n-1] * x[0] * x[1] * A[n+1][2];

        const v02 = x[1] * A[n+2][0] - x[2*n-1] * x[0] * x[1] * A[n+1][0];
        const v12 = x[1] * A[n+2][1] - x[2*n-1] * x[0] * x[1] * A[n+1][1];
        const v22 = x[1] * A[n+2][2] - x[2*n-1] * x[0] * x[1] * A[n+1][2];

        const T = [
            [v00, v01, v02],
            [v10, v11, v12],
            [v20, v21, v22]
        ];

        return T;
    }
}