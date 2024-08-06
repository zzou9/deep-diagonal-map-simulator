/**
 * A class that displays a window storing the polygon
 */

class PolygonWindow extends Window {
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
    constructor(x, y, w, h, polygon, title, mapPolygons, fill=color.BLACK) {
        super(x, y, w, h, title, fill);
        this.polygon = polygon;
        this.mapPolygons = mapPolygons;
    }

    /**
     * Display the panel
     */
    show() {
        // background
        super.show();

        // this.polygon.show(this.center[0], this.center[1]);
        this.showPolygon();

        image(this.canvas, this.x, this.y);
    }

    /**
    * Display the polygon
    * @param {number} [xt=xT] x axis translation
    * @param {number} [yt=yT] y axis translation
    */
    showPolygon() {
        // copying info from the polygon
        let verticesToShow = this.polygon.verticesToShow;
        let numVertexToShow = this.polygon.numVertexToShow;
        let scale = this.polygon.scale;
        let canDrag = this.polygon.canDrag;
        let vertexSize = this.polygon.vertexSize;
        let showTrajectory1 = this.polygon.showTrajectory1;
        let showTrajectory2 = this.polygon.showTrajectory2;
        let trajectory1 = this.polygon.trajectory1;
        let trajectory2 = this.polygon.trajectory2;
        let traj1Size = this.polygon.traj1Size;
        let traj2Size = this.polygon.traj2Size;

        // translate the coordinate system 
        this.canvas.translate(this.w/2, this.h/2);

        // draw edges
        this.canvas.fill(255, 255, 255, 127);
        this.canvas.stroke(255, 255, 255);
        this.canvas.beginShape();
        for (let i = 0; i < numVertexToShow; i++) {
            if (MathHelper.round(verticesToShow[i][2]) == 0) {
                throw new Error("Vertex" + i.toString() + "is not on the affine patch");
            }
            const x = verticesToShow[i][0] / verticesToShow[i][2];
            const y = verticesToShow[i][1] / verticesToShow[i][2];
            this.canvas.vertex((1-2*x) * scale, (1-2*y) * scale);
        }
        this.canvas.endShape(CLOSE);

        // draw vertices
        this.canvas.fill(color.WHITE);
        this.canvas.noStroke();
        for (let i = 0; i < numVertexToShow; i++) {
            if (MathHelper.round(verticesToShow[i][2]) == 0) {
                throw new Error("Vertex" + i.toString() + "is not on the affine patch");
            }
            const x = verticesToShow[i][0] / verticesToShow[i][2];
            const y = verticesToShow[i][1] / verticesToShow[i][2];
            this.canvas.circle((1-2*x) * scale, (1-2*y) * scale, 3);
        }


        // emphasize vertices to drag
        if (canDrag) {
            // first vertex
            this.canvas.fill(color.RED);
            this.canvas.stroke(color.BLACK);
            if (MathHelper.round(verticesToShow[4][2]) == 0) {
                throw new Error("Vertex 1 is not on the affine patch");
            }
            const x1 = verticesToShow[4][0] / verticesToShow[4][2];
            const y1 = verticesToShow[4][1] / verticesToShow[4][2];
            this.canvas.circle((1-2*x1) * scale, (1-2*y1) * scale, vertexSize);

            // second vertex
            this.canvas.fill(color.GREEN);
            this.canvas.stroke(color.BLACK);
            if (MathHelper.round(verticesToShow[5][2]) == 0) {
                throw new Error("Vertex 2 is not on the affine patch");
            }
            const x2 = verticesToShow[5][0] / verticesToShow[5][2];
            const y2 = verticesToShow[5][1] / verticesToShow[5][2];
            this.canvas.circle((1-2*x2) * scale, (1-2*y2) * scale, vertexSize);
        }

        // display trajectories
        if (showTrajectory1) {
            this.canvas.fill(color.RED);
            this.canvas.noStroke();
            for (let i = 0; i < trajectory1.length; i++) {
                if (MathHelper.round(trajectory1[i][2] == 0)) {
                    continue;
                }
                const x = trajectory1[i][0] / trajectory1[i][2];
                const y = trajectory1[i][1] / trajectory1[i][2];
                this.canvas.circle((1-2*x) * scale, (1-2*y) * scale, traj1Size);
            }
        }

        // display trajectories
        if (showTrajectory2) {
            this.canvas.fill(color.GREEN);
            this.canvas.noStroke();
            for (let i = 0; i < trajectory2.length; i++) {
                if (MathHelper.round(trajectory2[i][2] == 0)) {
                    continue;
                }
                const x = trajectory2[i][0]  / trajectory2[i][2];
                const y = trajectory2[i][1] / trajectory2[i][2];
                this.canvas.circle((1-2*x) * scale, (1-2*y) * scale, traj2Size);
            }
        }

        this.canvas.translate(-this.w/2, -this.h/2);
    }

    /**
     * 
     */
    mouseDragAction() {
        super.mouseDragAction();
        if (!this.canDrag) {
            this.polygon.dragVertex(this.center[0], this.center[1]);

            // broadcast to other polygons
            for (let i = 0; i < this.mapPolygons.length; i++) {
                this.mapPolygons[i].resetToCoords(this.polygon.cornerCoords);
            }
        }
    }
}