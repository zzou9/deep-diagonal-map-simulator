/**
 * A class that stores information of the normalization panel
 */
class ModulePanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {PentagramMap} map the map object
     * @param {Number} w width of the panel
     * @param {Number} h height of the panel
     */
    constructor(x, y, map, w=200, h=100) {
        super(x, y, w, h, "Module", color.CADET_BLUE);
        this.module = "Default";
        this.map = map;
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
        if (this.defaultButton.isHovering()) {
            this.setDefaultButtonColor();
            this.defaultButton.text[0][1] = color.GREEN;
            this.module = "Default";
        }
        if (this.twistedButton.isHovering()) {
            this.setDefaultButtonColor();
            this.twistedButton.text[0][1] = color.GREEN;
            this.module = "Twisted";
        }
    }

    setDefaultButtonColor() {
        switch (this.module) {
            case "Default":
                this.defaultButton.text[0][1] = color.BLACK;
                break;
            case "Twisted":
                this.twistedButton.text[0][1] = color.BLACK;
        }
        console.log(this.module);
    }
}