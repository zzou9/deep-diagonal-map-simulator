/**
 * A class that stores information of the action panel
 */

class ActionPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Array<TwistedMap>} maps the map
     * @param {Array<TwistedBigon>} polygons the polygon
     * @param {InfoPanel} infoPanel information panel
     * @param {Number} w the width of the panel
     * @param {Number} h the height of the panel
     */
    constructor(x, y, maps, polygons, w=200, h=30) {
        super(x, y, w, h, "Action", color.CADET_BLUE);
        this.maps = maps;
        this.mapToEdit = maps[0]; // map that the panel controls
        this.mapToEditInd = 1;
        this.polygons = polygons;
        this.polygonToEdit = polygons[0]; // polygon of the active map
        this.speed = 10;
        this.action = null;
        this.isRunning = false;
        this.showPanel = false;

        /**
         * Populate the buttons
         */

        // toggle map to edit
        this.mapBox = new Button(this.x+25, this.y+40, 100, 20, [["Edit: Map " + this.mapToEditInd.toString(), color.BLACK]]);
        this.buttons.push(this.mapBox);
        this.decMap = new TriangleButton(this.x+135, this.y+45, 10, 10, "left");
        this.buttons.push(this.decMap);
        this.incMap = new TriangleButton(this.x+155, this.y+45, 10, 10, "right");
        this.buttons.push(this.incMap);

        // control k
        this.diagonalBox = new Button(this.x+25, this.y+70, 100, 20, [["Diagonal: " + this.mapToEdit.l, color.BLACK]]);
        this.buttons.push(this.diagonalBox);
        this.decDiagonal = new TriangleButton(this.x+135, this.y+75, 10, 10, "left");
        this.buttons.push(this.decDiagonal);
        this.incDiagonal = new TriangleButton(this.x+155, this.y+75, 10, 10, "right");
        this.buttons.push(this.incDiagonal);

        // control l
        this.spacingBox = new Button(this.x+25, this.y+100, 100, 20, [["Spacing: " + this.mapToEdit.k, color.BLACK]]);
        this.buttons.push(this.spacingBox);
        this.decSpacing = new TriangleButton(this.x+135, this.y+105, 10, 10, "left");
        this.buttons.push(this.decSpacing);
        this.incSpacing = new TriangleButton(this.x+155, this.y+105, 10, 10, "right");
        this.buttons.push(this.incSpacing);

        // control shifting (numbering of vertices)
        this.shiftsBox = new Button(this.x+25, this.y+130, 100, 20, [["Shifts: " + this.mapToEdit.shifts, color.BLACK]]);
        this.buttons.push(this.shiftsBox);
        this.decShifts = new TriangleButton(this.x+135, this.y+135, 10, 10, "left");
        this.buttons.push(this.decShifts);
        this.incShifts = new TriangleButton(this.x+155, this.y+135, 10, 10, "right");
        this.buttons.push(this.incShifts);

        // control the speed the map acts
        this.speedBox = new Button(this.x+25, this.y+160, 100, 20, [["Speed: " + this.speed, color.BLACK]]);
        this.buttons.push(this.speedBox);
        this.decSpeed = new TriangleButton(this.x+135, this.y+165, 10, 10, "left");
        this.buttons.push(this.decSpeed);
        this.incSpeed = new TriangleButton(this.x+155, this.y+165, 10, 10, "right");
        this.buttons.push(this.incSpeed);

        // control the number of times the map acts
        this.powerBox = new Button(this.x+25, this.y+190, 100, 20, [["Power: " + this.mapToEdit.power, color.BLACK]]);
        this.buttons.push(this.powerBox);
        this.decPower = new TriangleButton(this.x+135, this.y+195, 10, 10, "left");
        this.buttons.push(this.decPower);
        this.incPower = new TriangleButton(this.x+155, this.y+195, 10, 10, "right");
        this.buttons.push(this.incPower);

        // display control
        this.actionButton = new Button(this.x+25, this.y+220, 150, 20, [["Start Action", color.GREEN]]);
        this.buttons.push(this.actionButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.mapBox.text = [["Edit: Map " + this.mapToEditInd.toString(), color.BLACK]];
        this.diagonalBox.text = [["Diagonal: " + this.mapToEdit.l, color.BLACK]];
        this.spacingBox.text = [["Spacing: " + this.mapToEdit.k, color.BLACK]];
    }

    /**
     * Helper method
     */
    mapActionHelper() {
        try {
            for (let i = 0; i < this.maps.length; i++) {
                this.polygons[i].cornerCoords = this.maps[i].act(this.polygons[i].cornerCoords.slice());
                this.polygons[i].updateInfo();
            }
        }
        catch (err) {
            clearInterval(this.action);
            console.error(err);
            this.actionButton.text = [["Start Action", color.GREEN]];
            this.isRunning = false;
        }
    }

    /**
     * Called when the action button is pressed or the "a" key is pressed
     */
    mapAction() {
        if (!this.isRunning) {
            this.actionButton.text = [["Pause Action", color.RED]];
            this.action = setInterval(() => this.mapActionHelper(), 1000/this.speed);
            this.isRunning = true;
        } else {
            this.actionButton.text = [["Start Action", color.GREEN]];
            clearInterval(this.action);
            this.isRunning = false;
        }
    }

    /**
     * Call methods when the buttons are clicked
     */
    buttonMouseAction() {
        this.showingControl();
        if (this.showPanel) {
            // edit map control
            if (this.decMap.isHovering() && this.mapToEditInd > 1) {
                this.mapToEditInd -= 1;
                this.mapToEdit = this.maps[this.mapToEditInd-1];
            }
            if (this.incMap.isHovering() && this.mapToEditInd < 2) {
                this.mapToEditInd += 1;
                this.mapToEdit = this.maps[this.mapToEditInd-1];
            }

            // diagonal control
            if (this.decDiagonal.isHovering() && this.mapToEdit.l-1 > this.mapToEdit.k) {
                this.mapToEdit.l--;
                this.polygonToEdit.getTrajectory();
            }
            if (this.incDiagonal.isHovering()) {
                this.mapToEdit.l++;
                this.polygonToEdit.getTrajectory();
            }

            // spacing control
            if (this.decSpacing.isHovering() && this.mapToEdit.k > 1) {
                this.mapToEdit.k--;
                this.polygonToEdit.getTrajectory();
            }
            if (this.incSpacing.isHovering() && this.mapToEdit.k < this.mapToEdit.l-1) {
                this.mapToEdit.k++;
                this.polygonToEdit.getTrajectory();
            }

            // shifting control
            if (this.decShifts.isHovering() && this.mapToEdit.shifts > 0) {
                this.mapToEdit.shifts--;
                this.polygonToEdit.getTrajectory();
            }
            if (this.incShifts.isHovering()) {
                if (this.mapToEdit.twisted) {
                    if (this.mapToEdit.shifts < this.polygonToEdit.numVertex/4-1) {
                        this.mapToEdit.shifts++;
                    }
                } else if (this.mapToEdit.shifts < this.polygonToEdit.numVertex-1) {
                    this.mapToEdit.shifts++;
                }
                this.polygonToEdit.getTrajectory();
            }

            // speed control
            if (this.decSpeed.isHovering() && this.speed > 1) {
                this.speed--;
                this.speedBox.text = [["Speed: " + this.speed, color.BLACK]];
            }
            if (this.incSpeed.isHovering()) {
                this.speed++;
                this.speedBox.text = [["Speed: " + this.speed, color.BLACK]];
            }

            // power control
            if (this.decPower.isHovering() && this.mapToEdit.power > 1) {
                this.mapToEdit.power--;
                this.polygonToEdit.getTrajectory();
            }
            if (this.incPower.isHovering()) {
                this.mapToEdit.power++;
                this.powerBox.text = [["Power: " + this.mapToEdit.power, color.BLACK]];
                this.polygonToEdit.getTrajectory();
            }

            // action control
            if (this.actionButton.isHovering()) {
                this.mapAction();
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
                this.h = 250;
            }
        }
    }

    /**
     * Update the y positions of the buttons
     */
    updateButtonPositions() {
        // control map edit
        this.mapBox.y = this.y+40;
        this.decMap.y = this.y+45;
        this.incMap.y = this.y+45;

        // control k
        this.diagonalBox.y = this.y+70;
        this.decDiagonal.y = this.y+75;
        this.incDiagonal.y = this.y+75;

        // control l
        this.spacingBox.y = this.y+100;
        this.decSpacing.y = this.y+105;
        this.incSpacing.y = this.y+105;

        // control shifting (numbering of vertices)
        this.shiftsBox.y = this.y+130;
        this.decShifts.y = this.y+135;
        this.incShifts.y = this.y+135;

        // control the speed the map acts
        this.speedBox.y = this.y+160;
        this.decSpeed.y = this.y+165;
        this.incSpeed.y = this.y+165;

        // control the number of times the map acts
        this.powerBox.y = this.y+190;
        this.decPower.y = this.y+195;
        this.incPower.y = this.y+195;

        // display control
        this.actionButton.y = this.y+220;
    }
}