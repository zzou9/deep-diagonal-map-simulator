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
        const v = polygon.vertices.map(a => a.slice())
        const v_ = Geometry.applyFactor(v, 3);
        const e = Geometry.getEnergyCoords(v_, 3, 1);
        const e_ = Geometry.betaTwo(e);
        const e__ = Geometry.getEnergyCoords(v_, 3, 1);
        console.log("current", e);
        console.log("formula", e_);
        console.log("correct", e__);
        
        // const v__ = Geometry.applyFactor(v_, 1);
        // const e_ = Geometry.getEnergyCoords(v__, 3, 1);
        // console.log("3", e);
        // console.log("3, 1", e_);
        // let prod = 1;
        // let prod_ = 1;
        // for (let i = 0; i < e.length; i++) {
        //     prod *= e[i];
        //     prod_ *= e_[i];
        // }
        // console.log(prod, prod_);
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


