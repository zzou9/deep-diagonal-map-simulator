class Test {
    static debug() {
        // for debug purposes, gets called when the mouse is clicked
        Test.testFourToFourProjection();
    }

    static testNormalize() {
        // testing the normalization method
        polygon.vertices = Normalize.squareNormalize(polygon.cloneVertices());
    }

    static testFourToFourProjection() {
        // testing the projection method onto the unit square
        const source = [
            [0.8346811596405496, 0.8346811596405496, 1],
            [0.5000000000000002, 0.5, 1],
            [0.8346811596405496, 0.16531884035945044, 1],
            [1.1888254266874476, 0.23546145574249513, 1]
        ];
        const unitSquare = [
            [1, 1, 1],
            [0, 1, 1],
            [0, 0, 1],
            [1, 0, 1]
        ];
        const T = MathHelper.fourToFourProjection(source, unitSquare);
        console.log(T);
        
        const d = MathHelper.det3([[1,0,0],[0,1,0],[0,0,1]]);
        console.log(d);
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
}