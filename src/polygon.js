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
        this.vertices = {};
        let angle = TWO_PI / this.numVertex;
            for (let counter = 0; counter < this.numVertex; counter++) {
                let sx = this.center.x + cos(angle*counter) * this.radius;
                let sy = this.center.y + sin(angle*counter) * this.radius;
                this.vertices[counter] = createVector(sx, sy);
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
            for (let counter = 0; counter < this.numVertex; counter++) {
                let sx = this.center.x + cos(angle*counter) * this.radius;
                let sy = this.center.y + sin(angle*counter) * this.radius;
                this.vertices[counter] = createVector(sx, sy);
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