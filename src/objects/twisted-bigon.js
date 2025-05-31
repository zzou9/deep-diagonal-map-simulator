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
        this.cornerCoords = [1, 1, 1, 1];
        this.energyCoords = new Array(4);
        this.energy = 1;
        this.O = 1;
        this.E = 1;
        this.numVertexToShow = 6;
        this.verticesToShow = new Array(this.numVertexToShow);
        this.vertexSize = 8;
        this.canDrag = false;
        this.scale = scale; 
        this.referenceCoords = this.cornerCoords.slice(); // the reference corner coordinates

        /**
         * Trajectory control:
         * Trajectory 1 corresponds to the trajectory of the first vertex
         * In the visualization polygon it shows where vertex 5 is sent to via the map
         * Trajectory 2 corresponds to the trajectory of the second vertex
         * In the visualization polygon it shows where vertex 6 is sent to via the map
         */
        this.showTrajectory1 = true;
        this.showTrajectory2 = true;
        this.iteration1 = 10; // number of iterations to show (exponential 2)
        this.iteration2 = 10;
        this.traj1Size = 2;
        this.traj2Size = 2;
        this.trajectory1 = new Array();
        this.trajectory2 = new Array();
        this.cornerCoordTraj = new Array();

        // Monodromy of the twisted bigon
        this.monodromy = new Array(3);
        this.eigenvalues = new Array(3);
        this.dualMonodromy = new Array(3);
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
    * @param {boolean} [resetReference=false] whether to reset the reference coordinates
    */
    updateInfo(updateTrajectory=false, resetReference=false) {
        this.updateMonodromy();
        this.updateEnergyCoords();
        this.updateVertices();
        this.updateEigenvalues();
        this.updateInvariantsFromPoly();
        if (updateTrajectory) {
            this.getTrajectory();
        }
        if (resetReference) {
            this.referenceCoords = this.cornerCoords.slice();
            this.map.numIterations = 0;
        }
    }

    /**
     * Update the visualization of the bigon
     */
    updateVertices() {
        this.verticesToShow = Reconstruct.reconstructBigon(this.monodromy, this.numVertexToShow);
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
        const v = Reconstruct.reconstructBigon6(this.cornerCoords);
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
     * Update the eigenvalues of the monodromy
     */
    updateEigenvalues() {
        const T = this.monodromy;
        const det = MathHelper.det3(T);
        const Tnormal = [
            [T[0][0]/det, T[0][1]/det, T[0][2]/det],
            [T[1][0]/det, T[1][1]/det, T[1][2]/det],
            [T[2][0]/det, T[2][1]/det, T[2][2]/det]
        ];
        const evals = MathHelper.eigenvalue3(Tnormal);
        if (evals[3] == 1) {
            this.eigenvalues = [
                MathHelper.round(evals[0], 5).toString(),
                MathHelper.round(evals[1], 5).toString(),
                MathHelper.round(evals[2], 5).toString()
            ];
        } else {
            this.eigenvalues = [
                MathHelper.round(evals[0], 5).toString(),
                evals[1].toString(),
                evals[2].toString()
            ];
        }
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
     * Update the energy coordinates given by the cross ratio of (k,l) map
     */
    updateEnergyCoords() {
        this.energyCoords = new Array(4);
        const k = this.map.l;
        const l = this.map.k;
        // use monodromy to get vertices of a lift
        let vertices = Reconstruct.reconstructBigon(this.monodromy, 2*k+2);
        // compute the coordinates 
        let coords = Geometry.getEnergyCoords(vertices, k, l);
        for (let i = 0; i < 4; i++) {
            this.energyCoords[(2*k+i)%4] = coords[2*k+i];
        }
        // this.energyCoords[0] = coords[2*k];
        // this.energyCoords[1] = coords[2*k+1];
        // this.energyCoords[2] = coords[2*k+2];
        // this.energyCoords[3] = coords[2*k+3];

        // update energy, O, E
        this.O = this.energyCoords[0] * this.energyCoords[2];
        this.E = this.energyCoords[1] * this.energyCoords[3];
        this.energy = this.O * this.E;
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
        let vertices = new Array(8);
        const angle = TWO_PI / 9;
        for (let i = 0; i < 9; i++) {
            vertices[i] = [cos(angle*i), sin(angle*i), 1];
        }
        const coords = Geometry.getCornerCoords(vertices);
        for (let i = 0; i < 4; i++) {
            this.cornerCoords[i] = coords[i];
        }

        // compute the coords of the vertices to show
        this.updateInfo(true, true);
    }

    /**
    * Reset the polygon to some given corner coordinates
    * @param {Array<Array<Number>>} coords the coords of the polygon to set to
    */
    resetToCoords(coords) {
        this.cornerCoords = coords;
        this.updateInfo(true, true);
    }

    /**
    * Display the polygon
    * @param {number} [xt=xT] x axis translation
    * @param {number} [yt=yT] y axis translation
    */
    show(xt=xT, yt=yT) {
        // translate the coordinate system 
        translate(xt, yt);

        // draw edges
        fill(255, 255, 255, 127);
        stroke(255, 255, 255);
        beginShape();
        for (let i = 0; i < this.numVertexToShow; i++) {
            if (MathHelper.round(this.verticesToShow[i][2]) == 0) {
                throw new Error("Vertex " + i.toString() + " is not on the affine patch");
            }
            const x = this.verticesToShow[i][0] / this.verticesToShow[i][2];
            const y = this.verticesToShow[i][1] / this.verticesToShow[i][2];
            vertex((2*x-1) * this.scale, (1-2*y) * this.scale);
        }
        endShape(CLOSE);

        // draw vertices
        fill(color.WHITE);
        noStroke();
        for (let i = 0; i < this.numVertexToShow; i++) {
            if (MathHelper.round(this.verticesToShow[i][2]) == 0) {
                throw new Error("Vertex " + i.toString() + " is not on the affine patch");
            }
            const x = this.verticesToShow[i][0] / this.verticesToShow[i][2];
            const y = this.verticesToShow[i][1] / this.verticesToShow[i][2];
            circle((2*x-1) * this.scale, (1-2*y) * this.scale, 3);
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
            circle((2*x1-1) * this.scale, (1-2*y1) * this.scale, this.vertexSize);

            // second vertex
            fill(color.GREEN);
            stroke(color.BLACK);
            if (MathHelper.round(this.verticesToShow[5][2]) == 0) {
                throw new Error("Vertex 2 is not on the affine patch");
            }
            const x2 = this.verticesToShow[5][0] / this.verticesToShow[5][2];
            const y2 = this.verticesToShow[5][1] / this.verticesToShow[5][2];
            circle((2*x2-1) * this.scale, (1-2*y2) * this.scale, this.vertexSize);
        }

        // display trajectories
        if (this.showTrajectory1) {
            fill(color.RED);
            noStroke();
            for (let i = 0; i < this.trajectory1.length; i++) {
                if (MathHelper.round(this.trajectory1[i][2] == 0)) {
                    continue;
                }
                const x = this.trajectory1[i][0]  / this.trajectory1[i][2];
                const y = this.trajectory1[i][1] / this.trajectory1[i][2];
                circle((2*x-1) * this.scale, (1-2*y) * this.scale, this.traj1Size);
            }
        }

        // display trajectories
        if (this.showTrajectory2) {
            fill(color.GREEN);
            noStroke();
            for (let i = 0; i < this.trajectory2.length; i++) {
                if (MathHelper.round(this.trajectory2[i][2] == 0)) {
                    continue;
                }
                const x = this.trajectory2[i][0]  / this.trajectory2[i][2];
                const y = this.trajectory2[i][1] / this.trajectory2[i][2];
                circle((2*x-1) * this.scale, (1-2*y) * this.scale, this.traj2Size);
            }
        }

        translate(-xt, -yt);
    }

    /**
    * Drag a vertex 
    * @param {number} [xt=xT] x axis translation
    * @param {number} [yt=yT] y axis translation
    * @param {number} [scale=this.scale] scaling of the polygon
    */
    dragVertex(xt=xT, yt=yT, scale=this.scale) {
        if (this.canDrag) {
            const w = 10 / scale;
            const mX = (mouseX - xt) / scale;
            const mY = (mouseY - yt) / scale;
            for (let i = 4; i < 6; i++) {
                const x = this.verticesToShow[i][0] / this.verticesToShow[i][2];
                const y = this.verticesToShow[i][1] / this.verticesToShow[i][2];
                if (mX - w <= (2*x-1) && mX + w >= (2*x-1) && mY - w <= (1-2*y) && mY + w >= (1-2*y)) {
                    try {
                        // record the new vertex and check whether the bigon breaks
                        if (this.inscribed) {
                        } else {
                            this.verticesToShow[i] = [(1+mX)/2, (1-mY)/2, 1];
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
                        this.updateInfo(true, true);
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
            this.cornerCoordTraj = new Array(maxIter);
            let temp = this.cornerCoords.slice(); // deep copy the vertices
            for (let i = 0; i < maxIter; i++) {
                try {
                    temp = this.map.act(temp, false, false, false);
                    this.cornerCoordTraj[i] = temp;
                    const vertices = Reconstruct.reconstructBigon6(temp);
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

    /**
     * Print the first three coords of the trajectory
     */
    printTrajectory() {
        let repl = 'x0,x1,x2\n';
        for (let i = 0; i < this.cornerCoordTraj.length; i++) {
            repl = repl + this.cornerCoordTraj[i][0].toString() + ',' + this.cornerCoordTraj[i][1].toString() + ',' + this.cornerCoordTraj[i][2].toString() + '\n'
        } 
        console.log(repl);
    }

    /**
     * Check whether a polygon has a degenerate orbit under the map
     * @returns true if has degenerate orbit, false if the orbit is compact
     */
    hasDegenerateOrbit() {
        this.getTrajectory();
        if (this.trajectory1.length == 0) {
            return true;
        }
        const vCheck = [
            [0, 0], 
            [1, 0], 
            [1, 1], 
            [0, 1]
        ];
        for (let i = 0; i < this.iteration1; i++) {
            const v = this.trajectory1[i];
            if (v[2] == 0) {
                return true;
            }
            const vl = [v[0]/v[2], v[1]/v[2]];
            for (let j = 0; j < 4; j++) {
                if (MathHelper.l2dist(vl, vCheck[j]) < Math.pow(10, -2)) {
                    return true;
                }
            }
        }
        for (let i = 0; i < this.iteration2; i++) {
            const v = this.trajectory2[i];
            if (v[2] == 0) {
                return true;
            }
            const vl = [v[0]/v[2], v[1]/v[2]];
            for (let j = 0; j < 4; j++) {
                if (MathHelper.l2dist(vl, vCheck[j]) < Math.pow(10, -2)) {
                    return true;
                }
            }
        }
        return false;
    }


    /**
     * Compute the two invariants from the (3, 1) coordinates
     * @returns [Omega_1, Omega_2]
     */
    getInvariantsFrom31() {
        const e = Geometry.translate21To31(this.cornerCoords.slice());
        const num1 = Math.pow(e[0]*e[2] - 1, 2) * (e[1]*e[3] - 1) * (e[1] - 1) * (e[3] - 1);
        const denom1 = e[1]*e[1]*e[3]*e[3]*e[0]*e[2]*(e[0] - 1)*(e[2] - 1);
        const omega1 = -num1 / denom1;
        const num2 = Math.pow(e[1]*e[3] - 1, 2) * (e[0]*e[2] - 1) * (e[0] - 1) * (e[2] - 1);
        const denom2 = e[0]*e[0]*e[2]*e[2]*e[1]*e[3]*(e[1] - 1)*(e[3] - 1);
        const omega2 = -num2 / denom2;
        return [omega1, omega2];
    }

    /**
     * Obsolete methods
     */


    /**
     * Compute the l2 distance of the visualization of P1 and P2
     * @returns the l2 distance between P1 and P2
     */
    getP1P2Dist() {
        const v1 = this.verticesToShow[3];
        const v2 = this.verticesToShow[4];
        const p1 = [v1[0]/v1[2], v1[1]/v1[2]];
        const p2 = [v2[0]/v2[2], v2[1]/v2[2]];
        return MathHelper.l2dist(p1, p2);
    }

    /**
     * Compute the angle between the two vectors: p1p2 and p0p1
     * @returns the signed angle in radians
     */
    getTheta1Angle() {
        const v = this.verticesToShow[4];
        const p2 = [v[0]/v[2], v[1]/v[2]];
        const p0p1 = [-1, 0];
        const p1p2 = [p2[0], p2[1]-1];
        // compute the angle of two vectors
        return MathHelper.angle2D(p1p2, p0p1);
    }

    /**
     * Compute the l2 distance of the visualization of P2 and P3
     * @returns the l2 distance between P2 and P3
     */
    getP2P3Dist() {
        const v2 = this.verticesToShow[4];
        const v3 = this.verticesToShow[5];
        const p2 = [v2[0]/v2[2], v2[1]/v2[2]];
        const p3 = [v3[0]/v3[2], v3[1]/v3[2]];
        return MathHelper.l2dist(p2, p3);
    }

    /**
     * Compute the angle between the two vectors: p2p3 and p1p2
     * @returns the signed angle in radians
     */
    getTheta2Angle() {
        const v2 = this.verticesToShow[4];
        const v3 = this.verticesToShow[5];
        const p2 = [v2[0]/v2[2], v2[1]/v2[2]];
        const p3 = [v3[0]/v3[2], v3[1]/v3[2]];
        const p1p2 = [p2[0], p2[1]-1];
        const p2p3 = [p3[0]-p2[0], p3[1]-p2[1]];
        // compute the angle of two vectors
        return MathHelper.angle2D(p2p3, p1p2);
    }

}