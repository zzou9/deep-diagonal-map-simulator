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

// buttons to redirect to modules
let homeButton;
let convexButton;
let twistedButton;
let modulePanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new PentagramMap(l=2);
    map.normalization = normalization = "SquareT";
    polygon = new TwistedBigon(map, numVertex=8);
    polygon.canDrag = true;
    polygon.twisted = true;
    map.twisted = true;

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, polygon, map);
    normPanel = new NormalizationPanel(10, ctrlPanel.y+ctrlPanel.h+10, map, polygon);
    actionPanel = new ActionPanel(10, normPanel.y+normPanel.h+10, map, polygon);
    infoPanel = new InfoPanel(windowWidth - 210, 10, polygon, map);
    shapePanel = new ShapePanel(windowWidth - 210, infoPanel.y+infoPanel.h+10, polygon, map);
    modulePanel = new ModulePanel(xT-145, 40, "Bi-gon", color.BLACK);
}

function draw() {
    background(color.BLACK);
    polygon.show();

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    textFont("Georgia", 20);
    fill(color.WHITE);
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

    // changing the number of vertices of a polygon
    if (keyCode === UP_ARROW) { 
        polygon.setDefault(polygon.numVertex+2);
    } else if (keyCode === DOWN_ARROW){ 
        if (polygon.numVertex > 3*map.l) {
            polygon.setDefault(Math.max(polygon.numVertex-2, 8));
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
