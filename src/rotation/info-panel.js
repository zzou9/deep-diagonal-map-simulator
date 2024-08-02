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
    constructor(x, y, polygon, map, w=200, h=190) {
        super(x, y, w, h, "Information", color.KHAKI);
        this.polygon = polygon;
        this.map = map;
        // populate the panels
        this.iterateBox = new Button(this.x+25, this.y+40, 150, 20, [["Iteration: " + this.map.numIterations, color.BLACK]], color.KHAKI);
        this.buttons.push(this.iterateBox);
        this.embedBox = new Button(this.x+25, this.y+60, 150, 20, [["Embedded: " + this.polygon.embedded, color.BLACK]], color.KHAKI);
        this.buttons.push(this.embedBox);
        this.convexBox = new Button(this.x+25, this.y+80, 150, 20, [["Convex: " + this.polygon.embedded, color.BLACK]], color.KHAKI);
        this.buttons.push(this.convexBox);
        this.x0Box = new Button(this.x+25, this.y+100, 150, 20, [["x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x0Box);
        this.x1Box = new Button(this.x+25, this.y+120, 150, 20, [["x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x1Box);
        this.x2Box = new Button(this.x+25, this.y+140, 150, 20, [["x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x2Box);
        this.x3Box = new Button(this.x+25, this.y+160, 150, 20, [["x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x3Box);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.iterateBox.text = [["Iteration: " + this.map.numIterations, color.BLACK]];
        this.embedBox.text = [["Embedded: " + this.polygon.embedded, color.BLACK]];
        this.convexBox.text = [["Convex: " + this.polygon.convex, color.BLACK]];
        this.x0Box.text[0][0] = "x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5);
        this.x1Box.text[0][0] = "x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5);
        this.x2Box.text[0][0] = "x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5);
        this.x3Box.text[0][0] = "x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5);
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.updateNumIterations();
    }
}