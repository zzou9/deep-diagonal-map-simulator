/**
 * This is a class for displaying and clicking a button.
 */
class Button {

    /**
     * Constructor
     * @param {Number} x x coordinate of the button
     * @param {Number} y y coordinate of the button
     * @param {Number} w width of the button
     * @param {Number} h height of the button
     * @param {String} text the text being displayed
     * @param {String} fill fill color
     * @param {Number} textSize the size of the text desplayed
     */
    constructor(x, y, w, h, text, fill=color.WHITE, textSize=12) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.fill = fill;
        this.textSize = textSize;
    }

    /**
     * Check whether the mouse hovers on the button.
     * @returns true if the mouse is on the button, false otherwise
     */
    isHovering() {
        return mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.w && mouseY <= this.y + this.h;
    }

    /**
     * Display the button
     */
    show() {
        noStroke();
        fill(this.fill);
        rect(this.x, this.y, this.w, this.h, 5);
        textAlign(LEFT);
        textSize(this.textSize);
        this.drawtext(this.text, this.x + this.w/2, this.y + this.h/2);
    }

    /**
     * draw a text given text-color pairs, aligned center
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Array} text_array the array consisting of text-color pairs
     */
    drawtext(textArray, x, y) {
        // extract raw text
        let rawText = "";
        for (let i = 0; i < textArray.length; i++) {
            rawText += textArray[i][0];
        }
        let pos_x = x - textWidth(rawText)/2;

        // draw the text
        for (let i = 0; i < textArray.length; i++) {
            let part = textArray[i];
            let t = part[0];
            let c = part[1];
            let w = textWidth(t);
            fill(c);
            text(t, pos_x, y);
            pos_x += w;
        }
    }
}