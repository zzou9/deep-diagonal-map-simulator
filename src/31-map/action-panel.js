/**
 * A class that stores information of the action panel
 */

class ActionPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {TwistedMap} map the map
     * @param {TwistedBigon} polygon the polygon
     * @param {InfoPanel} infoPanel information panel
     * @param {Number} w the width of the panel
     * @param {Number} h the height of the panel
     */
    constructor(x, y, map, polygon, w=200, h=125) {
        super(x, y, w, h, "Action", color.CADET_BLUE);
        this.map = map;
        this.polygon = polygon;
        this.speed = 10;
        this.action = null;
        this.isRunning = false;
        this.showPanel = true;

        /**
         * Populate the buttons
         */

        // control the speed the map acts
        this.speedBox = new Button(this.x+25, this.y+35, 100, 20, [["Speed: " + this.speed, color.BLACK]]);
        this.buttons.push(this.speedBox);
        this.decSpeed = new TriangleButton(this.x+135, this.speedBox.y+5, 10, 10, "left");
        this.buttons.push(this.decSpeed);
        this.incSpeed = new TriangleButton(this.x+155, this.speedBox.y+5, 10, 10, "right");
        this.buttons.push(this.incSpeed);

        // control the number of times the map acts
        this.powerBox = new Button(this.x+25, this.speedBox.y+30, 100, 20, [["Power: " + this.map.power, color.BLACK]]);
        this.buttons.push(this.powerBox);
        this.decPower = new TriangleButton(this.x+135, this.powerBox.y+5, 10, 10, "left");
        this.buttons.push(this.decPower);
        this.incPower = new TriangleButton(this.x+155, this.powerBox.y+5, 10, 10, "right");
        this.buttons.push(this.incPower);

        // display control
        this.actionButton = new Button(this.x+25, this.powerBox.y+30, 150, 20, [["Start Action", color.GREEN]]);
        this.buttons.push(this.actionButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
    }

    /**
     * Helper method
     */
    mapActionHelper() {
        try {
            polygon.cornerCoords = map.act(polygon.cornerCoords.slice());
            polygon.updateInfo();
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
            if (this.decPower.isHovering() && this.map.power > 1) {
                this.map.power--;
                this.powerBox.text = [["Power: " + this.map.power, color.BLACK]];
                this.polygon.updateInfo(true, false);
            }
            if (this.incPower.isHovering()) {
                this.map.power++;
                this.powerBox.text = [["Power: " + this.map.power, color.BLACK]];
                this.polygon.updateInfo(true, false);
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
                this.h = 125;
            }
        }
    }

    /**
     * Update the y positions of the buttons
     */
    updateButtonPositions() {
        // control the speed the map acts
        this.speedBox.y = this.y+35;
        this.decSpeed.y = this.speedBox.y+5;
        this.incSpeed.y = this.speedBox.y+5;

        // control the number of times the map acts
        this.powerBox.y = this.speedBox.y+30;
        this.decPower.y = this.powerBox.y+5;
        this.incPower.y = this.powerBox.y+5;

        // display control
        this.actionButton.y = this.powerBox.y+30;
    }
}