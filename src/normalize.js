class Normalize {
    static squareNormalize(vertices) {
        /*
            Normalize the shape so that the first four vertices are on the unit square
        */

        // First, record the homogeneous coords of the points
        // to project from, which will be the first four vertices
        // of the polygon

        const source = [
            [vertices[0].x, vertices[0].y, 1], 
            [vertices[1].x, vertices[1].y, 1], 
            [vertices[2].x, vertices[2].y, 1], 
            [vertices[3].x, vertices[3].y, 1], 
        ];

        // set up the homogeneous coords of the unit square
        const unitSquare = [
            [1, 1, 1],
            [-1, 1, 1],
            [-1, -1, 1],
            [1, -1, 1]
        ];

        // get the projection map
        const T = MathHelper.fourToFourProjection(source, unitSquare);

        // transform all the vertices 
        let newVertices = new Array();
        for (let i in vertices) {
            newVertices[i] = MathHelper.affineTransform(T, vertices[i]);
        }
        return newVertices;
    }
}