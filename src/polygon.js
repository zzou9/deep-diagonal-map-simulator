class Polygon{ 
    /*
        a class that stores information of the polygon
    */
    constructor(options = {}) {
        this.numVertex = options.numVertex || 7; // number of vertices of a polygon
        this.vertices = {};
        this.regular = options.regular || true;
        this.inscribed = options.inscribed || true;
        this.radius = options.radius || 200;
        this.center = createVector(options.centerX || windowWidth/2, options.centerY || windowHeight/2) // only used to draw regular n-gons

        // if regular, populate vertices
        if (this.regular) {
            let angle = TWO_PI / this.numVertex;
            let counter = 0;
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = this.center.x + cos(a) * this.radius;
                let sy = this.center.y + sin(a) * this.radius;
                this.vertices[counter] = createVector(sx, sy);
                counter++;
            }
        }
    }

    setDefault(numVertex) {
        this.numVertex = numVertex;
        this.regular = true;
        this.inscribed = true;
        this.radius = 200;
        this.center = createVector(windowWidth/2, windowHeight/2)
        
        // re-populate the vertices
        this.vertices = {};
        let angle = TWO_PI / this.numVertex;
            let counter = 0;
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = this.center.x + cos(a) * this.radius;
                let sy = this.center.y + sin(a) * this.radius;
                this.vertices[counter] = createVector(sx, sy);
                counter++;
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