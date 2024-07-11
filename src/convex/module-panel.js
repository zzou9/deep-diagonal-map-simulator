/**
 * A class that stores information of the normalization panel
 */
class ModulePanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {PentagramMap} map the map object
     * @param {Polygon} polygon the polygon object
     * @param {Number} w width of the panel
     * @param {Number} h height of the panel
     */
    constructor(x, y, map, polygon, w=200, h=100) {
        super(x, y, w, h, "Module", color.CADET_BLUE);
        this.map = map;
        this.polygon = polygon;
        // populate the buttons
        this.defaultButton = new Button(this.x+25, this.y+40, 150, 20, [["Default", color.GREEN]]);
        this.twistedButton = new Button(this.x+25, this.y+70, 150, 20, [["Twisted", color.BLACK]]);
        this.buttons.push(this.defaultButton);
        this.buttons.push(this.twistedButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
    }

    buttonMouseAction() {  
        if (this.defaultButton.isHovering() && this.map.twisted) {
            this.setDefaultButtonColor();
            this.defaultButton.text[0][1] = color.GREEN;
            this.map.twisted = false;
            this.map.clearHistory();
            this.polygon.twisted = false;
            this.polygon.setDefault(7); // set to a 7-gon
        }
        if (this.twistedButton.isHovering() && !this.map.twisted) {
            this.setDefaultButtonColor();
            this.twistedButton.text[0][1] = color.GREEN;
            this.map.twisted = true;
            this.map.clearHistory();
            this.polygon.twisted = true;
            this.polygon.setDefault(8); // set to a twisted bi-gon
        }
    }

    setDefaultButtonColor() {
        this.defaultButton.text[0][1] = color.BLACK;
        this.twistedButton.text[0][1] = color.BLACK;
    }
}