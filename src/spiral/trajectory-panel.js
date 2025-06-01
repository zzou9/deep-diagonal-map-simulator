/**
 * A class that stores information of the control panel
 */
class TrajectoryPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {TwistedBigon} polygon the polygon
     * @param {Number} w (optional) width of the panel
     * @param {Number} h (optional) height of the panel
     */
    constructor(x, y, polygon, w=200, h=155) {
        super(x, y, w, h, "Trajectories", color.CADET_BLUE);
        this.polygon = polygon;
        this.showPanel = true;
        this.v = 0; // the vertex to control

        // populate the buttons
        // switch the coordinates to control
        this.switchTrajBox = new Button(this.x+25, this.y+35, 100, 20, [["Vertex: " + this.v.toString(), color.BLACK]]);
        this.buttons.push(this.switchTrajBox);
        this.decVertex = new TriangleButton(this.x+135, this.switchTrajBox.y+5, 10, 10, "left");
        this.buttons.push(this.decVertex);
        this.incVertex = new TriangleButton(this.x+155, this.switchTrajBox.y+5, 10, 10, "right");
        this.buttons.push(this.incVertex);

        this.showTrajectoryButton = new Button(this.x+25, this.switchTrajBox.y+30, 150, 20, [["Hide Trajectory", color.RED]]);
        this.buttons.push(this.showTrajectoryButton);
        this.iterationBox = new Button(this.x+25, this.showTrajectoryButton.y+30, 100, 20, [["# Iterations: " + this.polygon.iteration[this.v], color.BLACK]]);
        this.buttons.push(this.iterationBox);
        this.decIteration = new TriangleButton(this.x+135, this.iterationBox.y+5, 10, 10, "left");
        this.buttons.push(this.decIteration);
        this.incIteration = new TriangleButton(this.x+155, this.iterationBox.y+5, 10, 10, "right");
        this.buttons.push(this.incIteration);
        this.trajSizeBox = new Button(this.x+25, this.iterationBox.y+30, 100, 20, [["Traj. Size: " + this.polygon.trajSize[this.v], color.BLACK]]);
        this.buttons.push(this.trajSizeBox);
        this.decTrajSize = new TriangleButton(this.x+135, this.trajSizeBox.y+5, 10, 10, "left");
        this.buttons.push(this.decTrajSize);
        this.incTrajSize = new TriangleButton(this.x+155, this.trajSizeBox.y+5, 10, 10, "right");
        this.buttons.push(this.incTrajSize);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.switchTrajBox.text[0][0] = "Vertex: " + this.v.toString();
        this.iterationBox.text[0][0] = "# Iterations: " + this.polygon.iteration[this.v];
        this.trajSizeBox.text[0][0] = "Traj. Size: " + this.polygon.trajSize[this.v];
        if (this.polygon.showTrajectory[this.v]) {
            this.showTrajectoryButton.text = [["Hide Trajectory", color.RED]];
        } else {
            this.showTrajectoryButton.text = [["Show Trajectory", color.GREEN]];
        }
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.showingControl();
        if (this.showPanel) {
            // switch vertex to control
            if (this.decVertex.isHovering()) {
                this.v = (this.v-1+this.polygon.n)%(this.polygon.n);
            }
            if (this.incVertex.isHovering()) {
                this.v = (this.v+1)%(this.polygon.n);
            }

            // show trajectory
            if (this.showTrajectoryButton.isHovering()) {
                if (!this.polygon.showTrajectory[this.v]) {
                    this.polygon.showTrajectory[this.v] = true;
                    this.polygon.getTrajectory();
                } else {
                    this.polygon.showTrajectory[this.v] = false;
                }
            }
    
            // number of iterations to show
            if (this.decIteration.isHovering() && this.polygon.iteration[this.v] > 0) {
                this.polygon.iteration[this.v]--;
                this.polygon.getTrajectory();
            }
            if (this.incIteration.isHovering()) {
                this.polygon.iteration[this.v]++;
                this.polygon.getTrajectory();
            }

            // changing the point size of the trajectories
            if (this.decTrajSize.isHovering() && this.polygon.trajSize[this.v] > 1) {
                this.polygon.trajSize[this.v]--;
            }
            if (this.incTrajSize.isHovering() && this.polygon.trajSize[this.v] < this.polygon.vertexSize) {
                this.polygon.trajSize[this.v]++;
            }
        }
    }

    /**
     * Control whether to show or hide the panel
     */
    showingControl() {
        if (mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.w && mouseY <= this.y + 30) {
            if (this.showPanel) {
                this.showPanel = false;
                this.h = 30;
            } else {
                this.showPanel = true;
                this.h = 155;
            }
        }
    }

    /**
     * Update the y positions of the buttons
     */
    updateButtonPositions() {
        this.switchTrajBox.y = this.y+35;
        this.decVertex.y = this.switchTrajBox.y+5;
        this.incVertex.y = this.switchTrajBox.y+5;

        this.showTrajectoryButton.y = this.switchTrajBox.y+30;
        this.iterationBox.y = this.showTrajectoryButton.y+30;
        this.decIteration.y = this.iterationBox.y+5;
        this.incIteration.y = this.iterationBox.y+5;
        this.trajSizeBox.y = this.iterationBox.y+30;
        this.decTrajSize.y = this.trajSizeBox.y+5;
        this.incTrajSize.y = this.trajSizeBox.y+5;
    }
}