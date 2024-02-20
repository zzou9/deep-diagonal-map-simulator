class Polygon{
    constructor(options) {
        this.side = options.side || 5;
        this.pos = createVector(options.x || 0, options.y || 0);
        this.vertices = [];
        this.regular = options.regular || false;
        this.radius = options.radius || 100;
        this.center = createVector(options.centerX || windowWidth/2, options.centerY || windowHeight/2) // only used to draw regular n-gons
    }

    show() {
        // draw the polygon on the canvas
        if (this.regular) {
            let angle = TWO_PI / this.side;
            beginShape();
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = this.center.x + cos(a) * this.radius;
                let sy = this.center.y + sin(a) * this.radius;
                vertex(sx, sy);
            }
            endShape(CLOSE);
        }
        beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
            vertex(this.vertices[i].x, this.vertices(i).y);
        }
        endShape(CLOSE);
    }
}