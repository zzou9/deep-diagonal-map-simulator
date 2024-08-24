let polygon;
let map;

// plotting vertices
let xT;
let yT;

// colors used
const color = {
    BLACK: "#000000",
    WHITE: "#ffffff",
    RED: "#ff0000",
    GREEN: "#00bb00",
    BLUE: "#0000ff",
    CYAN: "#00ffff", 
    CADET_BLUE: "#5f9ea0",
    ROYAL_BLUE: "#4169e1", 
    KHAKI: "#f0e68c"
}

// panels
let normPanel;
let ctrlPanel;
let actionPanel;
let infoPanel;
let shapePanel;
let modulePanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new PentagramMap();
    polygon = new Polygon(map);

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, polygon, map);
    normPanel = new NormalizationPanel(10, ctrlPanel.y+ctrlPanel.h+10, map, polygon);
    actionPanel = new ActionPanel(10, normPanel.y+normPanel.h+10, map, polygon);
    infoPanel = new InfoPanel(windowWidth - 210, 10, polygon, map);
    shapePanel = new ShapePanel(windowWidth - 210, infoPanel.y+infoPanel.h+10, polygon, map);
    modulePanel = new ModulePanel(xT-200, 40, "Home");
}

function draw() {
    background(color.CYAN);
    polygon.show();

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    textFont("Georgia", 20);
    fill(color.BLACK);
    text("Pentagram Map Simulator", xT, 20);
    
    ctrlPanel.show();
    normPanel.show();
    actionPanel.show();
    infoPanel.show();
    shapePanel.show();
    modulePanel.show();
}

function mouseClicked() {
    ctrlPanel.buttonMouseAction();
    normPanel.buttonMouseAction();
    actionPanel.buttonMouseAction();
    if (actionPanel.isRunning) {
        ctrlPanel.disableInscribe();
    }
    shapePanel.buttonMouseAction();
    modulePanel.buttonMouseAction();

    Test.debug();
}

function mouseDragged() {
    // dragging vertices
    polygon.dragVertex();
}

function keyPressed() {
    // applying the map
    if (key === ' ') {
        ctrlPanel.disableInscribe();
        polygon.vertices = map.act(polygon.cloneVertices());
    } else if (key === 'z' || key === 'Z') {
        if (map.canRevert()) {
            ctrlPanel.disableInscribe();
            const prev = map.revert();
            polygon.vertices = prev[0];
            map.numIterations = prev[1];
        }
    }

    // print in the console
    if (key === 'p') {
        const x = Geometry.getCornerCoords(polygon.vertices.map(a => a.slice()));
        const x_ = Geometry.applyShifted31(x);
        console.log("Original:", x);
        console.log("Image:", x_);
    }

    // changing the number of vertices of a polygon
    if (keyCode === UP_ARROW) { 
        if (polygon.twisted) {
            polygon.setDefault(polygon.numVertex+4);
        } else {
            polygon.setDefault(polygon.numVertex+1);
        }
    } else if (keyCode === DOWN_ARROW){ 
        if (polygon.twisted && polygon.numVertex > 3*map.k+4) {
            polygon.setDefault(Math.max(polygon.numVertex-4, 8));
        } else if (polygon.numVertex > 3*map.k+1) {
            polygon.setDefault(Math.max(polygon.numVertex-1, 5));
        }
    }

    // changing the diagonals of the map
    if (keyCode === LEFT_ARROW && map.l > 2) {
        map.l--;
        map.k = map.l - 1;
        map.numIterations = 0;
        actionPanel.updateDiagonalAndSpacing();
    } else if (keyCode === RIGHT_ARROW && polygon.numVertex > 3 * map.l) {
        map.l++;
        map.k = map.l - 1;
        map.numIterations = 0;
        actionPanel.updateDiagonalAndSpacing();
    }

    // update information of the polygon
    polygon.updateInfo();
}
