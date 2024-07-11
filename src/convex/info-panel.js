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
    constructor(x, y, polygon, map, w=200, h=200) {
        super(x, y, w, h, "Information", color.KHAKI);
        this.polygon = polygon;
        this.map = map;
        // populate the panels
        this.iterateBox = new Button(this.x+25, this.y+40, 150, 20, [["Iteration: " + this.map.numIterations, color.BLACK]], color.KHAKI);
        this.buttons.push(this.iterateBox);
        this.embedBox = new Button(this.x+25, this.y+60, 150, 20, [["Embedded: " + this.polygon.embedded, color.BLACK]], color.KHAKI);
        this.buttons.push(this.embedBox);
        this.convexBox = new Button(this.x+25, this.y+80, 150, 20, [["Convex: " + this.polygon.convex, color.BLACK]], color.KHAKI);
        this.buttons.push(this.convexBox);
        this.birdBox = new Button(this.x+25, this.y+100, 150, 20, [[this.map.l + "-Bird: " + this.polygon.isBird, color.BLACK]], color.KHAKI);
        this.buttons.push(this.birdBox);
        this.nextEmbedBox = new Button(this.x+25, this.y+120, 150, 20, [["Next Embedded: " + this.polygon.nextEmbedded, color.BLACK]], color.KHAKI);
        this.buttons.push(this.nextEmbedBox);
        this.nextConvexBox = new Button(this.x+25, this.y+140, 150, 20, [["Next Convex: " + this.polygon.nextConvex, color.BLACK]], color.KHAKI);
        this.buttons.push(this.nextConvexBox);
        this.nextBirdBox = new Button(this.x+25, this.y+160, 150, 20, [["Next Bird: " + this.polygon.nextBird, color.BLACK]], color.KHAKI);
        this.buttons.push(this.nextBirdBox);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.iterateBox.text = [["Iteration: " + this.map.numIterations, color.BLACK]];
        this.embedBox.text = [["Embedded: " + this.polygon.embedded, color.BLACK]];
        this.convexBox.text = [["Convex: " + this.polygon.convex, color.BLACK]];
        this.birdBox.text = [[this.map.l + "-Bird: " + this.polygon.isBird, color.BLACK]];
        this.nextEmbedBox.text = [["Next Embedded: " + this.polygon.nextEmbedded, color.BLACK]];
        this.nextConvexBox.text = [["Next Convex: " + this.polygon.nextConvex, color.BLACK]];
        this.nextBirdBox.text = [["Next Bird: " + this.polygon.nextBird, color.BLACK]];
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.updateNumIterations();
    }
}