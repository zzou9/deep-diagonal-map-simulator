/*
    vector and matrix operations
*/

export function invert2(mat) {
    // invert a 2x2 matrix
    const det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    // check invertibility
    if (det == 0) {
        console.error("Matrix is not invertible");
        return null;
    }
    let inverse = [
        [mat[1][1] / det, -mat[0][1] / det],
        [-mat[1][0] / det, mat[0][0] / det]
    ];
    return inverse;
}

export function matrixMult(mat1, mat2) {
    // calculate the product of two matrices
    // mat1 is m-by-n, mat2 is n-by-k
    // the product should be m-by-k
    const m = mat1.length;
    const n = mat2.length;
    const k = mat2[0].length;

    // Check if matrices are valid for multiplication
    if (mat1[0].length != n) {
        console.error("Matrices cannot be multiplied: Invalid dimensions.");
        return null;
    }

    // Initialize the result matrix with zeros
    let result = new Array(m);
    for (let i = 0; i < m; i++) {
        result[i] = new Array(k);
    }

    // Perform matrix multiplication
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < k; j++) {
            result[i][j] = 0;
            for (let l = 0; l < n; l++) {
                result[i][j] = result[i][j] + mat1[i][l] * mat2[l][j];
            }
        }
    }
    return result;
}