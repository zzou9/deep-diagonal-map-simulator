/**
 * A class that stores information of the polygon
 */
class Polygon{ 
    
    /**
     * Constructor
     * @param {PentagramMap} map the map associated to the polygon
     * @param {Number} numVertex number of vertices of the polygon
     * @param {Array} vertices an array that stores the coords of verteices
     * @param {Boolean} regular whether the polygon is regular
     * @param {Boolean} inscribed whether the polygon is inscribed
     * @param {Number} scale scaling when plotting
     * @param {Boolean} canDrag whether the polygon vertices can be dragged
     */
    constructor(map,
                numVertex=7, 
                vertices=new Array(), 
                regular=true,
                inscribed=true,
                scale=(windowWidth + windowHeight)/20,
                canDrag=true) {
        this.map = map;
        this.numVertex = numVertex; 
        this.vertices = vertices; 
        this.regular = regular;
        this.inscribed = inscribed;
        this.scale = scale; 
        this.center = createVector(0, 0, 1);
        this.canDrag = canDrag;
        this.showDiagonal = false; // display the diagonals in the map
        this.showEllipse = false; // display the ellipse of inertia

        // if regular, populate vertices
        let angle = TWO_PI / this.numVertex;
        for (let counter = 0; counter < this.numVertex; counter++) {
            let sx = this.center.x + cos(angle*counter);
            let sy = this.center.y + sin(angle*counter);
            this.vertices[counter] = createVector(sx, sy, 1);
        }
    }

    /**
     * Set the vertices back to default (regular n-gon)
     * @param {Number} numVertex the number of vertices of the n-gon
     */
    setDefault(numVertex) {
        this.numVertex = numVertex;
        this.regular = true;
        this.inscribed = true;
        this.scale = (windowWidth + windowHeight)/20;
        this.center = createVector(0, 0, 1);
        
        // re-populate the vertices
        this.vertices = new Array();
        let angle = TWO_PI / this.numVertex;
        for (let counter = 0; counter < this.numVertex; counter++) {
            let sx = this.center.x + cos(angle*counter);
            let sy = this.center.y + sin(angle*counter);
            this.vertices[counter] = createVector(sx, sy, 1);
        }
    }

    /**
     * Display the polygon
     */
    show() {
        // translate the coordinate system 
        translate(xT, yT);

        // draw edges
        fill(color.WHITE);
        stroke(color.BLACK);
        beginShape();
        for (let i in this.vertices) {
            vertex(this.vertices[i].x * this.scale, this.vertices[i].y * this.scale);
        }
        endShape(CLOSE);

        // draw the diagonal lines the map is acting on
        if (this.showDiagonal) {
            const l = this.map.l; // diagonal to take
            const k = this.map.k; // points to skip
            const n = this.numVertex; // number of vertices
            
            // draw diagonals
            stroke(color.GREEN);
            for (let i = 0; i < n; i++) {
                line(this.vertices[i%n].x * this.scale, this.vertices[i%n].y * this.scale,
                    this.vertices[(i+l)%n].x * this.scale, this.vertices[(i+l)%n].y * this.scale
                );

            }

            // draw vertices
            fill(color.RED);
            noStroke();
            for (let i = 0; i < n; i++) {
                const ver1 = this.vertices[i%n];
                const ver2 = this.vertices[(i+l)%n];
                const ver3 = this.vertices[(i-k+2*n)%n];
                const ver4 = this.vertices[(i-k+l+2*n)%n];
                const ver = MathHelper.intersect(ver1, ver2, ver3, ver4);
                circle(ver.x * this.scale, ver.y * this.scale, 5);
            }
        }

        // draw the ellipse of inertia
        if (this.showEllipse) {
            const Ip = Normalize.getInertiaMatrix(this.vertices);
            const decomp = MathHelper.spectralDecomposition2(Ip);
            const Q = decomp[0];
            const Lambda = decomp[1];
            const theta = Math.atan(Q[1][0] / Q[0][0]);

            // draw the ellipse
            rotate(-theta);
            noFill();
            stroke(color.GREEN);
            ellipse(0, 0, Math.sqrt(Lambda[0][0], 2) * this.scale, Math.sqrt(Lambda[1][1], 2) * this.scale);
            rotate(theta);
        }

        // draw vertices with color red
        if (this.canDrag) {
            fill(color.RED);
            noStroke();
            for (let i = 0; i < this.vertices.length; i++) {
                circle(this.vertices[i].x * this.scale, this.vertices[i].y * this.scale, 5);
            }
        }

        translate(-xT, -yT);
    }

    /**
     * Drag a vertex 
     */
    dragVertex() {
        if (this.canDrag) {
            const w = 5 / this.scale;
            const mX = (mouseX - xT) / this.scale;
            const mY = (mouseY - yT) / this.scale;
            let dragging = false;
            for (let i in this.vertices) {
                if (mX - w <= this.vertices[i].x && mX + w >= this.vertices[i].x 
                    && mY - w <= this.vertices[i].y && mY + w >= this.vertices[i].y
                    && dragging == false) {
                    dragging = true;
                    this.vertices[i] = createVector(mX, mY, 1);
                }
            }
        }
    }

    /**
     * Print the information of the polygon
     */
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

    /**
     * Deep clone the vertices
     * @returns {Array} a deep clone of the vertices
     */
    cloneVertices() {
        /*
            Return a deep clone of the vertices
        */
        function cloneP5Vector(vector) {
            return createVector(vector.x, vector.y, 1); 
        }
        return this.vertices.map(cloneP5Vector);
    }
}