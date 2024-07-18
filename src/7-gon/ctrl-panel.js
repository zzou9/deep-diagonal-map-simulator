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
    constructor(x, y, polygon, map, w=200, h=220) {
        super(x, y, w, h, "Control", color.CADET_BLUE);
        this.polygon = polygon;
        this.map = map;
        // populate the buttons
        this.dragButton = new Button(this.x+25, this.y+40, 150, 20, [["Drag: ", color.BLACK], ["On", color.GREEN]]);
        this.buttons.push(this.dragButton);
        this.inscribeButton = new Button(this.x+25, this.dragButton.y+this.dragButton.h+10, 150, 20, [["Inscribed: ", color.BLACK], ["Off", color.RED]]);
        this.buttons.push(this.inscribeButton);
        this.regularButton = new Button(this.x+25, this.inscribeButton.y+this.inscribeButton.h+10, 150, 20, [["Regular", color.BLACK]]);
        this.buttons.push(this.regularButton);
        this.randomInscribedButton = new Button(this.x+25, this.regularButton.y+this.regularButton.h+10, 150, 20, [["Random Inscribed", color.BLACK]]);
        this.buttons.push(this.randomInscribedButton);
        this.randomConvexButton = new Button(this.x+25, this.randomInscribedButton.y+this.randomInscribedButton.h+10, 150, 20, [["Random Convex", color.BLACK]]);
        this.buttons.push(this.randomConvexButton);
        this.randomStarShapedButton = new Button(this.x+25, this.randomConvexButton.y+this.randomConvexButton.h+10, 150, 20, [["Random Star-Shaped", color.BLACK]]);
        this.buttons.push(this.randomStarShapedButton);
    }

    /**
     * Display the panel
     */
    show() {
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
        // drag the vertices
        if (this.dragButton.isHovering()) {
            if (this.polygon.canDrag) {
                this.polygon.canDrag = false;
                this.dragButton.text = [["Drag: ", color.BLACK], ["Off", color.RED]];
            } else {
                this.polygon.canDrag = true;
                this.dragButton.text = [["Drag: ", color.BLACK], ["On", color.GREEN]];
            }
        }

        // take the vertices to be inscribed
        if (this.inscribeButton.isHovering()) {
            if (this.polygon.inscribed) {
                this.polygon.inscribed = false;
                this.inscribeButton.text = [["Inscribed: ", color.BLACK], ["Off", color.RED]];
            } else {
                this.polygon.setToInscribed();
                this.polygon.inscribed = true;
                this.inscribeButton.text = [["Inscribed: ", color.BLACK], ["On", color.GREEN]];
            }
        }

        // generate a regular n-gon
        if (this.regularButton.isHovering()) {
            this.polygon.setDefault(7);
        }

        // generate a random convex n-gon
        if (this.randomInscribedButton.isHovering()) {
            this.polygon.randomInscribed();
        }
        if (this.randomConvexButton.isHovering()) {
            this.polygon.randomConvex();
        }
        if (this.randomStarShapedButton.isHovering()) {
            this.polygon.randomStarShaped();
        }
    }
}