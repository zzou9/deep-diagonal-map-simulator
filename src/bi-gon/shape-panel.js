/**
 * A class that stores and shows the shape
 */
class ShapePanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {TwistedBigon} polygon the polygon
     * @param {TwistedMap} map the map
     * @param {Number} w (optional) width of the panel
     * @param {Number} h (optional) height of the panel
     */
    constructor(x, y, polygon, map, w=200, h=200) {
        super(x, y, w, h, "Shape", color.KHAKI);
        this.polygon = polygon;
        this.coords = polygon.cornerCoords.slice();
        this.vertices = Reconstruct.reconstruct3(this.coords.slice(), 6);
        this.prevCoords = polygon.cornerCoords.slice();
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
            this.coords = polygon.cornerCoords.slice();
            this.vertices = Reconstruct.reconstruct3(this.coords.slice(), 6);
            this.polygon.updateToPanel = false;
        }

        translate(this.center[0], this.center[1]);

        // draw edges
        fill(color.WHITE);
        stroke(color.BLACK);
        beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
            if (MathHelper.round(this.vertices[i][2]) == 0) {
                throw new Error("Vertex" + i.toString() + "is not on the affine patch");
            }
            const x = this.vertices[i][0] / this.vertices[i][2];
            const y = this.vertices[i][1] / this.vertices[i][2];
            vertex((1-2*x) * this.scale, (1-2*y) * this.scale);
        }
        endShape(CLOSE);

        translate(-this.center[0], -this.center[1]);
    }


    /**
     * Mouse Action
     */
    buttonMouseAction() {
        if (this.resetButton.isHovering()) {
            this.polygon.resetToCoords(this.coords);
        }
    }
}