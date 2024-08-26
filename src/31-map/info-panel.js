/**
 * A class that stores information of the polygon
 */
class InfoPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Polygon} polygon the polygon
     * @param {PentagramMap} map the map
     * @param {Number} w (optional) width of the panel
     * @param {Number} h (optional) height of the panel
     */
    constructor(x, y, polygon, map, w=200, h=440) {
        super(x, y, w, h, "Information", color.KHAKI);
        this.polygon = polygon;
        this.map = map;
        this.coordBoxes = new Array();
        // populate the panels
        this.iterateBox = new Button(this.x+25, this.y+30, 150, 20, [["Iteration: " + this.map.numIterations, color.BLACK]], color.KHAKI);
        this.buttons.push(this.iterateBox);

        // record the corner coordinates
        this.x0Box = new Button(this.x+25, this.iterateBox.y+20, 150, 20, [["x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x0Box);
        this.x1Box = new Button(this.x+25, this.x0Box.y+20, 150, 20, [["x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x1Box);
        this.x2Box = new Button(this.x+25, this.x1Box.y+20, 150, 20, [["x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x2Box);
        this.x3Box = new Button(this.x+25, this.x2Box.y+20, 150, 20, [["x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x3Box);
        this.x4Box = new Button(this.x+25, this.x3Box.y+20, 150, 20, [["x4: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x4Box);
        this.x5Box = new Button(this.x+25, this.x4Box.y+20, 150, 20, [["x5: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x5Box);
        this.x6Box = new Button(this.x+25, this.x5Box.y+20, 150, 20, [["x6: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x6Box);
        this.x7Box = new Button(this.x+25, this.x6Box.y+20, 150, 20, [["x7: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x7Box);
        this.x8Box = new Button(this.x+25, this.x7Box.y+20, 150, 20, [["x8: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x8Box);
        this.x9Box = new Button(this.x+25, this.x8Box.y+20, 150, 20, [["x9: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x9Box);
        this.x10Box = new Button(this.x+25, this.x9Box.y+20, 150, 20, [["x10: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x10Box);
        this.x11Box = new Button(this.x+25, this.x10Box.y+20, 150, 20, [["x11: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x11Box);
        this.x12Box = new Button(this.x+25, this.x11Box.y+20, 150, 20, [["x12: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x12Box);
        this.x13Box = new Button(this.x+25, this.x12Box.y+20, 150, 20, [["x13: --", color.BLACK]], color.KHAKI);
        this.buttons.push(this.x13Box);

        // push the buttons to the coord boxes
        this.coordBoxes.push(this.x0Box);
        this.coordBoxes.push(this.x1Box);
        this.coordBoxes.push(this.x2Box);
        this.coordBoxes.push(this.x3Box);
        this.coordBoxes.push(this.x4Box);
        this.coordBoxes.push(this.x5Box);
        this.coordBoxes.push(this.x6Box);
        this.coordBoxes.push(this.x7Box);
        this.coordBoxes.push(this.x8Box);
        this.coordBoxes.push(this.x9Box);
        this.coordBoxes.push(this.x10Box);
        this.coordBoxes.push(this.x11Box);
        this.coordBoxes.push(this.x12Box);
        this.coordBoxes.push(this.x13Box);

        // record the energy
        this.oBox = new Button(this.x+25, this.x13Box.y+20, 150, 20, [["O(3, 1): " + MathHelper.round(this.polygon.O, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.oBox);
        this.eBox = new Button(this.x+25, this.oBox.y+20, 150, 20, [["E(3, 1): " + MathHelper.round(this.polygon.E, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.eBox);
        this.energyBox = new Button(this.x+25, this.eBox.y+20, 150, 20, [["(3, 1) Energy: " + MathHelper.round(this.polygon.energy, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.energyBox);

        this.invariant1Box = new Button(this.x+25, this.energyBox.y+20, 150, 20, [["Invariant 1: " + MathHelper.round(this.polygon.omega1, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.invariant1Box);
        this.invariant2Box = new Button(this.x+25, this.invariant1Box.y+20, 150, 20, [["Invariant 2: " + MathHelper.round(this.polygon.omega2, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.invariant2Box);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.iterateBox.text[0][0] = "Iteration: " + this.map.numIterations;

        for (let i = 0; i < 14; i++) {
            if (i < this.polygon.cornerCoords.length) {
                this.coordBoxes[i].text[0][0] = "x" + i.toString() + ": " + MathHelper.round(this.polygon.cornerCoords[i], 5);
            } else {
                this.coordBoxes[i].text[0][0] = "x" + i.toString() + ": --";
            }
        }

        // energy
        this.oBox.text[0][0] = "O(3, 1): " + MathHelper.round(this.polygon.O, 5).toString();
        this.eBox.text[0][0] = "E(3, 1): " + MathHelper.round(this.polygon.E, 5).toString();
        this.energyBox.text[0][0] = "(3, 1) Energy: " + MathHelper.round(this.polygon.energy, 5).toString();

        // invariants
        this.invariant1Box.text[0][0] = "Invariant 1: " + MathHelper.round(this.polygon.omega1, 5);
        this.invariant2Box.text[0][0] = "Invariant 2: " + MathHelper.round(this.polygon.omega2, 5);
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.showingControl();
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
                this.h = 440;
            }
        }
    }
}