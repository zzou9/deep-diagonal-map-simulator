/**
 * A class that stores information of the polygon
 */
class TwistedBigon extends Polygon{ 
    
    /**
     * Constructor
     * @param {PentagramMap} map the map associated to the polygon
     * @param {Number} [numVertex=8] number of vertices of the polygon
     * @param {Array<Array<Number>>} [vertices=new Array(8)] an array that stores the coords of vertices
     * @param {Boolean} inscribed whether the polygon is inscribed
     * @param {Number} scale scaling when plotting
     * @param {Boolean} canDrag whether the polygon vertices can be dragged
     */
    constructor(map,
                numVertex=8, 
                vertices=new Array(8), 
                inscribed=false,
                scale=(windowWidth + windowHeight)/20,
                canDrag=false) {
        super(map, numVertex, vertices, inscribed, scale, canDrag);
        this.twisted = true; // whether it is a twisted n-gon
        this.symmetry = 4; // #-fold rotational symmetry
    }

    /**
     * Set the vertices back to default (regular n-gon)
     * @param {Number} numVertex the number of vertices of the n-gon
     */
    setDefault(numVertex) {
        super.setDefault(numVertex);
        this.symmetry = numVertex/2;
    }

    /**
     * Set the vertices to be inscribed
     */
    setToInscribed() {
        super.setToInscribed();
    }

    /**
     * Reset the polygon to some given vertices
     * @param {Array<Array<Number>>} verticesToSet the vertices of the polygon to set to
     */
    resetToVertices(verticesToSet) {
        super.resetToVertices(verticesToSet);
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
                    const n = this.numVertex;
                    const theta = 2 * Math.PI / this.symmetry // angle to rotate
                    if (this.inscribed) {
                        const r = Math.sqrt(mX * mX + mY * mY);
                        const nX = mX/r*Math.sqrt(2); // normalized x coordinate
                        const nY = mY/r*Math.sqrt(2); // normalized y coordinate
                        for (let j = 0; j < this.symmetry; j++) {
                            this.vertices[(i+j*2)%n] = [
                                nX * Math.cos(j*theta) - nY * Math.sin(j*theta),
                                nX * Math.sin(j*theta) + nY * Math.cos(j*theta),
                                1
                            ];
                        }
                    } else {
                        for (let j = 0; j < this.symmetry; j++) {
                            this.vertices[(i+j*2)%n] = [
                                mX * Math.cos(j*theta) - mY * Math.sin(j*theta),
                                mX * Math.sin(j*theta) + mY * Math.cos(j*theta),
                                1
                            ];
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
     * Compute the energy of the map (as in [Sch24])
     * @returns the energy
     */
    computeEnergy() {
        super.computeEnergy();
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

    /**
     * Deep clone the vertices
     * @returns {Array<Array<Number>>} a deep clone of the vertices
     */
    cloneVertices() {
        return this.vertices.map(a => a.slice());
    }
}