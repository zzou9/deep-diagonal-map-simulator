/**
 * A superclass of panels
 */

class Panel {

    /**
     * Constructor
     * @param {x coordinate} x 
     * @param {y coordinate} y 
     * @param {width of the panel} w 
     * @param {height of the panel} h 
     * @param {title of the panel} title 
     * @param {background fill} fill 
     */
    constructor(x, y, w, h, title, fill) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.title = title;
        this.fill = fill;
        this.buttons = new Array();
    }

    /**
     * Display the panel
     */
    show() {
        // background
        noStroke();
        fill(color.CADET_BLUE);
        rect(this.x, this.y, this.w, this.h, 5);
        
        // title
        textAlign(CENTER, CENTER);
        textFont("Georgia", 15);
        fill(color.BLACK);
        text(this.title, this.x+this.w/2, this.y+20);

        // buttons
        for (let i in this.buttons) {
            this.buttons[i].show();
        }  
    }
}