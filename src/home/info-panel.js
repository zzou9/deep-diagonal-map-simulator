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
    constructor(x, y, polygon, map, w=200, h=130) {
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
        this.energyBox = new Button(this.x+25, this.y+100, 150, 20, [["(2, 1) Energy: " + MathHelper.round(this.polygon.energy, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.energyBox);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.iterateBox.text = [["Iteration: " + this.map.numIterations, color.BLACK]];
        this.embedBox.text = [["Embedded: " + this.polygon.embedded, color.BLACK]];
        this.convexBox.text = [["Convex: " + this.polygon.convex, color.BLACK]];
        const repl = "(" + this.map.l.toString() + ", " + this.map.k.toString() + ") Energy: " + MathHelper.round(this.polygon.energy, 5).toString();
        this.energyBox.text = [[repl, color.BLACK]];
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.updateNumIterations();
    }
}