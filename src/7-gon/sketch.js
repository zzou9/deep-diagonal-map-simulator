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
    ORANGE: "#ffa500",
    YELLOW: "#ffff00",
    GREEN: "#00bb00",
    BLUE: "#0000ff",
    VIOLET: "#ee82ee",
    PURPLE: "#800080",
    CYAN: "#00ffff", 
    CADET_BLUE: "#5f9ea0",
    ROYAL_BLUE: "#4169e1", 
    KHAKI: "#f0e68c",
    NAVY_BLUE: "#000080"
}

// panels
let normPanel;
let ctrlPanel;
let actionPanel;
// let modulePanel;
let infoPanel;
let shapePanel;

let homeButton;
let convexButton;
let twistedButton;
let sevengonButton;
let modulePanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new PentagramMap(l=3);
    map.shifts = 1;
    map.normalization = "Square";
    map.squareVertices = [5, 6, 1, 3]; // [6, 0, 2, 4] config
    // map.squareVertices = [4, 0, 1, 3]; // [5, 1, 2, 4] config
    polygon = new SevenGon(map);

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, polygon, map);
    normPanel = new NormalizationPanel(10, ctrlPanel.y+ctrlPanel.h+10, map, polygon);
    actionPanel = new ActionPanel(10, normPanel.y+normPanel.h+10, map, polygon);
    infoPanel = new InfoPanel(windowWidth - 210, 10, polygon, map);
    shapePanel = new ShapePanel(windowWidth - 210, infoPanel.y+infoPanel.h+10, polygon, map);
    modulePanel = new ModulePanel(xT-175, 40, "7-Gon", color.BLACK);
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
    // modulePanel.buttonMouseAction();
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
        polygon.vertices = map.act(polygon.vertices);
        // polygon.vertices = Reconstruct.reconstruct(polygon.getImageCornerCoords31());
    } else if (key === 'z' || key === 'Z') {
        if (map.canRevert()) {
            ctrlPanel.disableInscribe();
            const prev = map.revert();
            polygon.vertices = prev[0];
            map.numIterations = prev[1];
        }
    }
    if (key === 'p') {
        let x = map.applyFactor(polygon.vertices.map(a => a.slice()), 3);
        let coord1 = Geometry.getEnergyCoords(x, 3, 1);
        let xPrime = map.applyFactor(map.applyFactor(map.applyFactor(x.map(a => a.slice()), 1), 3), 1);
        let coord2 = Geometry.getEnergyCoords(xPrime, 3, 1);
        console.log("Original:", polygon.energyCoords);
        console.log("Factor 1:", coord1);
        console.log("Factor 2:", coord2);
        let coord3 = Geometry.alphaTwo(polygon.energyCoords);
        let coord4 = Geometry.alphaOne(coord3);
        console.log("Estimate 1:", coord3);
        console.log("Estimate 2:", coord4);

        let e = 1;
        let e1 = 1;
        let e2 = 1;
        let e3 = 1;
        let e4 = 1;
        for (let i = 0; i < 14; i++) {
            e *= polygon.energyCoords[i];
            e1 *= coord1[i];
            e2 *= coord2[i];
            e3 *= coord3[i];
            e4 *= coord4[i];
        }

        console.log("E:", e);
        console.log("E1:", e1);
        console.log("E2:", e2);
        console.log("E3:", e3);
        console.log("E4:", e4);
        
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

// TODO: need to add buttons for changing number of edges


