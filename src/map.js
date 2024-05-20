class Map {
    /*
        a class that applys the map on the polygon
    */
    constructor(options = {}) {
        this.l = options.l || 2; // the diagonal parameter (# vertices skipped)
        this.k = options.k || 1; // the spacing parameter (# vertices skipped)
        this.prev = []; // keep charge of previous operations (in the form of vertices)
    }

    act(vertices) {
        /*
            Take in a set of vertices and apply the map to it
        */

        // record the previous vertices for undo purposes
        this.prev.push(vertices);
        if (this.prev.length > 20) {
            this.prev.shift();
        }

        // apply the map
        const n = vertices.length;
        let newVertices = new Array();
        for (let i = 0; i < n; i++) {
            // the numbering of the vertices follows from Schwartz's bird paper
            let ver1 = vertices[i%n];
            let ver2 = vertices[(i+this.l)%n];
            let ver3 = vertices[(i-this.k+2*n)%n];
            let ver4 = vertices[(i-this.k+this.l+2*n)%n];
            let ver = this.intersect(ver1, ver2, ver3, ver4);
            newVertices[i] = ver;
        }
        return newVertices;
    }

    canRevert() {
        /*
            A function that checks whether there are any actions to revert
        */
        return this.prev.length;
    }

    revert() {
        /*
            Revert the last action. Can only revert up to 20 times
        */
        console.log(this.prev);
        if (this.prev.length === 0) {
            console.log("nothing to revert")
            return null;
        }
        // pop the last set of vertices
        return this.prev.pop();
    }

    clearHistory() {
        /*
            Clear all histories of the revert actions
        */
        this.prev = [];
        return null;
    }

    intersect(ver1, ver2, ver3, ver4) {
        /*
            This method calculates the intersection of two lines by solving a linear system.
            The method takes in four vertices v_1, v_2, v_3, v_4. It construct two lines using:
                l_1(s) = v_1 + s * (v_2 - v_1)
                l_2(t) = v_3 + s * (v_4 - v_3)
            It then solves for s and t by solving a linear system

        */

        // setting up the linear system
        let mat = [[ver2.x - ver1.x, ver3.x - ver4.x], 
                   [ver2.y - ver1.y, ver3.y - ver4.y]];
        let b = [[ver3.x - ver1.x], 
                 [ver3.y - ver1.y]];
        let matInverse = MathHelper.invert2(mat);
        let param = MathHelper.matrixMult(matInverse, b);

        // finding the intersection point
        let s = param[0][0];
        let interX = ver1.x + s * (ver2.x - ver1.x);
        let interY = ver1.y + s * (ver2.y - ver1.y);
        return createVector(interX, interY);
    }
}