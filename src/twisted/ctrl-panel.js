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
    constructor(x, y, polygon, map, w=200, h=130) {
        super(x, y, w, h, "Control", color.CADET_BLUE);
        this.polygon = polygon;
        this.map = map;
        // populate the buttons
        this.numVertexBox = new Button(this.x+25, this.y+40, 100, 20, [["# Vertices: " + this.polygon.numVertex, color.BLACK]]);
        this.buttons.push(this.numVertexBox);
        this.decNumVertex = new TriangleButton(this.x+135, this.y+45, 10, 10, "left");
        this.buttons.push(this.decNumVertex);
        this.incNumVertex = new TriangleButton(this.x+155, this.y+45, 10, 10, "right");
        this.buttons.push(this.incNumVertex);
        this.dragButton = new Button(this.x+25, this.numVertexBox.y+this.numVertexBox.h+10, 150, 20, [["Drag: ", color.BLACK], ["Off", color.RED]]);
        this.buttons.push(this.dragButton);
        this.inscribeButton = new Button(this.x+25, this.dragButton.y+this.dragButton.h+10, 150, 20, [["Inscribed: ", color.BLACK], ["Off", color.RED]]);
        this.buttons.push(this.inscribeButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        this.updateNumVertices();
    }

    /**
     * Update the text in the numVertex box
     */
    updateNumVertices() {
        if (this.polygon.twisted) {
            this.numVertexBox.text[0][0] = "# Vertices: " + Math.floor(this.polygon.numVertex/4);
        } else {
            this.numVertexBox.text[0][0] = "# Vertices: " + this.polygon.numVertex;
        }
    }

    /**
     * Disable the inscribed feature of vertices
     */
    disableInscribe() {
        this.polygon.inscribed = false;
        this.inscribeButton.text = [["Inscribed: ", color.BLACK], ["Off", color.RED]];
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        // changing number of vertices for normal polygons
        if (!this.polygon.twisted) {
            if (this.decNumVertex.isHovering() && this.polygon.numVertex > 5 && this.polygon.numVertex > 3*this.map.k+1) {
                this.polygon.setDefault(this.polygon.numVertex - 1);
            }
            if (this.incNumVertex.isHovering()) {
                this.polygon.setDefault(this.polygon.numVertex + 1);
            }
        }
        
        // changing number of vertices for twisted polygons
        if (this.polygon.twisted) {
            if (this.decNumVertex.isHovering() && this.polygon.numVertex > 11 && this.polygon.numVertex > 3*this.map.k+1) {
                this.polygon.setDefault(this.polygon.numVertex - 4);
            }
            if (this.incNumVertex.isHovering()) {
                this.polygon.setDefault(this.polygon.numVertex + 4);
            }
        }

        if (this.dragButton.isHovering()) {
            if (this.polygon.canDrag) {
                this.polygon.canDrag = false;
                this.dragButton.text = [["Drag: ", color.BLACK], ["Off", color.RED]];
            } else {
                this.polygon.canDrag = true;
                this.dragButton.text = [["Drag: ", color.BLACK], ["On", color.GREEN]];
            }
        }
        if (this.inscribeButton.isHovering()) {
            if (this.polygon.inscribed) {
                this.polygon.inscribed = false;
                this.inscribeButton.text = [["Inscribed: ", color.BLACK], ["Off", color.RED]];
            } else {
                this.polygon.setDefault(this.polygon.numVertex);
                this.polygon.inscribed = true;
                this.inscribeButton.text = [["Inscribed: ", color.BLACK], ["On", color.GREEN]];
            }
        }
    }
}