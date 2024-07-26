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
        this.referenceCoords = new Array(4); // the reference corner coordinates

        /**
         * Trajectory control:
         * Trajectory 1 corresponds to the trajectory of the first vertex
         * In the visualization polygon it shows where vertex 5 is sent to via the map
         * Trajectory 2 corresponds to the trajectory of the second vertex
         * In the visualization polygon it shows where vertex 6 is sent to via the map
         */
        this.showTrajectory1 = false;
        this.showTrajectory2 = false;
        this.iteration1 = 6; // number of iterations to show (exponential 2)
        this.iteration2 = 6;
        this.traj1Size = 1;
        this.traj2Size = 1;
        this.trajectory1 = new Array();
        this.trajectory2 = new Array();
        this.setDefault();
    }

    /**
     * Update the visualization of the bigon
     */
    updateVertices() {
        this.verticesToShow = Reconstruct.reconstruct3(this.cornerCoords, this.numVertexToShow);
    }

    getDistanceToReference() {
        return MathHelper.l2dist(this.cornerCoords, this.referenceCoords);
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
        this.updateVertices();

        // reset the number of iterations of the map
        this.map.numIterations = 0;

        // update embedded and convexity information
        this.updateInfo();
        this.getTrajectory();

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
        this.updateVertices();
        this.map.numIterations = 0;
        this.updateInfo();
        this.getTrajectory();
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
                    // clear the number of iterations
                    this.map.numIterations = 0;
                    if (this.inscribed) {
                    } else {
                        this.verticesToShow[i] = [(1-mX)/2, (1-mY)/2, 1];
                    }
                    // change the corner coordinates accordingly, also change the rest of the vertices
                    const tempCoords = Geometry.getCornerCoords(this.verticesToShow.map(a => a.slice()));
                    for (let j = 0; j < 4; j++) {
                        this.cornerCoords[j] = tempCoords[j+4];
                    }
                    this.updateVertices()
                    this.updateInfo();
                    this.getTrajectory();
                    this.updateToPanel = true;
                    this.referenceCoords = this.cornerCoords.slice();
                }
            }
        }
    }


    /**
    * Update the information of the polygon: 
    * Whether the polygon is embedded/convex/bird
    * The nex embedded/convex/bird power of the polygon
    */
    updateInfo() {
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
                temp = this.map.act(temp, false, false);
                const vertices = Reconstruct.reconstruct3(temp, 6);
                if (this.showTrajectory1 && i < Math.pow(2, this.iteration1)) {
                    this.trajectory1[i] = vertices[4];
                }
                if (this.showTrajectory2 && i < Math.pow(2, this.iteration2)) {
                    this.trajectory2[i] = vertices[5];
                }
            }
        } 
    }
}