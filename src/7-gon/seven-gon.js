/**
 * A class that stores information of the polygon
 */
class SevenGon extends Polygon {
    
    /**
     * Constructor
     * @param {PentagramMap} map the map associated to the polygon
     */
    constructor(map) {
        super(map);
        this.vertexColor = [color.RED, color.ORANGE, color.YELLOW, color.GREEN, color.BLUE, color.VIOLET, color.PURPLE];
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Compute the distance of the polygon to the original polygon
     * @returns the l_2 distance
     */
    getDistanceToReference() {
        let ref = this.referenceCoords;
        let curr = MathHelper.getCornerCoords(this.vertices);
        let n = this.numVertex
        let dist = 0
        for (let i = 0; i < 2*n; i++) {
            dist += Math.pow(ref[i] - curr[i], 2);
        }
        return Math.sqrt(dist);
    }

    /**
     * Record the distance to a txt file 
     * @param {*} iterations the number of iterations to take
     */
    recordDistance(iterations) {
        // first, record the data
        const dist = MathHelper.l2dist(MathHelper.getCornerCoords(this.vertices), this.referenceCoords);
        let data = dist.toString();

        let temp = this.vertices;
        for (let i = 0; i < iterations; i++) {
            temp = this.map.act(temp, false, false);
            const dist = MathHelper.l2dist(MathHelper.getCornerCoords(temp), this.referenceCoords);
            data = data + '\n' + dist.toString();
        }
        console.log(data);

        // write it to a file
        
    }

    /**
     * Set the vertices back to default (regular n-gon)
     * @param {Number} numVertex the number of vertices of the n-gon
     */
    setDefault(numVertex) {
        super.setDefault(numVertex);
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Reset the polygon to some given vertices
     * @param {Array<Array<Number>>} verticesToSet the vertices of the polygon to set to
     */
    resetToVertices(verticesToSet) {
        super.resetToVertices(verticesToSet);
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Generates a random inscribed polygon with the same number of vertices
     */
    randomInscribed() {
        super.randomInscribed();
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Generates a random convex polygon with the same number of vertices
     */
    randomConvex() {
        super.randomConvex();
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Get a random star-shaped polygon
     */
    randomStarShaped() {
        super.randomStarShaped();
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Get a random nonconvex polygon
     */
    randomNonconvex() {
        super.randomNonconvex();
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Display the polygon
     */
    show() {
        // translate the coordinate system 
        translate(xT, yT);

        // draw the inscribed circle if the polygon is inscribed
        if (this.inscribed) {
            noFill();
            stroke(color.RED);
            circle(0, 0, this.scale*2*Math.sqrt(2));
        }

        // draw edges
        fill(color.WHITE);
        stroke(color.BLACK);
        beginShape();
        for (let i in this.vertices) {
            vertex(this.vertices[i][0] * this.scale, this.vertices[i][1] * this.scale);
        }
        endShape(CLOSE);

        // draw the diagonal lines the map is acting on
        if (this.showDiagonal) {
            const l = this.map.l; // diagonal to take
            const k = this.map.k; // points to skip
            const n = this.numVertex; // number of vertices
            
            // draw diagonals
            stroke(color.GREEN);
            for (let i = 0; i < n; i++) {
                line(this.vertices[i%n][0] * this.scale, this.vertices[i%n][1] * this.scale,
                    this.vertices[(i+l)%n][0] * this.scale, this.vertices[(i+l)%n][1] * this.scale
                );

            }

            // draw vertices
            noStroke();
            for (let i = 0; i < n; i++) {
                const ver1 = this.vertices[i%n];
                const ver2 = this.vertices[(i+l)%n];
                const ver3 = this.vertices[(i-k+2*n)%n];
                const ver4 = this.vertices[(i-k+l+2*n)%n];
                const ver = MathHelper.getIntersection(ver1, ver2, ver3, ver4);
                fill(this.vertexColor[i]);
                circle(ver[0] * this.scale, ver[1] * this.scale, 5);
            }
        }

        // draw the ellipse of inertia
        if (this.showEllipse) {
            const Ip = Normalize.getInertiaMatrix(this.vertices);
            const decomp = MathHelper.spectralDecomposition2(Ip);
            const Q = decomp[0];
            const Lambda = decomp[1];
            const theta = Math.atan(Q[1][0] / Q[0][0]);

            // draw the ellipse
            rotate(-theta);
            noFill();
            stroke(color.GREEN);
            ellipse(0, 0, Math.sqrt(Lambda[0][0], 2) * this.scale, Math.sqrt(Lambda[1][1], 2) * this.scale);
            rotate(theta);
        }

        // draw vertices with color red
        if (this.canDrag) {
            stroke(color.BLACK);
            for (let i = 0; i < this.vertices.length; i++) {
                fill(this.vertexColor[i]);
                circle(this.vertices[i][0] * this.scale, this.vertices[i][1] * this.scale, 8);
            }
        }

        translate(-xT, -yT);
    }

    /**
     * Drag a vertex 
     */
    dragVertex() {
        super.dragVertex();
        this.referenceCoords = MathHelper.getCornerCoords(this.vertices);
    }

    /**
     * Compute a triangle embedding of a 7-gon (only useful for 7-gons).
     * The embedding is stored in a 3D array E, where E[i][j][k]
     * stores the orientation of the triangle spanned by the vertices
     * i, j, k. 
     * @returns {Array<Array<Array<Number>>>} the embedding array
     */
    triangleEmbedding7() {
        if (this.numVertex != 7) {
            throw "This is not a 7-gon";
        }
        // setting up the embedding array
        // The array is in the format of 1-1, 1-2, 2-1, 2-2, 1-3 triangles, each beginning with vertices 0-6
        let E = new Array(5);
        for (let i = 0; i < 5; i++) {
            E[i] = new Array(7);
        }

        // first row consists of 1-1 triangles
        for (let i = 0; i < 7; i++) {
            E[0][i] = MathHelper.triangleOrientation(this.vertices[i], this.vertices[(i+1)%7], this.vertices[(i+2)%7]);
        }

        // second row consists of 1-2 triangles
        for (let i = 0; i < 7; i++) {
            E[1][i] = MathHelper.triangleOrientation(this.vertices[i], this.vertices[(i+1)%7], this.vertices[(i+3)%7]);
        }

        // third row consists of 2-1 triangles
        for (let i = 0; i < 7; i++) {
            E[2][i] = MathHelper.triangleOrientation(this.vertices[i], this.vertices[(i+2)%7], this.vertices[(i+3)%7]);
        }

        // fourth row consists of 2-2 triangles
        for (let i = 0; i < 7; i++) {
            E[3][i] = MathHelper.triangleOrientation(this.vertices[i], this.vertices[(i+2)%7], this.vertices[(i+4)%7]);
        }

        // fifth row consists of 1-3 triangles
        for (let i = 0; i < 7; i++) {
            E[4][i] = MathHelper.triangleOrientation(this.vertices[i], this.vertices[(i+1)%7], this.vertices[(i+4)%7]);
        }

        return E;
    }

    /**
     * Compute the energy of the map (as in [Sch24])
     * @returns the energy
     */
    computeEnergy() {
        const n = this.numVertex;
        const l = this.map.l;
        const k = this.map.k;
        const v = this.vertices;
        let energy = 1;
        for (let i = 0; i < n; i++) {
            const l1 = [v[i][0] - v[(i-k+n)%n][0], v[i][1] - v[(i-k+n)%n][1]];
            const l2 = [v[i][0] - v[(i-l+n)%n][0], v[i][1] - v[(i-l+n)%n][1]];
            const l3 = [v[i][0] - v[(i+l)%n][0], v[i][1] - v[(i+l)%n][1]];
            const l4 = [v[i][0] - v[(i+k+n)%n][0], v[i][1] - v[(i+k+n)%n][1]];
            energy *= MathHelper.crossRatio(l1, l2, l3, l4);
        }
        return energy;
    }

    /**
     * Update the information of the polygon: 
     * Whether the polygon is embedded/convex/bird
     * The nex embedded/convex/bird power of the polygon
     */
    updateInfo() {
        super.updateInfo();
    }

    /**
     * Print the information of the polygon
     */
    print() {
        super.print();
    }
}
