class Test {
    /**
     * Testing class that tests methods
     */
    static debug() {
        // for debug purposes, gets called when the mouse is clicked
        // Test.testSpectralDecomposition();
    }

    static testNormalize() {
        // testing the normalization method
        polygon.vertices = Normalize.squareNormalize(polygon.cloneVertices());
    }

    /**
     * Testing the projection methdo onto the unit square
     * We wanted to fix a bug that if one attepts to normalize, applied the map, and then 
     * normalize again, the resulting shape blows up (for the setup, we used a regular 7-gon. 
     * It turned out that a rounding error occured when we applied the normalization the second time.
     */
    static testFourToFourProjection() {

        const source = [
            [0.8346811596405496, 0.8346811596405496, 1],
            [0.5000000000000002, 0.5, 1],
            [0.8346811596405496, 0.16531884035945044, 1],
            [1.1888254266874476, 0.23546145574249513, 1]
        ];

        const source2 = [
            [1, 0, 1], 
            [0.6234898018587336, 0.7818314824680298, 1],
            [-0.22252093395631434, 0.9749279121818236, 1],
            [-0.900968867902419, 0.43388373911755823, 1]
        ]

        const source3 = [
            [1.005016840154296, 1, 1], 
            [0.012009041004518018, 0.9999999999999998, 1],
            [-18.919596469298874, -19.209868703524524, 1],
            [1.2799225655915134, -2.8600919128348496, 1]
        ]

        const unitSquare = [
            [1, 1, 1],
            [0, 1, 1],
            [0, 0, 1],
            [1, 0, 1]
        ];

        const T = MathHelper.fourToFourProjection(source2, unitSquare);
        console.log(T);


        // const x = [[-AR[0][12]], [-AR[1][12]], [-AR[2][12]], 
        //     [-AR[3][12]], [-AR[4][12]], [-AR[5][12]], 
        //     [-AR[6][12]], [-AR[7][12]], [-AR[8][12]], 
        //     [-AR[9][12]], [-AR[10][12]], [-AR[11][12]], [1]
        // ]
        // console.log("multiplying A by x", this.matrixMult(A, x));
        
        const d = MathHelper.det3([[1,0,0],[0,1,0],[0,0,1]]);
    }

    static testComputeRREF() {
        // testing the Gaussian elimination method
        const matrix = [
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 1, -2, 0, 0, 0], 
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, -1, 0, 0],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, -1, 0], 
            [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1], 
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, -1]
        ];
        const rrefMatrix = MathHelper.computeRREF(matrix);
        console.log(rrefMatrix);
    }

    static testCenterOfMass() {
        console.log("Center of mass of the polygon:");
    }

    static testSpectralDecomposition() {
        const M = [
            [0.1055728091, 0],
            [0, 0.1055728089]
        ];
        const decomp = MathHelper.spectralDecomposition2(M)
        console.log(decomp);
        const Q = decomp[0];
        const Lambda = decomp[1];
        console.log(MathHelper.matrixMult(Q, MathHelper.matrixMult(Lambda, MathHelper.invert2(Q))));
    }

    static testTransposeMatrix() {
        const M = [[1, 0, 0], [0, 1, 0]];
        console.log(MathHelper.transpose(M));
    }
}