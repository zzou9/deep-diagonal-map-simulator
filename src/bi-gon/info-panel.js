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
    constructor(x, y, polygon, map, w=200, h=210) {
        super(x, y, w, h, "Information", color.KHAKI);
        this.polygon = polygon;
        this.map = map;
        // populate the panels
        this.iterateBox = new Button(this.x+25, this.y+40, 150, 20, [["Iteration: " + this.map.numIterations, color.BLACK]], color.KHAKI);
        this.buttons.push(this.iterateBox);
        this.x0Box = new Button(this.x+25, this.y+60, 150, 20, [["x0: " + MathHelper.round(this.polygon.cornerCoords[0], 8), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x0Box);
        this.x1Box = new Button(this.x+25, this.y+80, 150, 20, [["x1: " + MathHelper.round(this.polygon.cornerCoords[1], 8), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x1Box);
        this.x2Box = new Button(this.x+25, this.y+100, 150, 20, [["x2: " + MathHelper.round(this.polygon.cornerCoords[2], 8), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x2Box);
        this.x3Box = new Button(this.x+25, this.y+120, 150, 20, [["x3: " + MathHelper.round(this.polygon.cornerCoords[3], 8), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x3Box);
        this.distBox = new Button(this.x+25, this.y+140, 150, 20, [["Dist to Ref: " + MathHelper.round(this.polygon.getDistanceToReference(), 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.distBox);
        this.invariant1Box = new Button(this.x+25, this.y+160, 150, 20, [["Invariant 1: " + MathHelper.round(this.polygon.omega1, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.invariant1Box);
        this.invariant2Box = new Button(this.x+25, this.y+180, 150, 20, [["Invariant 2: " + MathHelper.round(this.polygon.omega2, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.invariant2Box);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.iterateBox.text[0][0] = "Iteration: " + this.map.numIterations;
        this.x0Box.text[0][0] = "x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5);
        this.x1Box.text[0][0] = "x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5);
        this.x2Box.text[0][0] = "x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5);
        this.x3Box.text[0][0] = "x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5);
        this.invariant1Box.text[0][0] = "Invariant 1: " + MathHelper.round(this.polygon.omega1, 5);
        this.invariant2Box.text[0][0] = "Invariant 2: " + MathHelper.round(this.polygon.omega2, 5);
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.updateNumIterations();
    }
}