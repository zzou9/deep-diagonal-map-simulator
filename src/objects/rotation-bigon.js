/**
 * A class that stores information of the polygon
 */
class RotationBigon extends Polygon{ 
    
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
        this.symmetry = this.numVertex / 2; // #-fold rotational symmetry
        this.corner = 
        this.showTrajectory = true;
        this.getTrajectory();
    }

    /**
     * Get the trajectories of vertex 1
     * @param {number} numIteration number of iterations to take the trajectory
     */
    getTrajectory(numIteration=Math.pow(2, 13)) {
        // delete the previously recorded trajectories
        this.trajectory = new Array(numIteration);
        let temp = this.vertices.map(a => a.slice()); // deep copy the vertices
        for (let j = 0; j < numIteration; j++) {
            temp = map.act(temp, false, false);
            this.trajectory[j] = temp[1];
        }
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
            stroke(color.GREEN);
            circle(0, 0, this.scale*2*Math.sqrt(2));
        }

        // draw edges
        fill(255, 255, 255, 127);
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
                line(this.vertices[i%n][0]/this.vertices[i%n][2] * this.scale, 
                    this.vertices[i%n][1]/this.vertices[i%n][2] * this.scale,
                    this.vertices[(i+l)%n][0]/this.vertices[(i+l)%n][2] * this.scale, 
                    this.vertices[(i+l)%n][1]/this.vertices[(i+l)%n][2] * this.scale
                );
            }

            // draw vertices
            fill(color.RED);
            noStroke();
            for (let i = 0; i < n; i++) {
                const v1 = this.vertices[i%n];
                const v2 = this.vertices[(i+l)%n];
                const v3 = this.vertices[(i-k+2*n)%n];
                const v4 = this.vertices[(i-k+l+2*n)%n];
                const vInt = Geometry.getIntersection(v1, v2, v3, v4);
                if (MathHelper.round(vInt[2]) == 0) {
                    throw new Error("The intersection is not on the affine patch");
                }
                circle(vInt[0]/vInt[2] * this.scale, vInt[1]/vInt[2] * this.scale, 5);
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

        // show the trajectory of the second vertex
        if (this.showTrajectory) {
            noStroke();
            for (let i = 0; i < this.trajectory.length; i++) {
                if (MathHelper.round(this.trajectory[i][2] == 0)) {
                    throw new Error("The trajectory is on the line at infinity");
                }
                fill(color.RED);
                circle(this.trajectory[i][0]  / this.trajectory[i][2] * this.scale, 
                    this.trajectory[i][1] / this.trajectory[i][2] * this.scale, 
                    1
                );
            }
        }

        // draw vertices with color red
        if (this.canDrag) {
            fill(color.RED);
            noStroke();
            for (let i = 0; i < this.numVertex; i++) {
                if (MathHelper.round(this.vertices[i][2]) == 0) {
                    throw new Error("Vertex" + i.toString() + "is not on the affine patch");
                }
                const x = this.vertices[i][0] / this.vertices[i][2];
                const y = this.vertices[i][1] / this.vertices[i][2];
                circle(x * this.scale, y * this.scale, 5);
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
                if (mX - w <= this.vertices[i][0]/this.vertices[i][2] && mX + w >= this.vertices[i][0]/this.vertices[i][2] 
                    && mY - w <= this.vertices[i][1]/this.vertices[i][2] && mY + w >= this.vertices[i][1]/this.vertices[i][2]
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
     * Broadcast the first 2 vertices to the others via the monodromy
     */
    broadcastVertices() {
        const theta = Math.PI * 2 / this.symmetry;
        const A0 = this.vertices[0];
        const A1 = this.vertices[1];
        for (let i = 1; i < this.symmetry; i++) {
            this.vertices[2*i] = [
                Math.cos(i*theta) * A0[0] - Math.sin(i*theta) * A0[1],
                Math.sin(i*theta) * A0[0] + Math.cos(i*theta) * A0[1], 
                1
            ];
            this.vertices[2*i+1] = [
                Math.cos(i*theta) * A1[0] - Math.sin(i*theta) * A1[1],
                Math.sin(i*theta) * A1[0] + Math.cos(i*theta) * A1[1], 
                1
            ];
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
        this.getTrajectory();
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