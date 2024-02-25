let polygons = [];
let polygon;

function setup() {
    createCanvas(windowWidth, windowHeight);
    polygon = new Polygon({side:7, regular: true});
}

function draw() {
    background(255);

    push();
    polygon.show();
    pop();
}

function mouseClicked() {
    console.log(polygon.vertices);
    let map = new Map();
    polygon.vertices = map.act({...polygon.vertices});

    // debug();
}

function debug() {
    // for debug purposes, gets called when the mouse is clicked
    let map = new Map();
    mat1 = [[1,1,0],[0,0,1]];
    b = [[0], [1], [0]];
    mult = map.matrixMult(mat1, b)
    console.log(mult);
}