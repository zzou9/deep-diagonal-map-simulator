/**
 * A class that stores information of the normalization panel
 */
class ModulePanel extends Panel {

    /**
     * Constructor
     * @param {String} current the current module
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {String} [fill=color.CYAN] color of the panel
     * @param {Number} w width of the panel
     * @param {Number} h height of the panel
     */
    constructor(current, x=xT-130, y=40, fill=color.CYAN, w=0, h=0) {
        super(x, y, w, h, "", fill);
        this.current = current;

        // populate the buttons
        this.homeButton = new Button(x, y, 50, 20, [["Home", color.BLACK]], color.WHITE);
        this.spiralButton = new Button(this.homeButton.x+this.homeButton.w+10, y, 50, 20, [["Spiral", color.BLACK]], color.WHITE);
        this.map31Button = new Button(this.spiralButton.x+this.spiralButton.w+10, y, 50, 20, [["T3", color.BLACK]], color.WHITE);
        this.manualButton = new Button(this.map31Button.x+this.map31Button.w+10, y, 80, 20, [["User Manual", color.BLACK]], color.WHITE);
        this.buttons.push(this.homeButton);
        this.buttons.push(this.spiralButton);
        this.buttons.push(this.map31Button);
        this.buttons.push(this.manualButton);

        // highlight the current module
        switch (this.current) {
            case "Home":
                this.homeButton.fill = color.KHAKI;
                break;
            case "31-Map":
                this.map31Button.fill = color.KHAKI;
                break;
            case "Spiral":
                this.spiralButton.fill = color.KHAKI;
        }
    }

    /**
     * Display the panel
     */
    show() {
        super.show();
    }

    buttonMouseAction() { 
        if (this.showPanel) {
            if (this.homeButton.isHovering() && this.current != "Home") {
                window.location.href = 'index.html';
            }
            if (this.map31Button.isHovering() && this.current != "31-Map") {
                window.location.href = '31-map.html';
            }
            if (this.spiralButton.isHovering() && this.current != "Spiral") {
                window.location.href = 'spiral.html';
            }
            if (this.manualButton.isHovering()) {
                window.location.href = 'https://github.com/zzou9/deep-diagonal-map-simulator';
            }
        } 
    }
}