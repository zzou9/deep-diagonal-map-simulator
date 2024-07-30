/**
 * A class designed specifically for twisted bigons
 */
class TwistedBigon{ 

    /**
     * Constructor
     * @param {TwistedMap} map the map associated to the polygon
     * @param {Number} scale scaling when plotting
     */
    constructor(map, 
        scale=(windowWidth + windowHeight)/20) {
        this.map = map;
        this.cornerCoords = new Array(4);
        this.numVertexToShow = 6;
        this.verticesToShow = new Array(this.numVertexToShow);
        this.vertexSize = 8;
        this.canDrag = true;
        this.scale = scale; 
        this.updateToPanel = true; // whether to update to the shape panel
        this.referenceCoords = [0.5, 0.5, 0.5, 0.5]; // the reference corner coordinates

        /**
         * Trajectory control:
         * Trajectory 1 corresponds to the trajectory of the first vertex
         * In the visualization polygon it shows where vertex 5 is sent to via the map
         * Trajectory 2 corresponds to the trajectory of the second vertex
         * In the visualization polygon it shows where vertex 6 is sent to via the map
         */
        this.showTrajectory1 = false;
        this.showTrajectory2 = false;
        this.iteration1 = 10; // number of iterations to show (exponential 2)
        this.iteration2 = 10;
        this.traj1Size = 2;
        this.traj2Size = 2;
        this.trajectory1 = new Array();
        this.trajectory2 = new Array();

        // Monodromy of the twisted bigon
        this.monodromy = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        this.dualMonodromy = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        this.omega1 = 0;
        this.omega2 = 0;

        this.setDefault();
    }

    /**
    * Update the information of the bigon:
    * - Vertices to display
    * - Trajectory
    * - Monodromy lift
    * - Invariants from the monodromy
    * @param {boolean} [updateTrajectory=false] whether to update the trajectory
    */
    updateInfo(updateTrajectory=false) {
        this.updateVertices();
        this.updateMonodromy();
        this.updateInvariantsFromPoly();
        if (updateTrajectory) {
            this.getTrajectory();
        }
    }

    /**
     * Update the visualization of the bigon
     */
    updateVertices() {
        this.verticesToShow = Reconstruct.reconstruct3(this.cornerCoords, this.numVertexToShow);
    }

    /**
     * Compute a lift of the monodromy (and its dual) of the twisted bigon
     * The twisted bigon has a canonical representation of its first six vertices 
     * where the first four vertices are on the unit square
     * The monodromy is calculated by finding a lift T such that 
     * T maps vertices 3, 4, 5, 6 back to the vertices of the unit square
     * The dual monodromy is computed as follows:
     *  Suppose the monodromy T = [T0, T1, T2]
     *  Then, a lift of T^* can be obtained thru 
     *  T^* = [T1 x T2, T2 x T0, T0 x T1]
     *  where "x" denotes the cross product of two vectors
     */
    updateMonodromy() {
        // first, compute the lift of the monodromy
        const v = this.verticesToShow;
        const M1 = Normalize.getProjectiveLift(v[0], v[1], v[2], v[3]);
        const M2 = Normalize.getProjectiveLift(v[2], v[3], v[4], v[5]);
        const M2Inv = MathHelper.invert3(M2);
        this.monodromy = MathHelper.matrixMult(M2Inv, M1);
        // next, compute the lift of the dual
        const T = MathHelper.transpose(this.monodromy);
        const Tdual = [
            MathHelper.cross(T[1], T[2]), 
            MathHelper.cross(T[2], T[0]),
            MathHelper.cross(T[0], T[1])
        ];
        this.dualMonodromy = MathHelper.transpose(Tdual);
    }

    /**
     * Compute the two invariants of the monodromy given in Sch07
     * Omega_1 = tr(T)^3 / det(T)
     * Omega_2 = tr(T^*)^3 / det(T^*)
     */
    updateInvariantsFromMonodromyLift() {
        const c1 = MathHelper.characteristicPoly3(this.monodromy);
        const c2 = MathHelper.characteristicPoly3(this.dualMonodromy);
        this.omega1 = Math.pow(c1[0], 3) / c1[2];
        this.omega2 = Math.pow(c2[0], 3) / c2[2];
    }

