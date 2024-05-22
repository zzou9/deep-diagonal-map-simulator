let polygon;
let map;
// define the visualization of the polygon
const modes = ["Planar", "Unit Square Normalized"]

function setup() {
    createCanvas(windowWidth, windowHeight);
    polygon = new Polygon();
    map = new Map();
}

function draw() {
    background(0, 255, 255);

    push();
    polygon.show();
    pop();
}

function mouseClicked() {
    Test.debug();
    polygon.vertices = Normalize.squareNormalize(polygon.cloneVertices());
}

function keyPressed() {
    // applying the map
    if (key === ' ') {
        polygon.vertices = map.act(polygon.cloneVertices());
    } else if (key === 'r' || key === 'R') {
        if (map.canRevert()) {
            polygon.vertices = map.revert();
        }
    }

    // changing the number of vertices of a polygon
    if (keyCode === UP_ARROW) { // up arrow
        polygon.setDefault(polygon.numVertex+1);
    } else if (keyCode === DOWN_ARROW){ 
        // the number of vertices has to > 4
        polygon.setDefault(Math.max(polygon.numVertex-1,5)); 
        // TODO: may adopt Schwartz 2024 notations
    }
}

// TODO: need to add buttons for changing number of edges

