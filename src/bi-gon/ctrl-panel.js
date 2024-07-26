/**
 * A class that stores information of the control panel
 */
class CtrlPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {TwistedBigon} polygon the polygon
     * @param {TwistedMap} map the map
     * @param {Number} w (optional) width of the panel
     * @param {Number} h (optional) height of the panel
     */
    constructor(x, y, polygon, map, w=200, h=190) {
        super(x, y, w, h, "Control", color.CADET_BLUE);
        this.polygon = polygon;
        this.map = map;
        // populate the buttons
        this.numVertexBox = new Button(this.x+25, this.y+40, 100, 20, [["# Vertices: " + this.polygon.numVertexToShow, color.BLACK]]);
        this.buttons.push(this.numVertexBox);
        this.decNumVertex = new TriangleButton(this.x+135, this.y+45, 10, 10, "left");
        this.buttons.push(this.decNumVertex);
        this.incNumVertex = new TriangleButton(this.x+155, this.y+45, 10, 10, "right");
        this.buttons.push(this.incNumVertex);
        this.sizeBox = new Button(this.x+25, this.y+70, 100, 20, [["Vertex Size: " + this.polygon.vertexSize, color.BLACK]]);
        this.buttons.push(this.sizeBox);
        this.decSize = new TriangleButton(this.x+135, this.y+75, 10, 10, "left");
        this.buttons.push(this.decSize);
        this.incSize = new TriangleButton(this.x+155, this.y+75, 10, 10, "right");
        this.buttons.push(this.incSize);
        this.defaultButton = new Button(this.x+25, this.sizeBox.y+this.sizeBox.h+10, 150, 20, [["Set Default", color.BLACK]]);
        this.buttons.push(this.defaultButton);
        this.dragButton = new Button(this.x+25, this.defaultButton.y+this.defaultButton.h+10, 150, 20, [["Drag: ", color.BLACK], ["On", color.GREEN]]);
        this.buttons.push(this.dragButton);
        this.inscribeButton = new Button(this.x+25, this.dragButton.y+this.dragButton.h+10, 150, 20, [["Inscribed: ", color.BLACK], ["Off", color.RED]]);
        this.buttons.push(this.inscribeButton);
    }

    /**
     * Display the panel
     */
    show() {
        this.numVertexBox.text[0][0] = "# Vertices: " + this.polygon.numVertexToShow;
        this.sizeBox.text[0][0] = "Vertex Size: " + this.polygon.vertexSize;
        super.show();
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
        // changing number of vertices to show
        if (this.decNumVertex.isHovering() && this.polygon.numVertexToShow > 6) {
            this.polygon.numVertexToShow -= 1;
            this.polygon.updateVertices();
        }
        if (this.incNumVertex.isHovering() && this.polygon.numVertexToShow < 20) {
            this.polygon.numVertexToShow += 1;
            this.polygon.updateVertices();
        }

        // changing size of the dragging vertices
        if (this.decSize.isHovering() && this.polygon.vertexSize > 4) {
            this.polygon.vertexSize -= 1;
        }
        if (this.incSize.isHovering() && this.polygon.vertexSize < 10) {
            this.polygon.vertexSize += 1;
        }

        // set the bigon back to default
        if (this.defaultButton.isHovering()) {
            this.polygon.setDefault();
        }

        // dragging control
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