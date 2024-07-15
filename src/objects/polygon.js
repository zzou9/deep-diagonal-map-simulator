/**
 * A class that stores information of the polygon
 */
class Polygon{ 
    
    /**
     * Constructor
     * @param {PentagramMap} map the map associated to the polygon
     * @param {Number} [numVertex=7] number of vertices of the polygon
     * @param {Array<Array<Number>>} [vertices=new Array(7)] an array that stores the coords of vertices
     * @param {Boolean} inscribed whether the polygon is inscribed
     * @param {Number} scale scaling when plotting
     * @param {Boolean} canDrag whether the polygon vertices can be dragged
     */
    constructor(map,
                numVertex=7, 
                vertices=new Array(7), 
                inscribed=false,
                scale=(windowWidth + windowHeight)/20,
                canDrag=false) {
        this.map = map;
        this.numVertex = numVertex; 
        this.vertices = vertices; 
        this.inscribed = inscribed;
        this.embedded = true;
        this.convex = true;
        this.isBird = true;
        this.showNext = false; // whether to compute the next power
        this.nextEmbedded = 1;
        this.nextConvex = 1;
        this.nextBird = 1;
        this.scale = scale; 
        this.canDrag = canDrag;
        this.showDiagonal = false; // display the diagonals in the map
        this.showEllipse = false; // display the ellipse of inertia
        this.twisted = false; // whether it is a twisted n-gon
        this.updateToPanel = true; // whether to update to the shape panel

        // if regular, populate vertices
        let angle = TWO_PI / this.numVertex;
        for (let i = 0; i < this.numVertex; i++) {
            this.vertices[i] = [cos(angle*i), sin(angle*i), 1];
        }

        // normalize vertices
        this.vertices = Normalize.ellipseNormalize(this.vertices);
        this.referenceCoords = Geometry.getCornerCoords(this.vertices); // the reference corner coordinates
    }

    /**
     * Set the vertices back to default (regular n-gon)
     * @param {Number} numVertex the number of vertices of the n-gon
     */
    setDefault(numVertex) {
        this.numVertex = numVertex;
        
        // re-populate the vertices
        this.vertices = new Array(numVertex);
        let angle = TWO_PI / this.numVertex;
        for (let i = 0; i < this.numVertex; i++) {
            this.vertices[i] = [cos(angle*i), sin(angle*i), 1];
        }

        // reset the number of iterations of the map
        this.map.numIterations = 0;

        // update embedded and convexity information
        this.updateInfo();

        // normalize vertices
        this.vertices = Normalize.ellipseNormalize(this.cloneVertices());
        this.updateToPanel = true;
        this.referenceCoords = Geometry.getCornerCoords(this.vertices);
    }

    /**
     * Reset the polygon to some given vertices
     * @param {Array<Array<Number>>} verticesToSet the vertices of the polygon to set to
     */
    resetToVertices(verticesToSet) {
        this.vertices = verticesToSet;
        this.map.numIterations = 0;
        this.updateInfo();
        this.updateToPanel = true;
        this.referenceCoords = Geometry.getCornerCoords(this.vertices);
    }

    /**
     * Generates a random inscribed polygon with the same number of vertices
     */
    randomInscribed() {
        // reset the number of iterations of the map
        this.map.numIterations = 0;

        // generates a random inscribed polygon
        const n = this.numVertex;
        let angle = new Array(n);
        for (let i = 0; i < n; i++) {
            angle[i] = Math.random() * 2 * Math.PI;
        }
        angle.sort((a, b) => a - b);

        // populate vertices
        let vertices = new Array(n);
        for (let i = 0; i < n; i++) {
            vertices[i] = [cos(angle[i]), sin(angle[i]), 1];
        }

        // normalize vertices
        this.vertices = Normalize.ellipseNormalize(vertices);

        // update info
        this.updateInfo();
        this.updateToPanel = true;
        this.referenceCoords = Geometry.getCornerCoords(this.vertices);
    }

