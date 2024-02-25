import {invert2, matrixMult} from './math.js';

class Map {
    /*
        a class that applys the map on the polygon
    */
    constructor(options = {}) {
        this.k = options.k || 1; // the spacing parameter (# vertices skipped)
        this.l = options.l || 2; // the diagonal parameter (# vertices skipped)
    }

    act(vertices) {
        const n = Object.keys(vertices).length;
        let newVertices = {};
        for (let idx in vertices) {
            const i = Number(idx);
            // may be negative, probably need to debug
            let ver1 = vertices[i%n];
            let ver2 = vertices[(i+this.l)%n];
            let ver3 = vertices[(i+this.k)%n];
            let ver4 = vertices[(i+this.k+this.l)%n];
            let ver = this.intersect(ver1, ver2, ver3, ver4);
            newVertices[i] = ver;

            // for debug
            // console.log(i)
            // console.log('vertex 1');
            // console.log(i%n);
            // console.log(ver1);
            // console.log('vertex 2');
            // console.log((i+this.l));
            // // console.log((i+this.l)%n);
            // // console.log(vertices[2]);
            // console.log(ver2);
            // console.log('vertex 3');
            // console.log((i+this.k)%n);
            // console.log(ver3);
            // console.log('vertex 4');
            // console.log((i+this.l+this.k)%n);
            // console.log(ver4);

            console.log(ver);
        }
        console.log(newVertices);
        console.log("hello");
        return newVertices;
    }

    intersect(ver1, ver2, ver3, ver4) {
        /*
            This method calculates the intersection of two lines by solving a linear system.
            The method takes in four vertices v_1, v_2, v_3, v_4. It construct two lines using:
                l_1(s) = v_1 + s * (v_2 - v_1)
                l_2(t) = v_3 + s * (v_4 - v_3)
            It then solves for s and t by solving a linear system

        */

        // setting up the linear system
        let mat = [[ver2.x - ver1.x, ver3.x - ver4.x], 
                   [ver2.y - ver1.y, ver3.y - ver4.y]];
        let b = [[ver3.x - ver1.x], 
                 [ver3.y - ver1.y]];
        let matInverse = invert2(mat);
        let param = matrixMult(matInverse, b);

        // finding the intersection point
        let s = param[0][0];
        let interX = ver1.x + s * (ver2.x - ver1.x);
        let interY = ver1.y + s * (ver2.y - ver1.y);
        return createVector(interX, interY);
    }

    // invert2(mat) {
    //     // invert a 2x2 matrix
    //     const det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    //     // check invertibility
    //     if (det == 0) {
    //         console.error("Matrix is not invertible");
    //         return null;
    //     }
    //     let inverse = [
    //         [mat[1][1] / det, -mat[0][1] / det],
    //         [-mat[1][0] / det, mat[0][0] / det]
    //     ];
    //     return inverse;
    // }

    // matrixMult(mat1, mat2) {
    //     // calculate the product of two matrices
    //     // mat1 is m-by-n, mat2 is n-by-k
    //     // the product should be m-by-k
    //     const m = mat1.length;
    //     const n = mat2.length;
    //     const k = mat2[0].length;

    //     // Check if matrices are valid for multiplication
    //     if (mat1[0].length != n) {
    //         console.error("Matrices cannot be multiplied: Invalid dimensions.");
    //         return null;
    //     }

    //     // Initialize the result matrix with zeros
    //     let result = new Array(m);
    //     for (let i = 0; i < m; i++) {
    //         result[i] = new Array(k);
    //     }

    //     // Perform matrix multiplication
    //     for (let i = 0; i < m; i++) {
    //         for (let j = 0; j < k; j++) {
    //             result[i][j] = 0;
    //             for (let l = 0; l < n; l++) {
    //                 result[i][j] = result[i][j] + mat1[i][l] * mat2[l][j];
    //             }
    //         }
    //     }
    //     return result;
    // }
}