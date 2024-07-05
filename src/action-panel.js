/**
 * A class that stores information of the action panel
 */

class ActionPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {PentagramMap} map the map
     * @param {Polygon} polygon the polygon
     * @param {InfoPanel} infoPanel information panel
     * @param {Number} w the width of the panel
     * @param {Number} h the height of the panel
     */
    constructor(x, y, map, polygon, w=200, h=260) {
        super(x, y, w, h, "Action Panel", color.CADET_BLUE);
        this.map = map;
        this.polygon = polygon;
        this.speed = 1;
        this.action = null;
        this.isRunning = false;

        /**
         * Populate the buttons
         */

        // control k
        this.diagonalBox = new Button(this.x+25, this.y+40, 100, 20, [["Diagonal: " + this.map.l, color.BLACK]]);
        this.buttons.push(this.diagonalBox);
        this.decDiagonal = new TriangleButton(this.x+135, this.y+45, 10, 10, "left");
        this.buttons.push(this.decDiagonal);
        this.incDiagonal = new TriangleButton(this.x+155, this.y+45, 10, 10, "right");
        this.buttons.push(this.incDiagonal);

        // control l
        this.spacingBox = new Button(this.x+25, this.y+70, 100, 20, [["Spacing: " + this.map.k, color.BLACK]]);
        this.buttons.push(this.spacingBox);
        this.decSpacing = new TriangleButton(this.x+135, this.y+75, 10, 10, "left");
        this.buttons.push(this.decSpacing);
        this.incSpacing = new TriangleButton(this.x+155, this.y+75, 10, 10, "right");
        this.buttons.push(this.incSpacing);

        // control the speed the map acts
        this.speedBox = new Button(this.x+25, this.y+100, 100, 20, [["Speed: " + this.speed, color.BLACK]]);
        this.buttons.push(this.speedBox);
        this.decSpeed = new TriangleButton(this.x+135, this.y+105, 10, 10, "left");
        this.buttons.push(this.decSpeed);
        this.incSpeed = new TriangleButton(this.x+155, this.y+105, 10, 10, "right");
        this.buttons.push(this.incSpeed);

        // control the number of times the map acts
        this.powerBox = new Button(this.x+25, this.y+130, 100, 20, [["Power: " + this.map.power, color.BLACK]]);
        this.buttons.push(this.powerBox);
        this.decPower = new TriangleButton(this.x+135, this.y+135, 10, 10, "left");
        this.buttons.push(this.decPower);
        this.incPower = new TriangleButton(this.x+155, this.y+135, 10, 10, "right");
        this.buttons.push(this.incPower);

        // display control
        this.actionButton = new Button(this.x+25, this.y+160, 150, 20, [["Start Action", color.GREEN]]);
        this.buttons.push(this.actionButton);
        this.showDiagonalButton = new Button(this.x+25, this.y+190, 150, 20, [["Show Diagonals", color.GREEN]]);
        this.buttons.push(this.showDiagonalButton);
        this.showEllipseButton = new Button(this.x+25, this.y+220, 150, 20, [["Show Ellipse of Inertia", color.GREEN]]);
        this.buttons.push(this.showEllipseButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
    }

    /**
     * Update the diagonal and spacing box 
     */
    updateDiagonalAndSpacing() {
        this.diagonalBox.text = [["Diagonal: " + this.map.l, color.BLACK]];
        this.spacingBox.text = [["Spacing: " + this.map.k, color.BLACK]];
    }

    /**
     * Call methods when the buttons are clicked
     */
    buttonMouseAction() {
        // diagonal control
        if (this.decDiagonal.isHovering() && this.map.l-1 > this.map.k) {
            this.map.l--;
            this.diagonalBox.text = [["Diagonal: " + this.map.l, color.BLACK]];
        }
        if (this.incDiagonal.isHovering() && this.polygon.numVertex > 3*this.map.l) {
            this.map.l++;
            this.diagonalBox.text = [["Diagonal: " + this.map.l, color.BLACK]];
        }

        // spacing control
        if (this.decSpacing.isHovering() && this.map.k > 1) {
            this.map.k--;
            this.spacingBox.text = [["Spacing: " + this.map.k, color.BLACK]];
        }
        if (this.incSpacing.isHovering() && this.map.k < this.map.l-1 && this.polygon.numVertex > 3*this.map.k+1) {
            this.map.k++;
            this.spacingBox.text = [["Spacing: " + this.map.k, color.BLACK]];
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
        if (this.decPower.isHovering() && this.map.power > 1) {
            this.map.power--;
            this.powerBox.text = [["Power: " + this.map.power, color.BLACK]];
        }
        if (this.incPower.isHovering()) {
            this.map.power++;
            this.powerBox.text = [["Power: " + this.map.power, color.BLACK]];
        }

        // display control
        if (this.actionButton.isHovering()) {
            if (!this.isRunning) {
                this.actionButton.text = [["Pause Action", color.RED]];
                this.action = setInterval(() => {
                    this.polygon.vertices = this.map.act(polygon.cloneVertices());
                    this.polygon.updateEmbedded();
                    this.polygon.updateConvex();
                }, 1000/this.speed);
                this.isRunning = true;
            } else {
                this.actionButton.text = [["Start Action", color.GREEN]];
                clearInterval(this.action);
                this.isRunning = false;
            }
        }
        if (this.showDiagonalButton.isHovering()) {
            if (!this.polygon.showDiagonal) {
                this.polygon.showDiagonal = true;
                this.showDiagonalButton.text = [["Hide Diagonals", color.RED]];
            } else {
                this.polygon.showDiagonal = false;
                this.showDiagonalButton.text = [["Show Diagonals", color.GREEN]];
            }
        }
        if (this.showEllipseButton.isHovering()) {
            if (!this.polygon.showEllipse) {
                this.polygon.showEllipse = true;
                this.showEllipseButton.text = [["Hide Ellipse of Inertia", color.RED]];
            } else {
                this.polygon.showEllipse = false;
                this.showEllipseButton.text = [["Show Ellipse of Inertia", color.GREEN]];
            }
        }
    }
}