/**
 * A class that stores information of the control panel
 */
class CoordPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {TwistedBigon} polygon the polygon
     * @param {Array<TwistedBigon>} mapPolygons polygon mirrors
     * @param {Number} w (optional) width of the panel
     * @param {Number} h (optional) height of the panel
     */
    constructor(x, y, polygon, mapPolygons, w=200, h=155) {
        super(x, y, w, h, "Coordinates", color.CADET_BLUE);
        this.polygon = polygon;
        this.mapPolygons = mapPolygons;
        this.k = 0; // coordinate to change
        this.rate = -2;

        // populate the buttons
        // switch the coordinates to control
        this.switchCoordBox = new Button(this.x+25, this.y+35, 100, 20, [["Entries: x0, x1", color.BLACK]]);
        this.buttons.push(this.switchCoordBox);
        this.decCoord = new TriangleButton(this.x+135, this.switchCoordBox.y+5, 10, 10, "left");
        this.buttons.push(this.decCoord);
        this.incCoord = new TriangleButton(this.x+155, this.switchCoordBox.y+5, 10, 10, "right");
        this.buttons.push(this.incCoord);

        // control coordinates
        this.x0Box = new Button(this.x+25, this.switchCoordBox.y+30, 100, 20, [["x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5), color.BLACK]]);
        this.buttons.push(this.x0Box);
        this.decX0 = new TriangleButton(this.x+135, this.x0Box.y+5, 10, 10, "left");
        this.buttons.push(this.decX0);
        this.incX0 = new TriangleButton(this.x+155, this.x0Box.y+5, 10, 10, "right");
        this.buttons.push(this.incX0);
        this.x1Box = new Button(this.x+25, this.x0Box.y+30, 100, 20, [["x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5), color.BLACK]]);
        this.buttons.push(this.x1Box);
        this.decX1 = new TriangleButton(this.x+135, this.x1Box.y+5, 10, 10, "left");
        this.buttons.push(this.decX1);
        this.incX1 = new TriangleButton(this.x+155, this.x1Box.y+5, 10, 10, "right");
        this.buttons.push(this.incX1);

        // control rate of change
        this.rateBox = new Button(this.x+25, this.x1Box.y+30, 100, 20, [["Rate: " + this.rate, color.BLACK]]);
        this.buttons.push(this.rateBox);
        this.decRate = new TriangleButton(this.x+135, this.rateBox.y+5, 10, 10, "left");
        this.buttons.push(this.decRate);
        this.incRate = new TriangleButton(this.x+155, this.rateBox.y+5, 10, 10, "right");
        this.buttons.push(this.incRate);
    }

    /**
     * Display the panel
     */
    show() {
        const ind0 = (2*this.k)%(2*this.polygon.n);
        const ind1 = (2*this.k+1)%(2*this.polygon.n);
        this.switchCoordBox.text[0][0] = "Entries: x" + ind0.toString() + ", x" + ind1.toString();
        this.x0Box.text[0][0] = "x" + ind0.toString() + ": " + MathHelper.round(this.polygon.cornerCoords[ind0], 5);
        this.x1Box.text[0][0] = "x" + ind1.toString() + ": " + MathHelper.round(this.polygon.cornerCoords[ind1], 5);
        this.rateBox.text[0][0] = "Rate: " + this.rate;
        super.show();
    }

    /**
     * Disable the inscribed feature of vertices
     */
    disableInscribe() {
        this.polygon.inscribed = false;
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.showingControl();
        if (this.showPanel) {
            // switch coordinates to change
            if (this.decCoord.isHovering()) {
                this.k = (this.k-1+2*this.polygon.n)%(2*this.polygon.n);
            }
            if (this.incCoord.isHovering()) {
                this.k = (this.k+1)%(2*this.polygon.n);
            }

            // rate of changing speed
            if (this.decRate.isHovering()) {
                this.rate--;
            }
            if (this.incRate.isHovering()) {
                this.rate++;
            }
        }
    }

    /**
     * Called when the mouse is pressed to change the corner coordinates
     */
    mousePressedAction() {
        if (this.polygon.canDrag && this.showPanel) {
            const r = this.rate;
            try {
                if (this.decX0.isHovering()) {
                    this.polygon.cornerCoords[(2*this.k)%(2*this.polygon.n)] -= Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
                if (this.incX0.isHovering()) {
                    this.polygon.cornerCoords[(2*this.k)%(2*this.polygon.n)] += Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
        
                if (this.decX1.isHovering()) {
                    this.polygon.cornerCoords[(2*this.k+1)%(2*this.polygon.n)] -= Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
                if (this.incX1.isHovering()) {
                    this.polygon.cornerCoords[(2*this.k+1)%(2*this.polygon.n)] += Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
            }
            catch (err) {
                console.log(err);
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
                this.h = 30
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
        this.switchCoordBox.y = this.y+35;
        this.decCoord.y = this.switchCoordBox.y+5;
        this.incCoord.y = this.switchCoordBox.y+5;

        this.x0Box.y = this.switchCoordBox.y+30;
        this.decX0.y = this.x0Box.y+5;
        this.incX0.y = this.x0Box.y+5;
        this.x1Box.y = this.x0Box.y+30;
        this.decX1.y = this.x1Box.y+5;
        this.incX1.y = this.x1Box.y+5;

        this.rateBox.y = this.x1Box.y+30;
        this.decRate.y = this.rateBox.y+5;
        this.incRate.y = this.rateBox.y+5;
    }
}