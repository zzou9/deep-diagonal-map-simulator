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
    constructor(x, y, polygon, map, w=200, h=410) {
        super(x, y, w, h, "Information", color.KHAKI);
        this.polygon = polygon;
        this.map = map;
        // populate the panels
        this.iterateBox = new Button(this.x+25, this.y+40, 150, 20, [["Iteration: " + this.map.numIterations, color.BLACK]], color.KHAKI);
        this.buttons.push(this.iterateBox);

        // record the corner coordinates
        this.x0Box = new Button(this.x+25, this.y+60, 150, 20, [["x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x0Box);
        this.x1Box = new Button(this.x+25, this.y+80, 150, 20, [["x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x1Box);
        this.x2Box = new Button(this.x+25, this.y+100, 150, 20, [["x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x2Box);
        this.x3Box = new Button(this.x+25, this.y+120, 150, 20, [["x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x3Box);
        this.x4Box = new Button(this.x+25, this.y+140, 150, 20, [["x4: " + MathHelper.round(this.polygon.cornerCoords[4], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x4Box);
        this.x5Box = new Button(this.x+25, this.y+160, 150, 20, [["x5: " + MathHelper.round(this.polygon.cornerCoords[5], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.x5Box);

        // record the energy
        this.oBox = new Button(this.x+25, this.y+180, 150, 20, [["O(3, 1): " + MathHelper.round(this.polygon.O, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.oBox);
        this.eBox = new Button(this.x+25, this.y+200, 150, 20, [["E(3, 1): " + MathHelper.round(this.polygon.E, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.eBox);
        this.energyBox = new Button(this.x+25, this.y+220, 150, 20, [["(3, 1) Energy: " + MathHelper.round(this.polygon.energy, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.energyBox);

        // alternative coordinates
        this.e0Box = new Button(this.x+25, this.y+240, 150, 20, [["e0: " + MathHelper.round(this.polygon.energyCoords[0], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.e0Box);
        this.e1Box = new Button(this.x+25, this.y+260, 150, 20, [["e1: " + MathHelper.round(this.polygon.energyCoords[1], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.e1Box);
        this.e2Box = new Button(this.x+25, this.y+280, 150, 20, [["e2: " + MathHelper.round(this.polygon.energyCoords[2], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.e2Box);
        this.e3Box = new Button(this.x+25, this.y+300, 150, 20, [["e3: " + MathHelper.round(this.polygon.energyCoords[3], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.e3Box);
        this.e4Box = new Button(this.x+25, this.y+320, 150, 20, [["e4: " + MathHelper.round(this.polygon.energyCoords[4], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.e4Box);
        this.e5Box = new Button(this.x+25, this.y+340, 150, 20, [["e5: " + MathHelper.round(this.polygon.energyCoords[5], 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.e5Box);

        

        // // eigenvalues of corner coordinates
        // const eigen = this.polygon.eigenvalues;
        // this.lambda1Box = new Button(this.x+25, this.y+140, 150, 20, [["Lambda 1: " + eigen[0].toString(), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.lambda1Box);
        // this.lambda2Box = new Button(this.x+25, this.y+160, 150, 20, [["Lambda 2: " + eigen[1].toString(), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.lambda2Box);
        // this.lambda3Box = new Button(this.x+25, this.y+180, 150, 20, [["Lambda 3: " + eigen[2].toString(), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.lambda3Box);

        // // record some interesting values
        // const val1 = this.polygon.cornerCoords[1] + this.polygon.cornerCoords[3] - 1;
        // this.val1Box = new Button(this.x+25, this.y+160, 150, 20, [["x1 + x3 - 1: " + MathHelper.round(val1, 5), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.val1Box);
        // const val2 = this.polygon.cornerCoords[0] + this.polygon.cornerCoords[2] - 1;
        // this.val2Box = new Button(this.x+25, this.y+180, 150, 20, [["x0 + x2 - 1: " + MathHelper.round(val2, 5), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.val2Box);
        // this.val3Box = new Button(this.x+25, this.y+200, 150, 20, [["val1 / val2: " + MathHelper.round(val1/val2, 5), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.val3Box);
        

        // this.p1p2Box = new Button(this.x+25, this.y+160, 150, 20, [["||P1 P2||: " + MathHelper.round(this.polygon.getP1P2Dist(), 5), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.p1p2Box);
        // this.p2p3Box = new Button(this.x+25, this.y+200, 150, 20, [["||P2 P3||: " + MathHelper.round(this.polygon.getP2P3Dist(), 5), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.p2p3Box);

        // // record distance and monodromy invariants
        // this.distBox = new Button(this.x+25, this.y+220, 150, 20, [["Dist to Ref: " + MathHelper.round(this.polygon.getDistanceToReference(), 5), color.BLACK]], color.KHAKI);
        // this.buttons.push(this.distBox);
        this.invariant1Box = new Button(this.x+25, this.y+360, 150, 20, [["Invariant 1: " + MathHelper.round(this.polygon.omega1, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.invariant1Box);
        this.invariant2Box = new Button(this.x+25, this.y+380, 150, 20, [["Invariant 2: " + MathHelper.round(this.polygon.omega2, 5), color.BLACK]], color.KHAKI);
        this.buttons.push(this.invariant2Box);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
        // this.distBox.text[0][0] = "Dist to Ref: " + MathHelper.round(this.polygon.getDistanceToReference(), 5);
        this.iterateBox.text[0][0] = "Iteration: " + this.map.numIterations;

        // corner coordinates
        this.x0Box.text[0][0] = "x0: " + MathHelper.round(this.polygon.cornerCoords[0], 5);
        this.x1Box.text[0][0] = "x1: " + MathHelper.round(this.polygon.cornerCoords[1], 5);
        this.x2Box.text[0][0] = "x2: " + MathHelper.round(this.polygon.cornerCoords[2], 5);
        this.x3Box.text[0][0] = "x3: " + MathHelper.round(this.polygon.cornerCoords[3], 5);
        this.x4Box.text[0][0] = "x4: " + MathHelper.round(this.polygon.cornerCoords[4], 5);
        this.x5Box.text[0][0] = "x5: " + MathHelper.round(this.polygon.cornerCoords[5], 5);

        // alternative coordinates
        this.e0Box.text[0][0] = "e0: " + MathHelper.round(this.polygon.energyCoords[0], 5);
        this.e1Box.text[0][0] = "e1: " + MathHelper.round(this.polygon.energyCoords[1], 5);
        this.e2Box.text[0][0] = "e2: " + MathHelper.round(this.polygon.energyCoords[2], 5);
        this.e3Box.text[0][0] = "e3: " + MathHelper.round(this.polygon.energyCoords[3], 5);
        this.e4Box.text[0][0] = "e4: " + MathHelper.round(this.polygon.energyCoords[4], 5);
        this.e5Box.text[0][0] = "e5: " + MathHelper.round(this.polygon.energyCoords[5], 5);

        // energy
        const mapRepl = "(" + this.map.l.toString() + ", " + this.map.k.toString() + ") ";
        this.oBox.text[0][0] = "O" + mapRepl + ": " + MathHelper.round(this.polygon.O, 5).toString();
        this.eBox.text[0][0] = "E" + mapRepl + ": " + MathHelper.round(this.polygon.E, 5).toString();
        this.energyBox.text[0][0] = mapRepl + " Energy: " + MathHelper.round(this.polygon.energy, 5).toString();

        // // eigenvalues of monodromy
        // const eigen = this.polygon.eigenvalues;
        // this.lambda1Box.text[0][0] = "Lambda 1: " + eigen[0].toString();
        // this.lambda2Box.text[0][0] = "Lambda 2: " + eigen[1].toString();
        // this.lambda3Box.text[0][0] = "Lambda 3: " + eigen[2].toString();

        // // other values
        // const val1 = this.polygon.cornerCoords[1] + this.polygon.cornerCoords[3] - 1;
        // this.val1Box.text[0][0] = "x1 + x3 - 1: " + MathHelper.round(val1, 5);
        // const val2 = this.polygon.cornerCoords[0] + this.polygon.cornerCoords[2] - 1;
        // this.val2Box.text[0][0] = "x0 + x2 - 1: " + MathHelper.round(val2, 5);
        // this.val3Box.text[0][0] = "val1 / val2: " + MathHelper.round(val1/val2, 5);


        // this.p1p2Box.text[0][0] = "||P1 P2||: " + MathHelper.round(this.polygon.getP1P2Dist(), 5);
        // this.p2p3Box.text[0][0] = "||P2 P3||: " + MathHelper.round(this.polygon.getP2P3Dist(), 5)

        // invariants
        this.invariant1Box.text[0][0] = "Invariant 1: " + MathHelper.round(this.polygon.omega1, 5);
        this.invariant2Box.text[0][0] = "Invariant 2: " + MathHelper.round(this.polygon.omega2, 5);

        // monodromy
    }

    /**
     * Mouse Action
     */
    buttonMouseAction() {
        this.showingControl();
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
                this.h = 410;
            }
        }
    }
}