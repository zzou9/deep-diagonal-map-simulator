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
    constructor(x, y, polygon, w=200, h=220) {
        super(x, y, w, h, "Trajectories", color.CADET_BLUE);
        this.polygon = polygon;

        // populate the buttons
        this.showTrajectory1Button = new Button(this.x+25, this.y+40, 150, 20, [["Hide Trajectory 1", color.RED]]);
        this.buttons.push(this.showTrajectory1Button);
        this.iteration1Box = new Button(this.x+25, this.y+70, 100, 20, [["# Iterations: " + this.polygon.iteration1, color.BLACK]]);
        this.buttons.push(this.iteration1Box);
        this.decIteration1 = new TriangleButton(this.x+135, this.y+75, 10, 10, "left");
        this.buttons.push(this.decIteration1);
        this.incIteration1 = new TriangleButton(this.x+155, this.y+75, 10, 10, "right");
        this.buttons.push(this.incIteration1);
        this.traj1SizeBox = new Button(this.x+25, this.y+100, 100, 20, [["Traj. Size: " + this.polygon.traj1Size, color.BLACK]]);
        this.buttons.push(this.traj1SizeBox);
        this.decTraj1Size = new TriangleButton(this.x+135, this.y+105, 10, 10, "left");
        this.buttons.push(this.decTraj1Size);
        this.incTraj1Size = new TriangleButton(this.x+155, this.y+105, 10, 10, "right");
        this.buttons.push(this.incTraj1Size);

        this.showTrajectory2Button = new Button(this.x+25, this.y+130, 150, 20, [["Hide Trajectory 2", color.RED]]);
        this.buttons.push(this.showTrajectory2Button);
        this.iteration2Box = new Button(this.x+25, this.y+160, 100, 20, [["# Iterations: " + this.polygon.iteration2, color.BLACK]]);
        this.buttons.push(this.iteration2Box);
        this.decIteration2 = new TriangleButton(this.x+135, this.y+165, 10, 10, "left");
        this.buttons.push(this.decIteration2);
        this.incIteration2 = new TriangleButton(this.x+155, this.y+165, 10, 10, "right");
        this.buttons.push(this.incIteration2);
        this.traj2SizeBox = new Button(this.x+25, this.y+190, 100, 20, [["Traj. Size: " + this.polygon.traj2Size, color.BLACK]]);
        this.buttons.push(this.traj2SizeBox);
        this.decTraj2Size = new TriangleButton(this.x+135, this.y+195, 10, 10, "left");
        this.buttons.push(this.decTraj2Size);
        this.incTraj2Size = new TriangleButton(this.x+155, this.y+195, 10, 10, "right");
        this.buttons.push(this.incTraj2Size);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.updateTexts();
    }

    /**
     * Update the texts
     */
    updateTexts() {
        this.iteration1Box.text[0][0] = "# Iterations: " + this.polygon.iteration1;
        this.iteration2Box.text[0][0] = "# Iterations: " + this.polygon.iteration2;
        this.traj1SizeBox.text[0][0] = "Traj. Size: " + this.polygon.traj1Size;
        this.traj2SizeBox.text[0][0] = "Traj. Size: " + this.polygon.traj2Size;
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.showingControl();
        if (this.showPanel) {
            // show trajectory
            if (this.showTrajectory1Button.isHovering()) {
                if (!this.polygon.showTrajectory1) {
                    this.polygon.showTrajectory1 = true;
                    this.polygon.getTrajectory();
                    this.showTrajectory1Button.text = [["Hide Trajectory 1", color.RED]];
                } else {
                    this.polygon.showTrajectory1 = false;
                    this.showTrajectory1Button.text = [["Show Trajectory 1", color.GREEN]];
                }
            }
            if (this.showTrajectory2Button.isHovering()) {
                if (!this.polygon.showTrajectory2) {
                    this.polygon.showTrajectory2 = true;
                    this.polygon.getTrajectory();
                    this.showTrajectory2Button.text = [["Hide Trajectory 2", color.RED]];
                } else {
                    this.polygon.showTrajectory2 = false;
                    this.showTrajectory2Button.text = [["Show Trajectory 2", color.GREEN]];
                }
            }
    
            // number of iterations to show
            if (this.decIteration1.isHovering() && this.polygon.iteration1 > 0) {
                this.polygon.iteration1 -= 1;
                this.polygon.getTrajectory();
            }
            if (this.incIteration1.isHovering()) {
                this.polygon.iteration1 += 1;
                this.polygon.getTrajectory();
            }
            if (this.decIteration2.isHovering() && this.polygon.iteration2 > 0) {
                this.polygon.iteration2 -= 1;
                this.polygon.getTrajectory();
            }
            if (this.incIteration2.isHovering()) {
                this.polygon.iteration2 += 1;
                this.polygon.getTrajectory();
            }
            
            // changing the point size of the trajectories
            if (this.decTraj1Size.isHovering() && this.polygon.traj1Size > 1) {
                this.polygon.traj1Size -= 1;
            }
            if (this.incTraj1Size.isHovering() && this.polygon.traj1Size < this.polygon.vertexSize) {
                this.polygon.traj1Size += 1;
            }
            if (this.decTraj2Size.isHovering() && this.polygon.traj2Size > 1) {
                this.polygon.traj2Size -= 1;
            }
            if (this.incTraj2Size.isHovering() && this.polygon.traj2Size < this.polygon.vertexSize) {
                this.polygon.traj2Size += 1;
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
                this.h = 40
            } else {
                this.showPanel = true;
                this.h = 220;
            }
        }
    }

    /**
     * Update the y positions of the buttons
     */
    updateButtonPositions() {
        this.showTrajectory1Button.y = this.y+40;
        this.iteration1Box.y = this.y+70;
        this.decIteration1.y = this.y+75;
        this.incIteration1.y = this.y+75;
        this.traj1SizeBox.y = this.y+100;
        this.decTraj1Size.y = this.y+105;
        this.incTraj1Size.y = this.y+105;

        this.showTrajectory2Button.y = this.y+130;
        this.iteration2Box.y = this.y+160;
        this.decIteration2.y = this.y+165;
        this.incIteration2.y = this.y+165;
        this.traj2SizeBox.y = this.y+190;
        this.decTraj2Size.y = this.y+195;
        this.incTraj2Size.y = this.y+195;
    }
}