    /**
     * Generates a random convex polygon with the same number of vertices
     */
    randomConvex() {
        // reset the number of iterations of the map
        this.map.numIterations = 0;

        // generates a random inscribed polygon
        const n = this.numVertex;
        let angle = new Array(n);
        for (let i = 0; i < n; i++) {
            angle[i] = Math.random() * 2 * Math.PI;
        }
        angle.sort((a, b) => a - b);

        // populate vertices
        let vertices = new Array(n);
        for (let i = 0; i < n; i++) {
            vertices[i] = [cos(angle[i]), sin(angle[i]), 1];
        }
        let temp = new Array(n);
        let counter = 0;
        do {
            if (counter > 500) {
                temp = vertices;
                break;
            }
            for (let i = 0; i < n; i++) {
                const r = 1 - 1 / (20 * n) + Math.random() / (10 * n);
                temp[i] = [vertices[i][0] * r, vertices[i][1] * r, 1];
            }
            counter++;
        }
        while (!Geometry.isConvex(temp)) 

        // normalize vertices
        this.vertices = Normalize.ellipseNormalize(temp);

        // update info
        this.updateInfo();
        this.updateToPanel = true;
        this.referenceCoords = Geometry.getCornerCoords(this.vertices);
    }

    /**
     * Get a random star-shaped polygon
     */
    randomStarShaped() {
        // reset the number of iterations of the map
        this.map.numIterations = 0;

        // generates a random inscribed polygon
        const n = this.numVertex;
        let angle = new Array(n);
        for (let i = 0; i < n; i++) {
            angle[i] = Math.random() * 2 * Math.PI;
        }
        angle.sort((a, b) => a - b);

        // populate vertices
        let vertices = new Array(n);
        for (let i = 0; i < n; i++) {
            const r = Math.random();
            vertices[i] = [cos(angle[i]) * r, sin(angle[i]) * r, 1];
        }

        // normalize vertices
        this.vertices = Normalize.ellipseNormalize(vertices);

        // update info
        this.updateInfo();
        this.updateToPanel = true;
        this.referenceCoords = Geometry.getCornerCoords(this.vertices);
    }

