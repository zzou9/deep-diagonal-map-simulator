/**
 * A class that stores information of the control panel
 */
class CtrlPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {TwistedBigon} polygon the polygon
     * @param {Array<TwistedBigon>} mapPolygons polygon mirrors
     * @param {Number} w (optional) width of the panel
     * @param {Number} h (optional) height of the panel
     */
    constructor(x, y, polygon, mapPolygons, w=200, h=310) {
        super(x, y, w, h, "Control", color.CADET_BLUE);
        this.polygon = polygon;
        this.mapPolygons = mapPolygons;
        this.rate = -2;
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

        // corner coordinates
        this.x0Box = new Button(this.x+25, this.y+100, 100, 20, [["x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5), color.BLACK]]);
        this.buttons.push(this.x0Box);
        this.decX0 = new TriangleButton(this.x+135, this.y+105, 10, 10, "left");
        this.buttons.push(this.decX0);
        this.incX0 = new TriangleButton(this.x+155, this.y+105, 10, 10, "right");
        this.buttons.push(this.incX0);
        this.x1Box = new Button(this.x+25, this.y+130, 100, 20, [["x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5), color.BLACK]]);
        this.buttons.push(this.x1Box);
        this.decX1 = new TriangleButton(this.x+135, this.y+135, 10, 10, "left");
        this.buttons.push(this.decX1);
        this.incX1 = new TriangleButton(this.x+155, this.y+135, 10, 10, "right");
        this.buttons.push(this.incX1);
        this.x2Box = new Button(this.x+25, this.y+160, 100, 20, [["x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5), color.BLACK]]);
        this.buttons.push(this.x2Box);
        this.decX2 = new TriangleButton(this.x+135, this.y+165, 10, 10, "left");
        this.buttons.push(this.decX2);
        this.incX2 = new TriangleButton(this.x+155, this.y+165, 10, 10, "right");
        this.buttons.push(this.incX2);
        this.x3Box = new Button(this.x+25, this.y+190, 100, 20, [["x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5), color.BLACK]]);
        this.buttons.push(this.x3Box);
        this.decX3 = new TriangleButton(this.x+135, this.y+195, 10, 10, "left");
        this.buttons.push(this.decX3);
        this.incX3 = new TriangleButton(this.x+155, this.y+195, 10, 10, "right");
        this.buttons.push(this.incX3);

        this.rateBox = new Button(this.x+25, this.y+220, 100, 20, [["Rate: " + this.rate, color.BLACK]]);
        this.buttons.push(this.rateBox);
        this.decRate = new TriangleButton(this.x+135, this.y+225, 10, 10, "left");
        this.buttons.push(this.decRate);
        this.incRate = new TriangleButton(this.x+155, this.y+225, 10, 10, "right");
        this.buttons.push(this.incRate);

        // polygon control
        this.defaultButton = new Button(this.x+25, this.rateBox.y+this.rateBox.h+10, 150, 20, [["Set Default", color.BLACK]]);
        this.buttons.push(this.defaultButton);
        this.dragButton = new Button(this.x+25, this.defaultButton.y+this.defaultButton.h+10, 150, 20, [["Drag: ", color.BLACK], ["On", color.GREEN]]);
        this.buttons.push(this.dragButton);
    }

    /**
     * Display the panel
     */
    show() {
        this.numVertexBox.text[0][0] = "# Vertices: " + this.polygon.numVertexToShow;
        this.sizeBox.text[0][0] = "Vertex Size: " + this.polygon.vertexSize;
        this.x0Box.text[0][0] = "x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5);
        this.x1Box.text[0][0] = "x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5);
        this.x2Box.text[0][0] = "x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5);
        this.x3Box.text[0][0] = "x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5);
        this.rateBox.text[0][0] = "Rate: " + this.rate;
        super.show();
    }

    /**
     * Disable the inscribed feature of vertices
     */
    disableInscribe() {
        this.polygon.inscribed = false;
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.showingControl();
        if (this.showPanel) {
            // changing number of vertices to show
            if (this.decNumVertex.isHovering() && this.polygon.numVertexToShow > 6) {
                this.polygon.numVertexToShow -= 1;
                this.polygon.updateVertices();
                // broadcast to mirrors
                for (let i = 0; i < this.mapPolygons.length; i++) {
                    this.mapPolygons[i].numVertexToShow = this.polygon.numVertexToShow;
                    this.mapPolygons[i].updateVertices();
                }
            }
            if (this.incNumVertex.isHovering() && this.polygon.numVertexToShow < 100) {
                this.polygon.numVertexToShow += 1;
                this.polygon.updateVertices();
                // broadcast to mirrors
                for (let i = 0; i < this.mapPolygons.length; i++) {
                    this.mapPolygons[i].numVertexToShow = this.polygon.numVertexToShow;
                    this.mapPolygons[i].updateVertices();
                }
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
                // broadcast
                for (let i = 0; i < this.mapPolygons.length; i++) {
                    this.mapPolygons[i].setDefault();
                }
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

            // rate of changing speed
            if (this.decRate.isHovering()) {
                this.rate -= 1;
            }
            if (this.incRate.isHovering()) {
                this.rate += 1;
            }
        }
    }

    /**
     * Called when the mouse is pressed to change the corner coordinates
     */
    mousePressedAction() {
        if (this.polygon.canDrag && this.showPanel) {
            const r = this.rate;
            try {
                if (this.decX0.isHovering()) {
                    this.polygon.cornerCoords[0] -= Math.pow(10, r);
                    // this.polygon.cornerCoords[2] -= Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
                if (this.incX0.isHovering()) {
                    this.polygon.cornerCoords[0] += Math.pow(10, r);
                    // this.polygon.cornerCoords[2] += Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
        
                if (this.decX1.isHovering()) {
                    this.polygon.cornerCoords[1] -= Math.pow(10, r);
                    this.polygon.cornerCoords[3] -= Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
                if (this.incX1.isHovering()) {
                    this.polygon.cornerCoords[1] += Math.pow(10, r);
                    this.polygon.cornerCoords[3] += Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
        
                if (this.decX2.isHovering()) {
                    this.polygon.cornerCoords[2] -= Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
                if (this.incX2.isHovering()) {
                    this.polygon.cornerCoords[2] += Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
        
                if (this.decX3.isHovering()) {
                    this.polygon.cornerCoords[3] -= Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
                if (this.incX3.isHovering()) {
                    this.polygon.cornerCoords[3] += Math.pow(10, r);
                    this.polygon.updateInfo(true, true, true);
                    // broadcast to mirrors
                    for (let i = 0; i < this.mapPolygons.length; i++) {
                        this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
                    }
                }
            }
            catch (err) {
                console.log(err);
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
                this.h = 30
            } else {
                this.showPanel = true;
                this.h = 310;
            }
        }
    }

    /**
     * Update the y positions of the buttons
     */
    updateButtonPositions() {
        this.numVertexBox.y = this.y+40;
        this.decNumVertex.y = this.y+45;
        this.incNumVertex.y = this.y+45;
        this.sizeBox.y = this.y+70;
        this.decSize.y = this.y+75;
        this.incSize.y = this.y+75;

        // corner coordinates
        this.x0Box.y = this.y+100;
        this.decX0.y = this.y+105;
        this.incX0.y = this.y+105;
        this.x1Box.y = this.y+130;
        this.decX1.y = this.y+135;
        this.incX1.y = this.y+135;
        this.x2Box.y = this.y+160;
        this.decX2.y = this.y+165;
        this.incX2.y = this.y+165;
        this.x3Box.y = this.y+190;
        this.decX3.y = this.y+195;
        this.incX3.y = this.y+195;

        this.rateBox.y = this.y+220;
        this.decRate.y = this.y+225;
        this.incRate.y = this.y+225;

        // polygon control
        this.defaultButton.y = this.rateBox.y+this.rateBox.h+10
        this.dragButton.y = this.defaultButton.y+this.defaultButton.h+10;
    }
}