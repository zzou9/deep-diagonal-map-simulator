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
    constructor(x, y, polygon, map, w=200, h=30) {
        super(x, y, w, h, "Shape", color.KHAKI);
        this.polygon = polygon;
        this.coords = polygon.cornerCoords.slice();
        this.vertices = Reconstruct.reconstruct3(this.coords.slice(), 6);
        this.prevCoords = polygon.cornerCoords.slice();
        this.map = map;
        this.showPanel = false;

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
        if (this.showPanel) {
            // this.showPolygon();
        }
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
        this.showingControl();
        if (this.showPanel) {
            if (this.resetButton.isHovering()) {
                this.polygon.resetToCoords(this.coords);
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
                this.h = 30;
            } else {
                this.showPanel = true;
                this.h = 200;
            }
        }
    }

    /**
     * Update the y positions of the buttons
     */
    updateButtonPositions() {
        this.resetButton.y = this.y+this.h-30;
        this.center = [this.x+this.w/2, this.y+this.h/2];
    }

}
