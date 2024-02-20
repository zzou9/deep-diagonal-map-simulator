let polygons = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);
    let polygon = new Polygon({side:7, regular: true})
    polygons.push(polygon);
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].show();
    }
}