/**
 * A class that stores information of the control panel
 */
class CtrlPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Polygon} polygon the polygon
     * @param {PentagramMap} map the map
     * @param {Number} w (optional) width of the panel
     * @param {Number} h (optional) height of the panel
     */
    constructor(x, y, polygon, map, w=200, h=100) {
        super(x, y, w, h, "Control Panel", color.CADET_BLUE);
        this.polygon = polygon;
        this.map = map;
        // populate the buttons
        this.numVertexBox = new Button(this.x+25, this.y+40, 100, 20, [["# Vertices: " + this.polygon.numVertex, color.BLACK]]);
        this.buttons.push(this.numVertexBox);
        this.decNumVertex = new TriangleButton(this.x+135, this.y+45, 10, 10, "left");
        this.buttons.push(this.decNumVertex);
        this.incNumVertex = new TriangleButton(this.x+155, this.y+45, 10, 10, "right");
        this.buttons.push(this.incNumVertex);
        this.dragButton = new Button(this.x+25, this.y+70, 150, 20, [["Drag: ", color.BLACK], ["On", color.GREEN]]);
        this.buttons.push(this.dragButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
    }

    /**
     * Update the text in the numVertex box
     * @param {String} num number of vertices
     */
    updateNumVertices(num) {
        this.numVertexBox.text = [["# Vertices: " + num, color.BLACK]];
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        if (this.decNumVertex.isHovering() && this.polygon.numVertex > 5 && this.polygon.numVertex > 3*this.map.k+1) {
            this.polygon.setDefault(this.polygon.numVertex - 1);
            this.numVertexBox.text = [["# Vertices: " + this.polygon.numVertex, color.BLACK]];
        }
        if (this.incNumVertex.isHovering()) {
            this.polygon.setDefault(this.polygon.numVertex + 1);
            this.numVertexBox.text = [["# Vertices: " + this.polygon.numVertex, color.BLACK]];
        }
        if (this.dragButton.isHovering()) {
            if (polygon.canDrag) {
                polygon.canDrag = false;
                this.dragButton.text = [["Drag: ", color.BLACK], ["Off", color.RED]];
            } else {
                polygon.canDrag = true;
                this.dragButton.text = [["Drag: ", color.BLACK], ["On", color.GREEN]];
            }
        }
    }
}