    /**
     * Compute the l2 distance from the corner coordinates of the 
     * current itertaion to the corner coordinates of itertaion 0
     * @returns The l2 distance of the corner coordinates
     */
    getDistanceToReference() {
        return MathHelper.l2dist(this.cornerCoords, this.referenceCoords);
    }

    /**
     * Compute the two invariants in [Sch07] 
     * @returns [Omega_1, Omega_2] from [Sch07]
     */
    updateInvariantsFromPoly() {
        const x = this.cornerCoords;
        // Compute Omega_1
        const num1 = Math.pow(1 - x[1] - x[3], 3);
        const denom1 = Math.pow(x[1] * x[3], 2) * (x[0] * x[2]);
        this.omega1 = num1 / denom1;
        // Compute Omega_2
        const num2 = Math.pow(1 - x[0] - x[2], 3);
        const denom2 = Math.pow(x[0] * x[2], 2) * (x[1] * x[3]);
        this.omega2 = num2 / denom2;
        return [this.omega1, this.omega2];
    }

    /**
    * Set the vertices back to default (regular 8-gon)
    */
    setDefault() {
        // first, find the corner coordinates of a regular 8-gon
        let vertices = new Array(6);
        const angle = TWO_PI / 6;
        for (let i = 0; i < 6; i++) {
            vertices[i] = [cos(angle*i), sin(angle*i), 1];
        }
        const coords = Geometry.getCornerCoords(vertices);
        for (let i = 0; i < 4; i++) {
            this.cornerCoords[i] = coords[i];
        }

        // compute the coords of the vertices to show
        this.updateInfo(true);

        // reset the number of iterations of the map
        this.map.numIterations = 0;

        this.updateToPanel = true;
        this.referenceCoords = this.cornerCoords.slice(); // deep cloning the corner coordinates
    }

    /**
    * Set the vertices to be inscribed
    */
    setToInscribed() {
    }

    /**
    * Reset the polygon to some given corner coordinates
    * @param {Array<Array<Number>>} coords the coords of the polygon to set to
    */
    resetToCoords(coords) {
        this.cornerCoords = coords;
        this.referenceCoords = this.cornerCoords.slice();
        this.map.numIterations = 0;
        this.updateInfo(true);
        this.updateToPanel = true;
    }

    /**
    * Generates a random inscribed polygon with the same number of vertices
    */
    randomInscribed() {
    }

    /**
    * Generates a random convex polygon with the same number of vertices
    */
    randomConvex() {
    }

    /**
    * Get a random star-shaped polygon
    */
    randomStarShaped() {
    }

    /**
    * Get a random nonconvex polygon
    */
    randomNonconvex() {
    }

