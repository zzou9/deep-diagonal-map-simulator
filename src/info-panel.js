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
        super(x, y, w, h, "Information", color.CADET_BLUE);
        this.polygon = polygon;
        this.map = map;
        // populate the panels
        this.iterateBox = new Button(this.x+25, this.y+40, 150, 20, [["Iteration: " + this.map.numIterations, color.BLACK]], color.CADET_BLUE);
        this.buttons.push(this.iterateBox);
        this.embedBox = new Button(this.x+25, this.y+60, 150, 20, [["Embedded: " + this.polygon.embedded, color.BLACK]], color.CADET_BLUE);
        this.buttons.push(this.embedBox);
        this.convexBox = new Button(this.x+25, this.y+80, 150, 20, [["Convex: " + this.polygon.embedded, color.BLACK]], color.CADET_BLUE);
        this.buttons.push(this.convexBox);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.iterateBox.text = [["Iteration: " + this.map.numIterations, color.BLACK]];
        this.embedBox.text = [["Embedded: " + this.polygon.embedded, color.BLACK]];
        this.convexBox.text = [["Convex: " + this.polygon.convex, color.BLACK]];
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.updateNumIterations();
    }
}