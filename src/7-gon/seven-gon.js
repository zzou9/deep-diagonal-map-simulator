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
        this.vertices = Normalize.squareNormalize(this.vertices, 6, 0, 2, 4);
        this.vertexSize = 8;
        this.canDrag = true;
        this.components = new Map();
        this.componentRecords = new Array();
        this.trajectory = new Array();
        this.showTrajectory = false; // whether to show the trajectory of the 3rd vertex
        this.corner = Geometry.getCornerCoords(this.vertices); // the corner invariants of this polygon
        this.getTrajectory();
        this.opacity = 0.5; // the opacity of the polygon
        this.vertexColor = [color.RED, color.ORANGE, color.YELLOW, color.GREEN, color.CYAN, color.VIOLET, color.PURPLE];
    }

    /**
     * Compute the distance of the polygon to the original polygon
     * @returns the l_2 distance
     */
    getDistanceToReference() {
        const ref = this.referenceCoords;
        const curr = Geometry.getCornerCoords(this.vertices);
        return MathHelper.l2dist(ref, curr);
    }

    getPentagramInvariants() {
        const coords = Geometry.getCornerCoords(this.vertices);
        let O = 1;
        let E = 1;
        for (let i = 0; i < this.numVertex; i++) {
            O *= coords[2*i];
            E *= coords[2*i+1];
        }
        return [O, E];
    }

    /**
     * Record the distance to a txt file 
     * @param {*} iterations the number of iterations to take
     */
    recordDistance(iterations) {
        // first, record the data
        const dist = MathHelper.l2dist(Geometry.getCornerCoords(this.vertices), this.referenceCoords);
        let data = dist.toString();

        let temp = this.vertices;
        for (let i = 0; i < iterations; i++) {
            temp = this.map.act(temp, false, false);
            const dist = MathHelper.l2dist(Geometry.getCornerCoords(temp), this.referenceCoords);
            data = data + '\n' + dist.toString();
        }
        console.log(data);
    }

    recordComponents() {
        let data = "";
        for (let i = 0; i < this.componentRecords.length; i++) {
            data = data + this.componentRecords[i] + "\n";
        }
    }

    /**
     * Computes the corner coordinates of the image polygon under the (3, 1) map
     * @returns the corner coordinates
     */
    getImageCornerCoords31() {
        const n = this.numVertex;
        let coords = new Array(2*n);
        for (let i = 0; i < n; i++) {
            // positive oriented flag

            // base vector <i-3, i> and <i-2, i+1>
            const v0 = Geometry.getIntersection(this.vertices[(i-3+n)%n], this.vertices[i], this.vertices[(i-2+n)%n], this.vertices[(i+1)%n]);
            // intersection of <i, i+3> and <i-3, i>
            const v1 = this.vertices[i];
            // intersection of <i, i+3> and <i-2, i+1>
            const v2 = Geometry.getIntersection(this.vertices[i], this.vertices[(i+3)%n], this.vertices[(i-2+n)%n], this.vertices[(i+1)%n]);
            // intersection of <i, i+3> and <i-1, i+2>
            const v3 = Geometry.getIntersection(this.vertices[i], this.vertices[(i+3)%n], this.vertices[(i-1+n)%n], this.vertices[(i+2)%n]);
            // intersection of <i, i+3> and <i+1, i+4>
            const v4 = Geometry.getIntersection(this.vertices[i], this.vertices[(i+3)%n], this.vertices[(i+1)%n], this.vertices[(i+4)%n]);

            coords[2*i+1] = Geometry.inverseCrossRatio(v1, v2, v3, v4);

            // negative oriented flag

            // base vector <i, i+3> and <i-1, i+2>
            const u0 = Geometry.getIntersection(this.vertices[i], this.vertices[(i+3)%n], this.vertices[(i-1+n)%n], this.vertices[(i+2)%n]);
            // intersection of <i-3, i> and <i, i+3>
            const u1 = this.vertices[i];
            // intersection of <i-3, i> and <i-1, i+2>
            const u2 = Geometry.getIntersection(this.vertices[(i-3+n)%n], this.vertices[i], this.vertices[(i-1+n)%n], this.vertices[(i+2)%n]);
            // intersection of <i-3, i> and <i-2, i+1>
            const u3 = Geometry.getIntersection(this.vertices[(i-3+n)%n], this.vertices[i], this.vertices[(i-2+n)%n], this.vertices[(i+1)%n]);
            // intersection of <i-3, i> and <i-4, i-1>
            const u4 = Geometry.getIntersection(this.vertices[(i-3+n)%n], this.vertices[i], this.vertices[(i-4+n)%n], this.vertices[(i-1+n)%n]);
            
            coords[2*i] = Geometry.inverseCrossRatio(u1, u2, u3, u4);
        }

        return coords;
    }

    /**
     * Compute a triangle embedding of a 7-gon (only useful for 7-gons).
     * The embedding is stored in a 3D array E, where E[i][j][k]
     * stores the orientation of the triangle spanned by the vertices
     * i, j, k. 
     * @returns {Array<Array<Array<Number>>>} the embedding array
     */
    triangleEmbedding7() {
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
            E[3][i] = Geometry.triangleOrientation(this.vertices[i], this.vertices[(i+2)%7], this.vertices[(i+4)%7]);
        }

        // fifth row consists of 1-3 triangles
        for (let i = 0; i < 7; i++) {
            E[4][i] = Geometry.triangleOrientation(this.vertices[i], this.vertices[(i+1)%7], this.vertices[(i+4)%7]);
        }

        return E;
    }

    /**
     * Hash the triangle embedding of the current polygon to the component hashmap.
     * The embedding is calculated as follows: 
     * Each embedding is an 5x7 array of {-1, 1}
     * The hash key is an integer between 0 and 2^35
     * Loop through the array. 
     * If the ij-th entry is 1, add 2^(j+7*i) to the hash key.
     * If the ij-th entry is -1, keep the hash key.
     * Use the final value for the hash key after looping through the entire array.
     */
    hashTriangleComponents() {
        // first, obtain the hash value
        const emb = this.triangleEmbedding7();
        let val = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 7; j++) {
                if (emb[i][j] == 1) {
                    const power = j + 7 * i;
                    val += Math.pow(2, power);
                }
            }
        }
        // hash
        if (!this.components.has(val)) {
            this.components.set(val, this.components.size);
        }
        // record the array
        this.componentRecords.push(this.components.get(val));
    }

    /**
     * Get the trajectories of vertex 1, 3, 5
     * @param {number} numIteration number of iterations to take the trajectory
     */
    getTrajectory(numIteration=Math.pow(2, 13)) {
        // delete the previously recorded trajectories
        this.trajectory = new Array(3);
        for (let i = 0; i < 3; i++) {
            this.trajectory[i] = new Array(numIteration);
        }
        let temp = this.vertices.map(a => a.slice()); // deep copy the vertices
        for (let j = 0; j < numIteration; j++) {
            temp = map.act(temp, false, false);
            this.trajectory[0][j] = temp[1];
            this.trajectory[1][j] = temp[3];
            this.trajectory[2][j] = temp[5];
        }
    }

    /**
     * Set the vertices back to default (regular n-gon)
     * @param {Number} numVertex the number of vertices of the n-gon
     */
    setDefault(numVertex) {
        super.setDefault(numVertex);
        this.vertices = Normalize.squareNormalize(this.vertices, 6, 0, 2, 4);
        this.components = new Map();
        this.componentRecords = new Array();
        this.corner = Geometry.getCornerCoords(this.vertices);
        this.getTrajectory();
    }

    /**
     * Set the vertices to be inscribed
     */
    setToInscribed() {
        super.setToInscribed();
        this.getTrajectory();
        this.corner = Geometry.getCornerCoords(this.vertices);
    }

    /**
     * Reset the polygon to some given vertices
     * @param {Array<Array<Number>>} verticesToSet the vertices of the polygon to set to
     */
    resetToVertices(verticesToSet) {
        super.resetToVertices(verticesToSet);
        this.vertices = Normalize.squareNormalize(this.vertices, 6, 0, 2, 4);
        this.components = new Map();
        this.componentRecords = new Array();
        this.corner = Geometry.getCornerCoords(this.vertices);
        this.getTrajectory();
    }

    /**
     * Generates a random inscribed polygon with the same number of vertices
     */
    randomInscribed() {
        super.randomInscribed();
        this.components = new Map();
        this.componentRecords = new Array();
        this.corner = Geometry.getCornerCoords(this.vertices);
        this.getTrajectory();
    }

    /**
     * Generates a random convex polygon with the same number of vertices
     */
    randomConvex() {
        super.randomConvex();
        this.vertices = Normalize.squareNormalize(this.vertices, 6, 0, 2, 4);
        this.components = new Map();
        this.componentRecords = new Array();
        this.corner = Geometry.getCornerCoords(this.vertices);
        this.getTrajectory();
    }

    /**
     * Get a random star-shaped polygon
     */
    randomStarShaped() {
        super.randomStarShaped();
        this.vertices = Normalize.squareNormalize(this.vertices, 6, 0, 2, 4);
        this.components = new Map();
        this.componentRecords = new Array();
        this.corner = Geometry.getCornerCoords(this.vertices);
        this.getTrajectory();
    }

    /**
     * Get a random nonconvex polygon
     */
    randomNonconvex() {
        super.randomNonconvex();
        this.vertices = Normalize.squareNormalize(this.vertices, 6, 0, 2, 4);
        this.components = new Map();
        this.componentRecords = new Array();
        this.corner = Geometry.getCornerCoords(this.vertices);
        this.getTrajectory();
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
        const alpha = Math.floor(this.opacity * 256 - 1);
        fill(255, 255, 255, alpha);
        stroke(color.BLACK);
        beginShape();
        for (let i = 0; i < this.numVertex; i++) {
            if (MathHelper.round(this.vertices[i][2]) == 0) {
                throw new Error("Vertex " + i.toString() + " is not on the affine patch");
            }
            const x = this.vertices[i][0] / this.vertices[i][2];
            const y = this.vertices[i][1] / this.vertices[i][2];
            vertex(x * this.scale, y * this.scale);
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
                fill(this.vertexColor[(i+this.map.shifts)%n]);
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

        // show the trajectories
        if (this.showTrajectory) {
            noStroke();
            for (let i = 0; i < this.trajectory[0].length; i++) {
                if (MathHelper.round(this.trajectory[0][i][2]) == 0) {
                    throw new Error("Vertex 1 is on the line at infinity");
                }
                fill(this.vertexColor[1]);
                circle(this.trajectory[0][i][0] / this.trajectory[0][i][2] * this.scale, 
                    this.trajectory[0][i][1] / this.trajectory[0][i][2] * this.scale, 1
                );

                if (MathHelper.round(this.trajectory[1][i][2]) == 0) {
                    throw new Error("Vertex 3 is on the line at infinity");
                }
                fill(this.vertexColor[3]);
                circle(this.trajectory[1][i][0] / this.trajectory[1][i][2] * this.scale, 
                    this.trajectory[1][i][1] / this.trajectory[1][i][2] * this.scale, 1
                );

                if (MathHelper.round(this.trajectory[2][i][2]) == 0) {
                    throw new Error("Vertex 5 is on the line at infinity");
                }
                fill(this.vertexColor[5]);
                circle(this.trajectory[2][i][0] / this.trajectory[2][i][2] * this.scale, 
                    this.trajectory[2][i][1] / this.trajectory[2][i][2] * this.scale, 1
                );
            }
        }

        // draw vertices with color
        if (this.canDrag) {
            stroke(color.BLACK);
            for (let i = 0; i < this.numVertex; i++) {
                const x = this.vertices[i][0] / this.vertices[i][2];
                const y = this.vertices[i][1] / this.vertices[i][2];
                fill(this.vertexColor[i]);
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
                    if (this.showTrajectory) {
                        this.getTrajectory();
                    }
                    this.updateToPanel = true;
                    this.referenceCoords = Geometry.getCornerCoords(this.vertices);
                    this.corner = Geometry.getCornerCoords(this.vertices);
                }
            }
        }
    }

    // /**
    //  * Compute the energy of the map (as in [Sch24])
    //  * @returns the energy
    //  */
    // computeEnergy() {
    //     const n = this.numVertex;
    //     const l = this.map.l;
    //     const k = this.map.k;
    //     const v = this.vertices;
    //     let energy = 1;
    //     for (let i = 0; i < n; i++) {
    //         const l1 = MathHelper.cross(v[i], v[(i-l+n)%n]);
    //         const l2 = MathHelper.cross(v[i], v[(i-k+n)%n]);

    //         energy *= Geometry.inverseCrossRatio(l1, l2, l3, l4);
    //     }
    //     return energy;
    // }

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