    /**
    * Display the polygon
    */
    show() {
        // translate the coordinate system 
        translate(xT, yT);

        // draw edges
        fill(255, 255, 255, 127);
        stroke(127, 127, 127);
        beginShape();
        for (let i = 0; i < this.numVertexToShow; i++) {
            if (MathHelper.round(this.verticesToShow[i][2]) == 0) {
                throw new Error("Vertex" + i.toString() + "is not on the affine patch");
            }
            const x = this.verticesToShow[i][0] / this.verticesToShow[i][2];
            const y = this.verticesToShow[i][1] / this.verticesToShow[i][2];
            vertex((1-2*x) * this.scale, (1-2*y) * this.scale);
        }
        endShape(CLOSE);

        // draw vertices
        fill(color.WHITE);
        noStroke();
        for (let i = 0; i < this.numVertexToShow; i++) {
            if (MathHelper.round(this.verticesToShow[i][2]) == 0) {
                throw new Error("Vertex" + i.toString() + "is not on the affine patch");
            }
            const x = this.verticesToShow[i][0] / this.verticesToShow[i][2];
            const y = this.verticesToShow[i][1] / this.verticesToShow[i][2];
            circle((1-2*x) * this.scale, (1-2*y) * this.scale, 3);
        }


        // emphasize vertices to drag
        if (this.canDrag) {
            // first vertex
            fill(color.RED);
            stroke(color.BLACK);
            if (MathHelper.round(this.verticesToShow[4][2]) == 0) {
                throw new Error("Vertex 1 is not on the affine patch");
            }
            const x1 = this.verticesToShow[4][0] / this.verticesToShow[4][2];
            const y1 = this.verticesToShow[4][1] / this.verticesToShow[4][2];
            circle((1-2*x1) * this.scale, (1-2*y1) * this.scale, this.vertexSize);

            // second vertex
            fill(color.GREEN);
            stroke(color.BLACK);
            if (MathHelper.round(this.verticesToShow[5][2]) == 0) {
                throw new Error("Vertex 2 is not on the affine patch");
            }
            const x2 = this.verticesToShow[5][0] / this.verticesToShow[5][2];
            const y2 = this.verticesToShow[5][1] / this.verticesToShow[5][2];
            circle((1-2*x2) * this.scale, (1-2*y2) * this.scale, this.vertexSize);
        }

        // display trajectories
        if (this.showTrajectory1) {
            fill(color.RED);
            noStroke();
            for (let i = 0; i < this.trajectory1.length; i++) {
                if (MathHelper.round(this.trajectory1[i][2] == 0)) {
                    throw new Error("The trajectory is on the line at infinity");
                }
                const x = this.trajectory1[i][0]  / this.trajectory1[i][2];
                const y = this.trajectory1[i][1] / this.trajectory1[i][2];
                circle((1-2*x) * this.scale, (1-2*y) * this.scale, this.traj1Size);
            }
        }

        // display trajectories
        if (this.showTrajectory2) {
            fill(color.GREEN);
            noStroke();
            for (let i = 0; i < this.trajectory2.length; i++) {
                if (MathHelper.round(this.trajectory2[i][2] == 0)) {
                    throw new Error("The trajectory is on the line at infinity");
                }
                const x = this.trajectory2[i][0]  / this.trajectory2[i][2];
                const y = this.trajectory2[i][1] / this.trajectory2[i][2];
                circle((1-2*x) * this.scale, (1-2*y) * this.scale, this.traj2Size);
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
            for (let i = 4; i < 6; i++) {
                const x = this.verticesToShow[i][0] / this.verticesToShow[i][2];
                const y = this.verticesToShow[i][1] / this.verticesToShow[i][2];
                if (mX - w <= (1-2*x) && mX + w >= (1-2*x) && mY - w <= (1-2*y) && mY + w >= (1-2*y)) {
                    try {
                        // record the new vertex and check whether the bigon breaks
                        if (this.inscribed) {
                        } else {
                            this.verticesToShow[i] = [(1-mX)/2, (1-mY)/2, 1];
                        }
                        // change the corner coordinates accordingly, also change the rest of the vertices
                        const tempCoords = Geometry.getCornerCoords(this.verticesToShow.map(a => a.slice()));
                        for (let j = 0; j < 4; j++) {
                            if (!Number.isFinite(tempCoords[j+4]) || tempCoords[j+4] == 0) {
                                throw new Error("The points of the bigon are not in general positions");
                            }
                            this.cornerCoords[j] = tempCoords[j+4];
                        }
                        // clear the number of iterations
                        this.map.numIterations = 0;
                        // change the corner coordinates accordingly, also change the rest of the vertices
                        this.updateInfo(true);
                        this.updateToPanel = true;
                        this.referenceCoords = this.cornerCoords.slice();
                    }
                    catch (err) {
                        console.log(err);
                        break;
                    }
                }
            }
        }
    }


    /**
    * Print the information of the polygon
    */
    print() {
        console.log("This is a twisted bigon. Below are the corner coordinates:");
        console.log("x0:", this.cornerCoords[0]);
        console.log("x1:", this.cornerCoords[1]);
        console.log("x2:", this.cornerCoords[2]);
        console.log("x3:", this.cornerCoords[3]);
    }
    

    /**
     * Get the trajectories of vertex 1
     */
    getTrajectory() {
        if (this.showTrajectory1 || this.showTrajectory2) {
            const maxIter = Math.pow(2, Math.max(this.iteration1, this.iteration2));
            // clear cache
            this.trajectory1 = new Array();
            this.trajectory2 = new Array();
            let temp = this.cornerCoords.slice(); // deep copy the vertices
            for (let i = 0; i < maxIter; i++) {
                try {
                    temp = this.map.act(temp, false, false);
                    const vertices = Reconstruct.reconstruct3(temp, 6);
                    if (this.showTrajectory1 && i < Math.pow(2, this.iteration1)) {
                        this.trajectory1[i] = vertices[4];
                    }
                    if (this.showTrajectory2 && i < Math.pow(2, this.iteration2)) {
                        this.trajectory2[i] = vertices[5];
                    }
                }
                catch (err) {
                    break;
                }
            }
        } 
    }
}