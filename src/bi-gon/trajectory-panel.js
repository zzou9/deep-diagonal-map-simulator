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
    constructor(x, y, polygon, w=200, h=160) {
        super(x, y, w, h, "Trajectories", color.CADET_BLUE);
        this.polygon = polygon;

        // populate the buttons
        this.showTrajectory1Button = new Button(this.x+25, this.y+40, 150, 20, [["Show Trajectory 1", color.GREEN]]);
        this.buttons.push(this.showTrajectory1Button);
        this.trajectory1Box = new Button(this.x+25, this.y+70, 100, 20, [["# Iterations: " + this.polygon.iteration1, color.BLACK]]);
        this.buttons.push(this.trajectory1Box);
        this.decTrajectory1Button = new TriangleButton(this.x+135, this.y+75, 10, 10, "left");
        this.buttons.push(this.decTrajectory1Button);
        this.incTrajectory1Button = new TriangleButton(this.x+155, this.y+75, 10, 10, "right");
        this.buttons.push(this.incTrajectory1Button);

        this.showTrajectory2Button = new Button(this.x+25, this.y+100, 150, 20, [["Show Trajectory 2", color.GREEN]]);
        this.buttons.push(this.showTrajectory2Button);
        this.trajectory2Box = new Button(this.x+25, this.y+130, 100, 20, [["# Iterations: " + this.polygon.iteration2, color.BLACK]]);
        this.buttons.push(this.trajectory2Box);
        this.decTrajectory2Button = new TriangleButton(this.x+135, this.y+135, 10, 10, "left");
        this.buttons.push(this.decTrajectory2Button);
        this.incTrajectory2Button = new TriangleButton(this.x+155, this.y+135, 10, 10, "right");
        this.buttons.push(this.incTrajectory2Button);
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
        this.trajectory1Box.text[0][0] = "# Iterations: " + this.polygon.iteration1;
        this.trajectory2Box.text[0][0] = "# Iterations: " + this.polygon.iteration2;
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
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
        if (this.decTrajectory1Button.isHovering() && this.polygon.iteration1 > 0) {
            this.polygon.iteration1 -= 1;
            this.polygon.getTrajectory();
        }
        if (this.incTrajectory1Button.isHovering()) {
            this.polygon.iteration1 += 1;
            this.polygon.getTrajectory();
        }
        if (this.decTrajectory2Button.isHovering() && this.polygon.iteration2 > 0) {
            this.polygon.iteration2 -= 1;
            this.polygon.getTrajectory();
        }
        if (this.incTrajectory2Button.isHovering()) {
            this.polygon.iteration2 += 1;
            this.polygon.getTrajectory();
        }
        
    }
}