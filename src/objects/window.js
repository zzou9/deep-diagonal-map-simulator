/**
 * A superclass of window
 */

class Window {

    /**
     * Constructor
     * @param {number} x x coord
     * @param {number} y y coord
     * @param {number} w width
     * @param {number} h height
     * @param {string} title title
     * @param {string} fill filling color
     */
    constructor(x, y, w, h, title, fill=color.BLACK) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = [this.x+this.w/2, this.y+this.h/2];
        this.canvas = createGraphics(this.w, this.h);
        this.title = title;
        this.fill = fill;
        this.canDrag = false;
    }

    /**
     * Display the panel
     */
    show() {
        // background
        this.canvas.background(this.fill);
        this.canvas.noFill();
        
        // stroke
        if (this.canDrag) {
            stroke(color.GREEN);
        } else {
            stroke(color.WHITE);
        }
        rect(this.x, this.y, this.w, this.h, 2);

        // show bottom right corner
        if (!this.canDrag) {
            noStroke();
            fill(color.RED);
            circle(this.x+this.w, this.y+this.h, 5);
        }
        
        // title
        this.canvas.noStroke();
        this.canvas.textAlign(CENTER, CENTER);
        this.canvas.textFont("Georgia", 12);
        this.canvas.fill(color.WHITE);
        this.canvas.text(this.title, this.w/2, 12);
    }

    /**
     * Check if the mouse is hovering on the window
     */
    isHovering() {
        return mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.w && mouseY <= this.y + this.h;
    }

    /**
     * Action when the mouse is hovering above the window
     */
    mouseAction() {

    }

    /**
     * Toggle dragging of the window
     */
    toggleDrag() {
        if (this.isHovering()) {
            if (this.canDrag) {
                this.canDrag = false;
            } else {
                this.canDrag = true;
            }
        }
    }

    /**
     * 
     */
    mouseDragAction() {
        if (this.canDrag) {
            this.x = mouseX - this.w / 2;
            this.y = mouseY - this.h / 2;
            this.center = [this.x+this.w/2, this.y+this.h/2];
        } else {
            const offset = 10;
            if (mouseX >= this.x+this.w-offset && mouseY >= this.y+this.h-offset && mouseX <= this.x+this.w+offset && mouseY <= this.y+this.h+offset) {
                this.w = mouseX - this.x;
                this.h = mouseY - this.y;
                this.canvas.remove();
                this.canvas = undefined;
                this.canvas = createGraphics(this.w, this.h);
                // this.window.size(this.w, this.h);
                this.center = [this.x+this.w/2, this.y+this.h/2];
            }
        }
    }
}