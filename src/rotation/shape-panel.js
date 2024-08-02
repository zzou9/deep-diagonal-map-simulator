/**
 * A class that stores and shows the shape
 */
class ShapePanel extends Panel {

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
        super(x, y, w, h, "Shape", color.KHAKI);
        this.polygon = polygon;
        this.vertices = polygon.cloneVertices();
        this.prevVertices = polygon.cloneVertices();
        this.map = map;
        this.center = [x + w/2, y + h/2];
        this.scale = Math.min(w, h-20) / 5;
        // populate the buttons
        this.resetButton = new Button(this.x+25, this.y+this.h-30, 150, 20, [["Reset", color.BLACK]]);
        this.buttons.push(this.resetButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.showPolygon();
    }

    /**
     * Show the polygon in the shape box
     */
    showPolygon() {
        // check iteration
        if (this.polygon.updateToPanel) {
            this.vertices = polygon.cloneVertices();
            this.polygon.updateToPanel = false;
        }

        translate(this.center[0], this.center[1]);

        // draw edges
        fill(color.WHITE);
        stroke(color.BLACK);
        beginShape();
        for (let i in this.vertices) {
            vertex(this.vertices[i][0] * this.scale, this.vertices[i][1] * this.scale);
        }
        endShape(CLOSE);
        // draw vertices with color red
        if (this.canDrag) {
            fill(color.RED);
            noStroke();
            for (let i = 0; i < this.vertices.length; i++) {
                circle(this.vertices[i][0] * this.scale, this.vertices[i][1] * this.scale, 5);
            }
        }

        translate(-this.center[0], -this.center[1]);
    }


    /**
     * Mouse Action
     */
    buttonMouseAction() {
        if (this.resetButton.isHovering()) {
            this.polygon.resetToVertices(this.vertices);
        }
    }
}