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
    constructor(current, x=xT-115, y=40, fill=color.CYAN, w=0, h=0) {
        super(x, y, w, h, "", fill);
        this.current = current;

        // populate the buttons
        this.homeButton = new Button(x, y, 50, 20, [["Home", color.BLACK]], color.WHITE);
        this.convexButton = new Button(this.homeButton.x+this.homeButton.w+10, y, 50, 20, [["Convex", color.BLACK]], color.WHITE);
        this.rotationButton = new Button(this.convexButton.x+this.convexButton.w+10, y, 50, 20, [["Rotation", color.BLACK]], color.WHITE);
        this.sevengonButton = new Button(this.rotationButton.x+this.rotationButton.w+10, y, 50, 20, [["7-Gon", color.BLACK]], color.WHITE);
        this.bigonButton = new Button(x, y+25, 50, 20, [["Bi-gon", color.BLACK]], color.WHITE); // starting on second row
        // this.triangleButton = new Button(this.bigonButton.x+this.bigonButton.w+10, y+25, 50, 20, [["Spiral", color.BLACK]], color.WHITE);
        this.spiralButton = new Button(this.bigonButton.x+this.bigonButton.w+10, y+25, 50, 20, [["Spiral", color.BLACK]], color.WHITE);
        this.multiButton = new Button(this.spiralButton.x+this.spiralButton.w+10, y+25, 50, 20, [["Multi", color.BLACK]], color.WHITE);
        this.map31Button = new Button(this.multiButton.x+this.multiButton.w+10, y+25, 50, 20, [["(3, 1)", color.BLACK]], color.WHITE);
        this.buttons.push(this.homeButton);
        this.buttons.push(this.convexButton);
        this.buttons.push(this.rotationButton);
        this.buttons.push(this.sevengonButton);
        this.buttons.push(this.bigonButton);
        // this.buttons.push(this.triangleButton);
        this.buttons.push(this.spiralButton);
        this.buttons.push(this.multiButton);
        this.buttons.push(this.map31Button);

        // highlight the current module
        switch (this.current) {
            case "Home":
                this.homeButton.fill = color.KHAKI;
                break;
            case "Convex":
                this.convexButton.fill = color.KHAKI;
                break;
            case "Rotation":
                this.rotationButton.fill = color.KHAKI;
                break;
            case "7-Gon":
                this.sevengonButton.fill = color.KHAKI;
                break;
            case "Bi-gon":
                this.bigonButton.fill = color.KHAKI;
                break;
            case "Triangle":
                this.triangleButton.fill = color.KHAKI;
                break;
            case "Multi":
                this.multiButton.fill = color.KHAKI;
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
            if (this.convexButton.isHovering() && this.current != "Convex") {
                window.location.href = 'convex.html';
            }
            if (this.rotationButton.isHovering() && this.current != "Rotation") {
                window.location.href = 'rotation.html';
            }
            if (this.sevengonButton.isHovering() && this.current != "7-Gon") {
                window.location.href = '7-gon.html';
            }
            if (this.bigonButton.isHovering() && this.current != "Bi-gon") {
                window.location.href = 'bi-gon.html';
            }
            // if (this.triangleButton.isHovering() && this.current != "Triangle") {
            //     window.location.href = 'triangle.html';
            // }
            if (this.multiButton.isHovering() && this.current != "Multi") {
                window.location.href = 'multi.html';
            }
            if (this.map31Button.isHovering() && this.current != "31-Map") {
                window.location.href = '31-map.html';
            }
            if (this.spiralButton.isHovering() && this.current != "Spiral") {
                window.location.href = 'spiral.html'
            }
        } 
    }
}