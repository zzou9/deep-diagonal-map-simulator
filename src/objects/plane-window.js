/**
 * A class that displays a window storing the polygon
 */

class PlaneWindow extends Window {
    /**
     * Constructor
     * @param {number} x x coord
     * @param {number} y y coord
     * @param {number} w width
     * @param {number} h height
     * @param {TwistedBigon} polygon the polygon
     * @param {string} title title
     * @param {Array<TwistedBigon>} mapPolygons polygon mirrors
     * @param {string} fill filling color
     */
    constructor(x, y, w, h, polygon, title, mapPolygons, updateInd, fill=color.ROYAL_BLUE) {
        super(x, y, w, h, title, fill);
        this.polygon = polygon;
        this.center = [this.w/2, this.h/2+5];
        this.scale = (this.w+this.h)/10;
        this.pointer = [0, 0];
        this.ind = updateInd;
        this.mapPolygons = mapPolygons;
    }

    /**
     * Display the panel
     */
    show() {
        // background
        super.show();
        this.drawAxes();
        this.drawPointer();
        image(this.canvas, this.x, this.y);
    }

    /**
     * Update the pointer information to the polygon
     */
    updateToPolygons() {
        try {
            let coords = this.polygon.cornerCoords.slice();
            const wT = (this.w/2-5) / this.scale - 1; // width offset
            const hT = (this.h/2-15) / this.scale - 1; // height offset

            // if the pointer is in (-1, 1), update the exact number
            // otherwise, use the tangent function to scale it to infinity
            if (this.pointer[0] > -1 && this.pointer[0] < 1) {
                coords[this.ind[0]] = this.pointer[0];
            } else if (this.pointer[0] >= 1) {
                const a = Math.PI/(4*wT);
                const b = Math.PI/4 - a;
                coords[this.ind[0]] = Math.tan(a*this.pointer[0]+b);
                console.log(Math.tan(Math.PI/4));
            } else {
                const a = Math.PI/(4*wT);
                const b = -Math.PI/4 + a;
                coords[this.ind[0]] = Math.tan(a*this.pointer[0]+b);
            }

            if (this.pointer[1] > -1 && this.pointer[1] < 1) {
                coords[this.ind[1]] = this.pointer[1];
            } else if (this.pointer[1] >= 1) {
                const a = Math.PI/(4*hT);
                const b = Math.PI/4 - a;
                coords[this.ind[1]] = Math.tan(a*this.pointer[1]+b);
            } else {
                const a = Math.PI/(4*hT);
                const b = -Math.PI/4 + a;
                coords[this.ind[1]] = Math.tan(a*this.pointer[1]+b);
            }

            this.polygon.cornerCoords = coords.slice();
            this.polygon.updateInfo();
            // broadcast to all shapes
            for (let i = 0; i < this.mapPolygons.length; i++) {
                this.mapPolygons[i].cornerCoords = coords.slice();
                this.mapPolygons[i].updateInfo();
            }
        }
        catch (err) {
            console.log("Pointer at (" + this.pointer[0].toString() + ", " + this.pointer[1].toString() + ")");
            console.log("Error encountered when updating pointer info to polygon:");
            console.log(err);
        }
    }

    /**
     * Display the axis and lines
     */
    drawAxes() {
        const cX = this.center[0];
        const cY = this.center[1];
        const s = this.scale;
        // draw auxilliary lines
        this.canvas.stroke(color.GRAY);
        this.canvas.strokeWeight(1);
        this.canvas.drawingContext.setLineDash([3, 3]);
        // y = pm 1
        this.canvas.line(5, cY-s, this.w-5, cY-s);
        this.canvas.line(5, cY+s, this.w-5, cY+s);
        // x = pm 1
        this.canvas.line(cX-s, 20, cX-s, this.h-10);
        this.canvas.line(cX+s, 20, cX+s, this.h-10);


        // draw axes
        this.canvas.stroke(color.WHITE);
        this.canvas.drawingContext.setLineDash([]);
        // x-axis
        this.canvas.line(5, cY, this.w-5, cY);
        // y-axis 
        this.canvas.line(cX, 20, cX, this.h-10);
    }

    /**
     * Draw the pointer on the canvas
     */
    drawPointer() {
        const pX = this.pointer[0] * this.scale + this.center[0];
        const pY = -this.pointer[1] * this.scale + this.center[1];
        this.canvas.fill(color.ORANGE);
        this.canvas.stroke(color.BLACK);
        this.canvas.circle(pX, pY, 10);
    }

    /**
     * Drag the pointer around the plane
     */
    dragPointer() {
        const pX = this.pointer[0] * this.scale + this.center[0] + this.x;
        const pY = -this.pointer[1] * this.scale + this.center[1] + this.y;
        if (mouseX > this.x+5 & mouseX < this.x+this.w-5 && mouseY > this.y+20 && mouseY < this.y+this.h-10) {
            if (mouseX >= pX-5 && mouseX <= pX+5 && mouseY >= pY-5 && mouseY <= pY+5) {
                this.pointer = [
                    (mouseX - this.center[0] - this.x) / this.scale,
                    -(mouseY - this.center[1] - this.y) / this.scale
                ];
                // no updates if degenerate
                if (this.pointer[0] != 0 && this.pointer[1] != 0) {
                    this.updateToPolygons();
                }
            }
        }
    }

    /**
     * 
     */
    mouseDragAction() {
        super.mouseDragAction();
        if (!this.canDrag) {
            this.dragPointer();
        }
        // recenter and rescale;
        this.center = [this.w/2, this.h/2+5];
        this.scale = (this.w+this.h)/10;
    }
}