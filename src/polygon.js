class Polygon{ 
    /*
        a class that stores information of the polygon
    */
    constructor(options = {}) {
        this.side = options.side || 5; // number of sides of a polygon
        this.pos = createVector(options.x || 0, options.y || 0);
        this.vertices = {};
        this.regular = options.regular || false;
        this.radius = options.radius || 100;
        this.center = createVector(options.centerX || windowWidth/2, options.centerY || windowHeight/2) // only used to draw regular n-gons

        // if regular, populate vertices
        if (this.regular) {
            let angle = TWO_PI / this.side;
            let counter = 0;
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = this.center.x + cos(a) * this.radius;
                let sy = this.center.y + sin(a) * this.radius;
                this.vertices[counter] = createVector(sx, sy);
                counter++;
            }
        }
    }

    show() {
        beginShape();
        for (let i in this.vertices) {
            vertex(this.vertices[i].x, this.vertices[i].y);
        }
        endShape(CLOSE);
    }
}