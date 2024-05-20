class Polygon{ 
    /*
        a class that stores information of the polygon
    */
    
    constructor(options = {}) {
        this.numVertex = options.numVertex || 7; // number of vertices of a polygon
        this.vertices = new Array(); // store the vertex as an array
        this.regular = options.regular || true;
        this.inscribed = options.inscribed || true;
        this.scale = options.I || (windowWidth + windowHeight)/20; // scaling factor
        this.center = createVector(options.centerX || 0, options.centerY || 0) // only used to draw regular n-gons

        // if regular, populate vertices
        let angle = TWO_PI / this.numVertex;
        for (let counter = 0; counter < this.numVertex; counter++) {
            let sx = this.center.x + cos(angle*counter);
            let sy = this.center.y + sin(angle*counter);
            this.vertices[counter] = createVector(sx, sy);
        }
    }

    setDefault(numVertex) {
        this.numVertex = numVertex;
        this.regular = true;
        this.inscribed = true;
        this.scale = (windowWidth + windowHeight)/20;
        this.center = createVector(0, 0);
        
        // re-populate the vertices
        this.vertices = new Array();
        let angle = TWO_PI / this.numVertex;
        for (let counter = 0; counter < this.numVertex; counter++) {
            let sx = this.center.x + cos(angle*counter);
            let sy = this.center.y + sin(angle*counter);
            this.vertices[counter] = createVector(sx, sy);
        }
    }

    show() {
        beginShape();
        for (let i in this.vertices) {
            const xT = windowWidth/2;
            const yT = windowHeight/2;
            vertex(this.vertices[i].x * this.scale + xT, this.vertices[i].y * this.scale + yT);
        }
        endShape(CLOSE);
    }

    print() {
        /* 
            Print the info of this polygon
        */
        console.log("This is a polygon with", this.numVertex, "vertices:");
        for (let v in this.vertices) {
            // I don't know how to deal with rounding ups
            console.log("vertex", v, "is at", this.vertices[v].x, this.vertices[v].y);
        }
    }

    cloneVertices() {
        /*
            Return a deep clone of the vertices
        */
        function cloneP5Vector(vector) {
            return createVector(vector.x, vector.y); 
        }
        return this.vertices.map(cloneP5Vector);
    }
}