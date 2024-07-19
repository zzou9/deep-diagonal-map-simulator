/**
 * A class that stores information of the normalization panel
 */
class NormalizationPanel extends Panel {

    /**
     * Constructor
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {PentagramMap} map the map object
     * @param {Polygon} polygon the polygon object
     * @param {Number} w width of the panel
     * @param {Number} h height of the panel
     */
    constructor(x, y, map, polygon, w=200, h=130) {
        super(x, y, w, h, "Normalization", color.CADET_BLUE);
        this.map = map;
        this.polygon = polygon;
        // populate the buttons
        this.noneButton = new Button(this.x+25, this.y+40, 150, 20, [["None", color.BLACK]]);
        this.squareButton = new Button(this.x+25, this.y+70, 150, 20, [["Square-Normalized", color.BLACK]]);
        this.ellipseButton = new Button(this.x+25, this.y+100, 150, 20, [["Ellipse of Inertia", color.GREEN]]);
        this.buttons.push(this.noneButton);
        this.buttons.push(this.squareButton);
        this.buttons.push(this.ellipseButton);
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
    }

    buttonMouseAction() {  
        if (this.noneButton.isHovering() && this.map.normalization != "None") {
            this.setDefaultButtonColor();
            this.map.normalization = "None";
            this.noneButton.text[0][1] = color.GREEN;
        }
        if (this.squareButton.isHovering() && this.map.normalization != "SquareT") {
            this.setDefaultButtonColor();
            this.map.normalization = "SquareT";
            if (this.map.twisted) {
                this.polygon.vertices = Normalize.twistedSquareNormalize(this.polygon.cloneVertices());
            } else {
                this.polygon.vertices = Normalize.squareNormalize(this.polygon.cloneVertices());
            }
            this.squareButton.text[0][1] = color.GREEN;
        }
        if (this.ellipseButton.isHovering() && this.map.normalization != "Ellipse") {
            this.setDefaultButtonColor();
            this.map.normalization = "Ellipse";
            this.polygon.vertices = Normalize.ellipseNormalize(this.polygon.cloneVertices());
            this.ellipseButton.text[0][1] = color.GREEN;
        }
    }

    setDefaultButtonColor() {
        switch (this.map.normalization) {
            case "None":
                this.noneButton.text[0][1] = color.BLACK;
                break;
            case "SquareT":
                this.squareButton.text[0][1] = color.BLACK;
                break;
            case "Ellipse":
                this.ellipseButton.text[0][1] = color.BLACK;
        }
    }
}