    /**
     * Get a random nonconvex polygon
     */
    randomNonconvex() {
        function reroute(vertices) {
            const n = vertices.length;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < i; j++) {
                    for (let k = 0; k < i; k++) {
                        for (let l = 0; l < k; l++) {
                            if (k != j && l != j) {
                                if (Geometry.intersects(vertices[i], vertices[j], vertices[k], vertices[l])) {

                                }
                            }
                        }
                    }
                }
            }
            return vertices;
        }

        // reset the number of iterations of the map
        this.map.numIterations = 0;

        // start with a list of random points in the square spanned by (-1, -1), (-1, 1), (1, 1), (1, -1)
        const n = this.numVertex;
        let vertices = new Array(n);
        for (let i = 0; i < n; i++) {
            const sx = 2 * Math.random() - 1;
            const sy = 2 * Math.random() - 1;
            vertices[i] = [sx, sy, 1];
        }

        this.vertices = Normalize.ellipseNormalize(reroute(vertices));

        // update info
        this.updateInfo();
        this.updateToPanel = true;
        this.referenceCoords = Geometry.getCornerCoords(this.vertices);
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
            fill(color.RED);
            noStroke();
            for (let i = 0; i < n; i++) {
                const ver1 = this.vertices[i%n];
                const ver2 = this.vertices[(i+l)%n];
                const ver3 = this.vertices[(i-k+2*n)%n];
                const ver4 = this.vertices[(i-k+l+2*n)%n];
                const ver = Geometry.getIntersection(ver1, ver2, ver3, ver4);
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
            fill(color.RED);
            noStroke();
            for (let i = 0; i < this.vertices.length; i++) {
                circle(this.vertices[i][0] * this.scale, this.vertices[i][1] * this.scale, 5);
            }
        }

        translate(-xT, -yT);
    }

    /**
     * Drag a vertex 
     */
    dragVertex() {
        if (this.canDrag) {
            const w = 5 / this.scale;
            const mX = (mouseX - xT) / this.scale;
            const mY = (mouseY - yT) / this.scale;
            let dragging = false;
            for (let i = 0; i < this.numVertex; i++) {
                if (mX - w <= this.vertices[i][0] && mX + w >= this.vertices[i][0] 
                    && mY - w <= this.vertices[i][1] && mY + w >= this.vertices[i][1]
                    && dragging == false) {
                    // clear the number of iterations
                    this.map.numIterations = 0;
                    dragging = true;
                    if (this.twisted) {
                        const k = this.numVertex / 4;
                        const n = this.numVertex;
                        if (this.inscribed) {
                            const r = Math.sqrt(mX * mX + mY * mY);
                            this.vertices[i] = [mX/r*Math.sqrt(2), mY/r*Math.sqrt(2), 1];
                            this.vertices[(i+k)%n] = [-mY/r*Math.sqrt(2), mX/r*Math.sqrt(2), 1];
                            this.vertices[(i+2*k)%n] = [-mX/r*Math.sqrt(2), -mY/r*Math.sqrt(2), 1];
                            this.vertices[(i+3*k)%n] = [mY/r*Math.sqrt(2), -mX/r*Math.sqrt(2), 1];
                        } else {
                            this.vertices[i] = [mX, mY, 1];
                            this.vertices[(i+k)%n] = [-mY, mX, 1];
                            this.vertices[(i+2*k)%n] = [-mX, -mY, 1];
                            this.vertices[(i+3*k)%n] = [mY, -mX, 1];
                        }
                    } else {
                        if (this.inscribed) {
                            const r = Math.sqrt(mX * mX + mY * mY);
                            this.vertices[i] = [mX/r*Math.sqrt(2), mY/r*Math.sqrt(2), 1];
                        } else {
                            this.vertices[i] = [mX, mY, 1];
                        }
                    }
                    this.updateInfo();
                    this.updateToPanel = true;
                    this.referenceCoords = Geometry.getCornerCoords(this.vertices);
                }
            }
        }
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
            E[0][i] = Geometry.triangleOrientation(this.vertices[i], this.vertices[(i+1)%7], this.vertices[(i+2)%7]);
        }

        // second row consists of 1-2 triangles
        for (let i = 0; i < 7; i++) {
            E[1][i] = Geometry.triangleOrientation(this.vertices[i], this.vertices[(i+1)%7], this.vertices[(i+3)%7]);
        }

        // third row consists of 2-1 triangles
        for (let i = 0; i < 7; i++) {
            E[2][i] = Geometry.triangleOrientation(this.vertices[i], this.vertices[(i+2)%7], this.vertices[(i+3)%7]);
        }

        // fourth row consists of 2-2 triangles
        for (let i = 0; i < 7; i++) {
            E[3][i] = MathHelper.triangleOrientation(this.vertices[i], this.vertices[(i+2)%7], this.vertices[(i+4)%7]);
        }

        // fifth row consists of 1-3 triangles
        for (let i = 0; i < 7; i++) {
            E[4][i] = Geometry.triangleOrientation(this.vertices[i], this.vertices[(i+1)%7], this.vertices[(i+4)%7]);
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
        this.embedded = Geometry.isEmbedded(this.vertices);
        this.convex = Geometry.isConvex(this.vertices);
        this.isBird = Geometry.isBird(this.vertices, this.map.l);
        if (this.showNext) {
            this.nextEmbedded = map.getNextEmbedded(this.vertices);
            this.nextConvex = map.getNextConvex(this.vertices);
            this.nextBird = map.getNextBird(this.vertices);
        }
    }

    /**
     * Print the information of the polygon
     */
    print() {
        /* 
            Print the info of this polygon
        */
        console.log("This is a polygon with", this.numVertex, "vertices:");
        for (let i = 0; i < this.numVertex; i++) {
            // I don't know how to deal with rounding ups
            console.log("vertex", v, "is at", this.vertices[i][0], this.vertices[i][1]);
        }
    }

    /**
     * Deep clone the vertices
     * @returns {Array<Array<Number>>} a deep clone of the vertices
     */
    cloneVertices() {
        /*
            Return a deep clone of the vertices
        */
        function cloneVector(vector) {
            const x = vector[0]; 
            const y = vector[1];
            const z = vector[2];
            return [x, y, z];
        }
        return this.vertices.map(cloneVector);
    }
}