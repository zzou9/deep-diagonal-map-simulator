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
let ctrlPanel;
let actionPanel;
let trajPanel;
let infoPanel;
let shapePanel;
let modulePanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new TwistedMap(l=2);
    polygon = new TwistedBigon(map);
    polygon.canDrag = true;

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, polygon, map);
    actionPanel = new ActionPanel(10, ctrlPanel.y+ctrlPanel.h+10, map, polygon);
    trajPanel = new TrajectoryPanel(10, actionPanel.y+actionPanel.h+10, polygon);
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
    actionPanel.show();
    trajPanel.show();
    infoPanel.show();
    shapePanel.show();
    modulePanel.show();
}

function mouseClicked() {
    ctrlPanel.buttonMouseAction();
    actionPanel.buttonMouseAction();
    if (actionPanel.isRunning) {
        ctrlPanel.disableInscribe();
    }
    trajPanel.buttonMouseAction();
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
        polygon.cornerCoords = map.act(polygon.cornerCoords.slice());
        polygon.updateVertices();
    } else if (key === 'z' || key === 'Z') {
        if (map.canRevert()) {
            ctrlPanel.disableInscribe();
            const prev = map.revert();
            polygon.cornerCoords = prev[0];
            map.numIterations = prev[1];
        }
    }

    if (key === 'p') {
        const S = polygon.getMonodromy()
        console.log(S);
        console.log(polygon.getInvariants());
        console.log(MathHelper.characteristicPoly3(S));
    }

    // changing the number of vertices to show
    if (keyCode === UP_ARROW && polygon.numVertexToShow < 20) { 
        polygon.numVertexToShow += 1;
        polygon.updateVertices();
    } else if (keyCode === DOWN_ARROW && polygon.numVertexToShow > 6){ 
        polygon.numVertexToShow -= 1;
        polygon.updateVertices();
    }

    // changing the diagonals of the map
    if (keyCode === LEFT_ARROW && map.l > 2) {
        map.l--;
        map.k = map.l - 1;
        map.numIterations = 0;
        actionPanel.updateDiagonalAndSpacing();
    } else if (keyCode === RIGHT_ARROW) {
        map.l++;
        map.k = map.l - 1;
        map.numIterations = 0;
        actionPanel.updateDiagonalAndSpacing();
    }

    // update information of the polygon
    polygon.updateInfo();
}
