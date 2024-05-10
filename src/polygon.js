class Polygon{ 
    /*
        a class that stores information of the polygon
    */
    
    constructor(options = {}) {
        this.numVertex = options.numVertex || 7; // number of vertices of a polygon
        this.vertices = {};
        this.regular = options.regular || true;
        this.inscribed = options.inscribed || true;
        this.scale = options.I || (windowWidth + windowHeight)/20; // scaling factor
        this.center = createVector(options.centerX || 0, options.centerY || 0) // only used to draw regular n-gons

        // if regular, populate vertices
        this.vertices = {};
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
        this.vertices = {};
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

    squareNormalize() {
        /*
            Normalize the shape so that the first four vertices are on the unit square
        */

        // First, record the homogeneous coords of the points
        // to project from, which will be the first four vertices
        // of the polygon

        console.log("Vertices before normalize: ", this.vertices);
        console.log("vertex 0: ", this.vertices[0]);
        console.log("vertex 1: ", this.vertices[1]);
        console.log("vertex 2: ", this.vertices[2]);
        console.log("vertex 3: ", this.vertices[3]);
        const source = [
            [this.vertices[0].x, this.vertices[0].y, 1], 
            [this.vertices[1].x, this.vertices[1].y, 1], 
            [this.vertices[2].x, this.vertices[2].y, 1], 
            [this.vertices[3].x, this.vertices[3].y, 1], 
        ];

        // set up the homogeneous coords of the unit square
        const unitSquare = [
            [1, 1, 1],
            [0, 1, 1],
            [0, 0, 1],
            [1, 0, 1]
        ];

        // get the projection map
        const T = MathHelper.fourToFourProjection(source, unitSquare);
        console.log("T: ", T);
        console.log("Image of v0 under T: ", MathHelper.affineTransform(T, this.vertices[0]));
        console.log("Image of v1 under T: ", MathHelper.affineTransform(T, this.vertices[1]));
        console.log("v2: ", this.vertices[2]);
        console.log("Image of v2 under T: ", MathHelper.affineTransform(T, this.vertices[2]));
        console.log("Image of v3 under T: ", MathHelper.affineTransform(T, this.vertices[3]));

        // transform all the vertices 
        let newVertices = {}
        for (let i in this.vertices) {
            newVertices[i] = MathHelper.affineTransform(T, this.vertices[i]);
        }
        this.vertices = newVertices;

    }
}