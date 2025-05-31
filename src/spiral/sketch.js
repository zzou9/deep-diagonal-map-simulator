let polygon;
let map;

// window
let polygonWindow;
// let planeWindow;
let shapePolygon;

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
    INDIGO: "#4b0082",
    GRAY: "#808080"
}

// panels
let ctrlPanel;
let coordPanel;
let actionPanel;
let trajPanel;
let infoPanel;
let modulePanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new TwistedPolygonMap();
    polygon = new TwistedPolygon(map);
    polygon.canDrag = true;
    polygon.vertexSize = 6;
    shapePolygon = new TwistedPolygon(map);
    shapePolygon.canDrag = true;

    // create windows
    shapeWindow = new PolygonWindow(xT*2-310, 500, 300, 300, shapePolygon, "Edit Shape", [polygon], color.INDIGO);

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, shapePolygon, [polygon]);
    coordPanel = new CoordPanel(10, ctrlPanel.y+ctrlPanel.h+10, shapePolygon, [polygon]);
    actionPanel = new ActionPanel(10, coordPanel.y+coordPanel.h+10, map, polygon);
    trajPanel = new TrajectoryPanel(10, actionPanel.y+actionPanel.h+10, polygon);
    infoPanel = new InfoPanel(2*xT - 210, 10, polygon, map);
    modulePanel = new ModulePanel("Spiral");
}

function draw() {
    background(color.BLACK);
    polygon.show();

    // showing windows
    shapeWindow.show();
    // planeWindow.show();

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    textFont("Georgia", 20);
    fill(color.WHITE);
    text("Pentagram Map Simulator", xT, 20);
    
    // showing panels
    ctrlPanel.show();
    coordPanel.show();
    actionPanel.show();
    trajPanel.show();
    infoPanel.show();
    modulePanel.show();

    if (mouseIsPressed) {
        try {
            coordPanel.mousePressedAction();
        }
        catch (err) {
            console.log(err);
        }
    }
        
}

function mouseClicked() {
    // panel actions
    ctrlPanel.buttonMouseAction();
    coordPanel.buttonMouseAction();
    actionPanel.buttonMouseAction();
    trajPanel.buttonMouseAction();
    infoPanel.buttonMouseAction();
    modulePanel.buttonMouseAction();

    // update alignment of panels
    coordPanel.y = ctrlPanel.y+ctrlPanel.h+10;
    actionPanel.y = coordPanel.y+coordPanel.h+10;
    trajPanel.y = actionPanel.y+actionPanel.h+10;
    coordPanel.updateButtonPositions();
    actionPanel.updateButtonPositions();
    trajPanel.updateButtonPositions();
    
    // window actions
    shapeWindow.mouseAction();
}

function mouseDragged() {
    // dragging vertices
    shapeWindow.mouseDragAction();
}

function keyPressed() {
    // applying the map
    if (key === ' ') {
        try {
            polygon.cornerCoords = map.act(polygon.cornerCoords.slice());
            polygon.updateInfo();
        }
        catch (err) {
            console.error(err);
        }
    } else if (key === 'z' || key === 'Z') {
        if (map.canRevert()) {
            const prev = map.revert();
            polygon.cornerCoords = prev[0];
            map.numIterations = prev[1];
        }
    }

    if (key === 'p') {
        console.log(polygon.flags);
        let prod = 1;
        for (let i = 0; i < polygon.flags.length; i++) {
            prod *= polygon.flags[i];
        }
        console.log("Flags", prod);
        console.log(polygon.chi);
        let prod2 = 1;
        for (let i = 0; i < polygon.chi.length; i++) {
            prod2 *= polygon.chi[i];
        }
        console.log("Chi", prod2);
    }

    // window toggle dragging
    if (key === 'w' || key === 'W') {
        shapeWindow.toggleDrag();
    }
    
    // action panel activation
    if (key === 'a' || key === 'A') {
        actionPanel.mapAction();
    }

    // control panel rate
    if (key === 'q') {
        coordPanel.rate -= 1;
    }
    if (key === 'e') {
        coordPanel.rate += 1;
    }

    // changing the number of vertices to show
    if (keyCode === RIGHT_ARROW && polygon.numVertexToShow < 40){ 
        polygon.numVertexToShow++;
        shapePolygon.numVertexToShow++;
        polygon.updateInfo();
        shapePolygon.updateInfo();
    } 
    if (keyCode === LEFT_ARROW && polygon.numVertexToShow > polygon.n+4) { 
        polygon.numVertexToShow--;
        shapePolygon.numVertexToShow--;
        polygon.updateInfo();
        shapePolygon.updateInfo();
    }

    // changing n
    if (keyCode === UP_ARROW && polygon.n < 7) {
        polygon.n++;
        polygon.setDefault();
        polygon.updateInfo(true, true);
        shapePolygon.n++;
        shapePolygon.setDefault();
        shapePolygon.updateInfo(true, true);
        map.clearHistory();
    } 
    if (keyCode === DOWN_ARROW && polygon.n > 2) {
        polygon.n--;
        polygon.setDefault();
        polygon.updateInfo(true, true);
        shapePolygon.n--;
        shapePolygon.setDefault();
        shapePolygon.updateInfo(true, true);
        map.clearHistory();
    }
}