/**
 * A class for displaying a triangular button.
 */
class TriangleButton extends Button {

    /**
     * Constructor
     * @param {Number} x x coordinate of the button
     * @param {Number} y y coordinate of the button
     * @param {Number} w width of the button
     * @param {Number} h height of the button
     * @param {String} orientation orientation of the triangle
     * @param {String} text the text being displayed
     * @param {String} fill fill color
     * @param {Number} textSize the size of the text desplayed
     */
    constructor(x, y, w, h, orientation, text="", fill=color.ROYAL_BLUE, textSize=12) {
        super(x, y, w, h, text, fill, textSize);
        this.orientation = orientation;
    }

    getVertices() {
        let vert;
        switch (this.orientation) {
            case "up":
                vert = [this.x, this.y+this.h, this.x+this.w/2, this.y, this.x+this.w, this.y+this.h];
                break;
            case "down":
                vert = [this.x, this.y, this.x+this.w/2, this.y+this.h, this.x+this.w, this.y];
                break;
            case "left":
                vert = [this.x, this.y+this.h/2, this.x+this.w, this.y, this.x+this.w, this.y+this.h];
                break;
            case "right":
                vert = [this.x, this.y, this.x+this.w, this.y+this.h/2, this.x, this.y+this.h];
                break;
            default:
                vert = [this.x, this.y+this.h, this.x+this.w/2, this.y, this.x+this.w, this.y+this.h];
        }
        return vert;
    }

    /**
     * Overriding the show method
     */
    show() {
        stroke(color.BLACK);
        fill(this.fill);
        const v = this.getVertices();
        triangle(v[0], v[1], v[2], v[3], v[4], v[5]);
        textAlign(LEFT);
        textSize(this.textSize);
        super.drawtext(this.text, this.x + this.w/2, this.y + this.h/2);
    }
}